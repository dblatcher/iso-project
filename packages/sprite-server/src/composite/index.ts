import { Router } from "express";
import { cutCell, assetToSharp, composeImages, applyOptions, getLayerAssets } from "../util";
import { sendSharpAsImage, getOptionsFromQuery } from "../express-utils";
import { assets } from "../assetData";

const compositeRouter = Router()


compositeRouter.get('/:row/:col', async (req, res) => {
  try {
    const { row, col } = req.params
    const rowIndex = Number(row)
    const colIndex = Number(col)
    if (isNaN(rowIndex) || isNaN(colIndex)) {
      return res.status(400).send({
        message: 'non-numeric row or column',
        row, col
      })
    }
    const options = getOptionsFromQuery(req)

    const layerAssets = getLayerAssets(options, assets)
    if (layerAssets.length === 0) {
      return res.status(400).send(
        'no valid layers'
      )
    }

    const sources = await Promise.all(layerAssets.map(assetToSharp))
    const cellImages = await Promise.all(sources.map((source, index) =>
      cutCell(source, layerAssets[index], rowIndex, colIndex)
    ))
    const composite = await composeImages(cellImages)
    applyOptions(composite, options)
    return sendSharpAsImage(composite, res)

  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'UNKNOWN ERROR'
    console.warn(err)
    return res.status(500).send({ message, errorIn: 'compositeRouter' })
  }
})

compositeRouter.get('/', async (req, res) => {
  try {
    const options = getOptionsFromQuery(req)

    const layerAssets = getLayerAssets(options, assets)
    if (layerAssets.length === 0) {
      return res.status(400).send(
        'no valid layers'
      )
    }

    const sources = await Promise.all(layerAssets.map(assetToSharp))

    const composite = await composeImages(sources)
    applyOptions(composite, options)
    return sendSharpAsImage(composite, res)

  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'UNKNOWN ERROR'
    console.warn(err)
    return res.status(500).send({ message, errorIn: 'compositeRouter' })
  }
})

export { compositeRouter }
