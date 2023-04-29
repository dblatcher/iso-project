export type CellData = {
  cellWidth: number,
  cellHeight: number,
}

export type AssetData = CellData & {
  id: string,
  path: string,
}


export type ImageOptions = {
  tint?: string
}
