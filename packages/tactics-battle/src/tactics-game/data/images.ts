const ASSET_FOLDER = "../assets/"
const MAN_SUB = "man/walk/"

const SPRITE_SERVER_PATH = "/sprites/assets/"

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
    manf1: `${ASSET_FOLDER}${MAN_SUB}f1.png`,
    manf2: `${ASSET_FOLDER}${MAN_SUB}f2.png`,
    manf3: `${ASSET_FOLDER}${MAN_SUB}f3.png`,
    manb1: `${ASSET_FOLDER}${MAN_SUB}b1.png`,
    manb2: `${ASSET_FOLDER}${MAN_SUB}b2.png`,
    manb3: `${ASSET_FOLDER}${MAN_SUB}b3.png`,
} as const;
