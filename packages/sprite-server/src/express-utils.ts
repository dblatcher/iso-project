import { Response } from "express";
import { Sharp } from "sharp";

export const sendSharpAsImage = async (image: Sharp, res: Response) => {
  const [buffer, metadata] = await Promise.all([image.toBuffer(), image.metadata()])
  res.writeHead(200, {
    "Content-Type": `image/${metadata.format}`,
  })
  return res.end(buffer)
}
