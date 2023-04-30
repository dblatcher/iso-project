import { AssetData } from "./types"

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

const body: AssetData = {
  id: 'body',
  path: 'lpc/BODY_male.png',
  cellHeight: 64,
  cellWidth: 64,
}
const legsPants: AssetData = {
  id: 'legsPants',
  path: 'lpc/LEGS_pants_greenish.png',
  cellHeight: 64,
  cellWidth: 64,
}
const headChain: AssetData = {
  id: 'headChain',
  path: 'lpc/HEAD_chain_armor_helmet.png',
  cellHeight: 64,
  cellWidth: 64,
}
const leatherArmour: AssetData = {
  id: 'leatherArmour',
  path: 'lpc/TORSO_leather_armor_torso.png',
  cellHeight: 64,
  cellWidth: 64,
}
const headLeather: AssetData = {
  id: 'headLeather',
  path: 'lpc/HEAD_leather_armor_hat.png',
  cellHeight: 64,
  cellWidth: 64,
}
const chainArmour: AssetData = {
  id: 'chainArmour',
  path: 'lpc/TORSO_chain_armor_torso.png',
  cellHeight: 64,
  cellWidth: 64,
}
const hairBlonde: AssetData = {
  id: 'hairBlonde',
  path: 'lpc/HEAD_hair_blonde.png',
  cellHeight: 64,
  cellWidth: 64,
}
const leatherBelt: AssetData = {
  id: 'leatherBelt',
  path: 'lpc/BELT_leather.png',
  cellHeight: 64,
  cellWidth: 64,
}


export const assets: Partial<Record<string, AssetData>> = {
  man, dino, body, legsPants, headChain, leatherArmour, headLeather, chainArmour, hairBlonde,leatherBelt
}
