import { Router } from "express";
import { assets } from "../assetData";
import { cutCell, assetToSharp, applyOptions } from "../util";
import { sendSharpAsImage, getOptionsFromQuery } from "../express-utils";

const cellRouter = Router()


cellRouter.get('/:assetId/:row/:col', async (req, res) => {
  try {
    const { assetId, row, col } = req.params
    const assetData = assets[assetId]
    const option = getOptionsFromQuery(req)

    if (!assetData) {
      return res.status(404).send({
        message: 'not found',
        assetId, row, col
      })
    }
    const rowIndex = Number(row)
    const colIndex = Number(col)
    if (isNaN(rowIndex) || isNaN(colIndex)) {
      return res.status(400).send({
        message: 'non-numeric row or column',
        assetId, row, col
      })
    }

    const source = await assetToSharp(assetData)
    const cellImage = await cutCell(source, assetData, rowIndex, colIndex)
    applyOptions(source, option)
    return sendSharpAsImage(cellImage, res)
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : typeof err === 'string'
        ? err
        : 'UNKNOWN ERROR'
    console.warn(err)
    return res.status(500).send({ message, errorIn: 'cellRouter' })
  }
})

export { cellRouter }
