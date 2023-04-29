import { readFileSync } from "fs";
import { join } from "path";
import sharp, { Sharp } from "sharp";
import { AssetData } from "../assetData";

export const assetToSharp = async (
  assetData: AssetData
): Promise<Sharp> => {
  const url = join(__dirname, '/assets/', assetData.path)
  const assetFile = await readFileSync(url)
  return await sharp(assetFile)
}

export const cutCell = async (
  source: Sharp,
  assetData: AssetData,
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

