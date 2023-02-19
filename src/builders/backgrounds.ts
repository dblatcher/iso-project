import { IsometricRectangle, PlaneView, IsometricText } from "@elchininet/isometric"
import { antiClockwise, CardinalDirection } from "../CardinalDirection"

export const buildBackgrounds = (input: { orientation: CardinalDirection, fillColor?: string }) => {

    const { orientation, fillColor = 'skyblue' } = input

    const backgroundProps = {
        left: 0,
        right: 0,
        top: 0,
        width: 100,
        height: 100,
        fillColor,
    }
    const labelProps = {
        top: 4,
        fontSize: 100,
    }

    const sideBackground = new IsometricRectangle({
        planeView: PlaneView.SIDE,
        ...backgroundProps,
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
    })
    const frontLabel = new IsometricText({
        planeView: PlaneView.FRONT,
        text: antiClockwise(orientation).label[0],
        left: 4,
        ...labelProps,
    })

    return {
        sideBackground, sideLabel, frontBackground, frontLabel
    }
}