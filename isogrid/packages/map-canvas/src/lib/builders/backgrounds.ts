import { IsometricRectangle, PlaneView,  IsometricGraphicProps, } from "@elchininet/isometric"

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
    fillColor?: string,
    backdropSide?: string
    backdropFront?: string
    backdropFloor?: string
    floorRotation?: number
}) => {
    const { fillColor = 'skyblue', backdropFront, backdropSide, backdropFloor, floorRotation } = input
    const backgroundProps = {
        left: 0,
        right: 0,
        top: 0,
        width: 10,
        height: 10,
        fillColor,
    }

    const sideBackground = new IsometricRectangle({
        planeView: PlaneView.SIDE,
        ...backgroundProps,
        texture: backdropSide ? buildTexture(PlaneView.SIDE, backdropSide) : undefined,
    })
    const frontBackground = new IsometricRectangle({
        planeView: PlaneView.FRONT,
        ...backgroundProps,
        texture: backdropFront ? buildTexture(PlaneView.FRONT, backdropFront) : undefined,
    })

    const floor = new IsometricRectangle({
        ...backgroundProps,
        planeView: PlaneView.TOP,
        texture: backdropFloor ? buildTexture(PlaneView.TOP, backdropFloor, floorRotation) : undefined,
    })

    return {
        sideBackground, frontBackground, floor
    }
}