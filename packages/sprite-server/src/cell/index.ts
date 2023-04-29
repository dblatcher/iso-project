import { Router } from "express";
import { assets } from "../assetData";
import { cutCell, assetToSharp } from "./util";
import { sendSharpAsImage } from "../express-utils";

const cellRouter = Router()


cellRouter.get('/:assetId/:row/:col', async (req, res) => {
  try {
    const { assetId, row, col } = req.params
    const assetData = assets[assetId]
    if (!assetData) {
      return res.status(404).send({ message: 'not found', asset: assetId, row, col })
    }

    const source = await assetToSharp(assetData)
    const cellImage = await cutCell(source, assetData, +row, +col)
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
