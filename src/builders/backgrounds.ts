import { IsometricRectangle, PlaneView, IsometricText, IsometricGraphicProps, } from "@elchininet/isometric"
import { antiClockwise, CardinalDirection } from "../CardinalDirection"

const buildTexture = (planeView: PlaneView, imageUrl: string, rotation = 0): IsometricGraphicProps['texture'] => {
    return {
        height: 10,
        width: 10,
        pixelated: false,
        url: imageUrl,
        planeView,
        rotation: {
            axis: 'TOP',
            value: rotation,
        },
    }
}

export const buildBackgrounds = (input: {
    orientation: CardinalDirection,
    fillColor?: string,
    backdropSide?: string
    backdropFront?: string
    backdropFloor?: string
    floorRotation?: number
}) => {
    const { orientation, fillColor = 'skyblue', backdropFront, backdropSide, backdropFloor, floorRotation } = input
    const backgroundProps = {
        left: 0,
        right: 0,
        top: 0,
        width: 10,
        height: 10,
        fillColor,
    }
    const labelProps = {
        top: 4,
        fontSize: 100,
    }

    const sideBackground = new IsometricRectangle({
        planeView: PlaneView.SIDE,
        ...backgroundProps,
        texture: backdropSide ? buildTexture(PlaneView.SIDE, backdropSide) : undefined,
    })
    const sideLabel = new IsometricText({
        planeView: PlaneView.SIDE,
        text: orientation.label[0],
        right: 4,
        ...labelProps,
    })
    const frontBackground = new IsometricRectangle({
        planeView: PlaneView.FRONT,
        ...backgroundProps,
        texture: backdropFront ? buildTexture(PlaneView.FRONT, backdropFront) : undefined,
    })
    const frontLabel = new IsometricText({
        planeView: PlaneView.FRONT,
        text: antiClockwise(orientation).label[0],
        left: 4,
        ...labelProps,
    })

    const floor = new IsometricRectangle({
        ...backgroundProps,
        planeView: PlaneView.TOP,
        texture: backdropFloor ? buildTexture(PlaneView.TOP, backdropFloor, floorRotation) : undefined,
    })

    return {
        sideBackground, sideLabel, frontBackground, frontLabel, floor
    }
}