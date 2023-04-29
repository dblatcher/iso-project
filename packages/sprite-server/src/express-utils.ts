import { Response, Request } from "express";
import { Sharp } from "sharp";
import { ImageOptions } from "./types";

export const sendSharpAsImage = async (image: Sharp, res: Response) => {
  const [buffer, metadata] = await Promise.all([image.toBuffer(), image.metadata()])
  res.writeHead(200, {
    "Content-Type": `image/${metadata.format}`,
  })
  return res.end(buffer)
}

export const getOptionsFromQuery = (req: Request): ImageOptions => {
  const { tint } = req.query
  return {
    tint: typeof tint === 'string' ? tint : undefined
  }
}
