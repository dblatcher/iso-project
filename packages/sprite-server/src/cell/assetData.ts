
export type AssetData = {
  id: string,
  path: string,
  cellWidth: number,
  cellHeight: number,
}

const man: AssetData = {
  id: 'man',
  path: 'Fighter-M-01 light.png',
  cellWidth: 24,
  cellHeight: 32,
}
const dino: AssetData = {
  id: 'dino',
  path: 'dinosaur.png',
  cellWidth: 32,
  cellHeight: 32,
}

export const assets: Partial<Record<string, AssetData>> = {
  man, dino
}
