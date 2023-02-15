import { PlaneView } from "@elchininet/isometric"
import { antiClockwise, clockwise, Direction } from "./direction"
import { IMAGES } from './images'

export class DirectionalSprite {
    frontImage: string
    backImage: string

    constructor(data: {
        frontImage: string
        backImage: string
    }) {
        this.frontImage = data.frontImage
        this.backImage = data.backImage
    }

    getView(facing: Direction, orientation: Direction): { image: string, planeView: PlaneView } {
        if (facing.orientation == orientation.orientation) {
            return { image: this.backImage, planeView: PlaneView.SIDE }
        }
        if (facing.orientation == clockwise(orientation).orientation) {
            return { image: this.frontImage, planeView: PlaneView.FRONT }
        }
        if (facing.orientation == antiClockwise(orientation).orientation) {
            return { image: this.backImage, planeView: PlaneView.FRONT }
        }

        return { image: this.frontImage, planeView: PlaneView.SIDE }
    }
}

export const duckSprite = new DirectionalSprite({ frontImage: IMAGES.duck, backImage: IMAGES.duckBack })
