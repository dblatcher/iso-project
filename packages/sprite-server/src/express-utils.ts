import { Response, Request } from "express";
import { Sharp } from "sharp";
import { ImageOptions } from "./types";
import { isStringArray } from "./util";

export const sendSharpAsImage = async (image: Sharp, res: Response) => {
  const [buffer, metadata] = await Promise.all([image.toBuffer(), image.metadata()])
  res.writeHead(200, {
    "Content-Type": `image/${metadata.format}`,
  })
  return res.end(buffer)
}

export const getOptionsFromQuery = (req: Request): ImageOptions => {
  const { tint, layers } = req.query
  return {
    tint: typeof tint === 'string' ? tint : undefined,
    layers: isStringArray(layers) ? layers : typeof layers === 'string' ? layers.split(',') : undefined
  }
}
