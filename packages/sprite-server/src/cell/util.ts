import { readFileSync } from "fs";
import { join } from "path";

import sharp from "sharp";
import { AssetData } from "./assetData";

export const cutCell = async (asset: AssetData, row: number, col: number) => {
  const { path, cellWidth, cellHeight } = asset
  const url = join(__dirname, '/assets/', path)
  const assetFile = await readFileSync(url)

  return await sharp(assetFile)
    .extract({
      top: cellHeight * (row),
      left: cellWidth * (col),
      height: cellHeight,
      width: cellWidth,
    })
}

