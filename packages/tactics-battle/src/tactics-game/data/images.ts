const ASSET_FOLDER = "../assets/"

const SPRITE_SERVER_PATH = "/sprites/assets/"
const SPRITE_CELL_PATH = "/sprites/cell/"

const COMPOSITE_PATH = "/sprites/composite/"
const SOLIDER_PATH = ""

export const solider = {
  front: [
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/1`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/2`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/3`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/4`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/5`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/6`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/7`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}2/8`,
  ],
  back: [
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/1`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/2`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/3`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/4`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/5`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/6`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/7`,
    `${COMPOSITE_PATH}${SOLIDER_PATH}0/8`,
  ],
}

export const IMAGES = {
    wall: `${SPRITE_SERVER_PATH}brick_wall.png`,
    grass: `${SPRITE_SERVER_PATH}grass.jpg`,
    barrell: `${SPRITE_SERVER_PATH}barrell.png`,
    hillside: `${SPRITE_SERVER_PATH}hillside.png`,
    sky1: `${SPRITE_SERVER_PATH}sky1.png`,
    duck: `${ASSET_FOLDER}duck/walk/front/1.png`,
    duck2: `${ASSET_FOLDER}duck/walk/front/2.png`,
    duck3: `${ASSET_FOLDER}duck/walk/front/3.png`,
    duck4: `${ASSET_FOLDER}duck/walk/front/4.png`,
    duckBack: `${ASSET_FOLDER}duck/walk/back/1.png`,
    duckBack2: `${ASSET_FOLDER}duck/walk/back/2.png`,
    duckBack3: `${ASSET_FOLDER}duck/walk/back/3.png`,
    duckBack4: `${ASSET_FOLDER}duck/walk/back/4.png`,
    manf2: `${SPRITE_CELL_PATH}man/2/0`,
    manf1: `${SPRITE_CELL_PATH}man/2/1`,
    manf3: `${SPRITE_CELL_PATH}man/2/2`,
    manb2: `${SPRITE_CELL_PATH}man/0/0`,
    manb1: `${SPRITE_CELL_PATH}man/0/1`,
    manb3: `${SPRITE_CELL_PATH}man/0/2`,
} as const;
