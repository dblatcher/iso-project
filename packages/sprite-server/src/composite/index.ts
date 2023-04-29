import { Router } from "express";
import { cutCell, filepathToSharp, composeImages, applyOptions } from "../util";
import { sendSharpAsImage, getOptionsFromQuery } from "../express-utils";

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

    const sources = await Promise.all([
      filepathToSharp('lpc/BODY_male.png'),
      filepathToSharp('lpc/LEGS_pants_greenish.png'),
      filepathToSharp('lpc/TORSO_leather_armor_torso.png'),
      filepathToSharp('lpc/HEAD_chain_armor_helmet.png'),
      // filepathToSharp('lpc/HEAD_leather_armor_hat.png'),
    ])
    const cellImages = await Promise.all(sources.map(source =>
      cutCell(source, { cellHeight: 64, cellWidth: 64 }, rowIndex, colIndex)
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

export { compositeRouter }
