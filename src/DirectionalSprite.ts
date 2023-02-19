import { PlaneView } from "@elchininet/isometric"
import { antiClockwise, clockwise, CardinalDirection } from "./CardinalDirection"

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

    getView(facing: CardinalDirection, orientation: CardinalDirection): { image: string, planeView: PlaneView } {
        if (facing.rotation == orientation.rotation) {
            return { image: this.backImage, planeView: PlaneView.SIDE }
        }
        if (facing.rotation == clockwise(orientation).rotation) {
            return { image: this.frontImage, planeView: PlaneView.FRONT }
        }
        if (facing.rotation == antiClockwise(orientation).rotation) {
            return { image: this.backImage, planeView: PlaneView.FRONT }
        }

        return { image: this.frontImage, planeView: PlaneView.SIDE }
    }
}


