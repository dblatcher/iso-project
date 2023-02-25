import { DirectionalSprite } from "../../src/DirectionalSprite"
import { IMAGES } from "./images"

export const duckSprite = new DirectionalSprite({
    frontImage: [IMAGES.duck, IMAGES.duck2, IMAGES.duck3, IMAGES.duck4],
    backImage: [IMAGES.duckBack, IMAGES.duckBack2, IMAGES.duckBack3, IMAGES.duckBack4],
})
export const manSprite = new DirectionalSprite({
    frontImage: [IMAGES.manf1, IMAGES.manf2, IMAGES.manf3,],
    backImage: [IMAGES.manb1, IMAGES.manb2, IMAGES.manb3],
    height: 2,
})
export const barrelSprite = new DirectionalSprite({
    frontImage: [IMAGES.barrell],
    backImage: [IMAGES.barrell],
})