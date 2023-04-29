import { readFileSync } from "fs";
import { join } from "path";
import sharp, { Sharp, OverlayOptions } from "sharp";
import { AssetData, CellData, ImageOptions } from "./types";

export const filepathToSharp = async (
  path: string
): Promise<Sharp> => {
  const url = join(__dirname, '/assets/', path)
  const assetFile = await readFileSync(url)
  return await sharp(assetFile)
}
export const assetToSharp = async (
  assetData: AssetData
): Promise<Sharp> => {
  return await filepathToSharp(assetData.path)
}

export const cutCell = async (
  source: Sharp,
  assetData: CellData,
  row: number,
  col: number,
): Promise<Sharp> => {
  const { cellWidth, cellHeight } = assetData
  return await source
    .extract({
      top: cellHeight * row,
      left: cellWidth * col,
      height: cellHeight,
      width: cellWidth,
    })
}

const tints = {
  red: { r: 255, g: 16, b: 16 },
  green: { r: 16, g: 255, b: 16 },
  blue: { r: 16, g: 16, b: 255 },
  purple: { r: 150, g: 16, b: 155 },
}

export const applyOptions = (source: Sharp, options: ImageOptions = {}): Sharp => {
  const { tint } = options
  if (tint in tints) {
    source.tint(tints[tint])
  }
  return source
}


const sharpToLayer = async (image: Sharp): Promise<sharp.OverlayOptions> => {
  const input = await image.toBuffer()
  return { input }
}

export const composeImages = async (sources: Sharp[]): Promise<sharp.Sharp> => {
  const [first, ...rest] = sources
  // to do - handle empty arrays
  const layers: OverlayOptions[] = await Promise.all(rest.map(image => sharpToLayer(image)))
  return first.composite(layers)
}
