import { Router, Response } from "express";
import { Sharp } from "sharp";
import { assets } from "../assetData";
import { cutCell } from "./util";

const cellRouter = Router()

const sendSharpAsImage = async (sharp: Sharp, res: Response) => {
  const [buffer, metadata] = await Promise.all([sharp.toBuffer(), sharp.metadata()])
  res.writeHead(200, {
    "Content-Type": `image/${metadata.format}`,
  })
  return res.end(buffer)
}

cellRouter.get('/:assetId/:row/:col', async (req, res) => {
  try {
    const { assetId, row, col } = req.params
    const asset = assets[assetId]
    if (!asset) {
      return res.status(404).send({ message: 'not found', asset: assetId, row, col })
    }
    const cellImage = await cutCell(asset, +row, +col)
    return sendSharpAsImage(cellImage, res)
  } catch (err) {
    const message = err instanceof Error ? err.message : typeof err === 'string' ? err : 'UNKNOWN ERROR'
    console.warn(err)
    return res.status(500).send({ message, errorIn: 'cellRouter' })
  }
})

export { cellRouter }
