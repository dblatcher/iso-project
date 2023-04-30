import { Response, Request } from "express";
import { Sharp } from "sharp";
import { ImageOptions } from "./types";
import { isStringArray, thrownToString } from "./util";

export const sendSharpAsImage = async (image: Sharp, res: Response) => {
  try {
    // Sharp.toBuffer can fail - EG from "Image to composite must have same dimensions or smaller"
    const [buffer, metadata] = await Promise.all([image.toBuffer(), image.metadata()])
    res.writeHead(200, {
      "Content-Type": `image/${metadata.format}`,
    })
    return res.end(buffer)
  } catch (err) {
    const message = thrownToString(err)
    return res.status(400).send({message, errorIn:'sendSharpAsImage'})
  }
}

export const getOptionsFromQuery = (req: Request): ImageOptions => {
  const { tint, layers } = req.query
  return {
    tint: typeof tint === 'string' ? tint : undefined,
    layers: isStringArray(layers) ? layers : typeof layers === 'string' ? layers.split(',') : undefined
  }
}
