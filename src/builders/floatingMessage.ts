import { IsometricCanvas, IsometricText, PlaneView } from "@elchininet/isometric"
import { pause } from "../animations/util"

interface FloatingMessageConfig {
    text: string
    top: number, left: number, right: number,
    rise?: number
    fillColor?: string
    animationDuration?: number
    pauseSeconds?: number
}

export const floatingMessage = async (canvas: IsometricCanvas, config: FloatingMessageConfig) => {

    const { text, top, left, right, rise = 1, fillColor = 'green', animationDuration = 1, pauseSeconds = 1 } = config

    const message = new IsometricText({
        text,
        top,
        left,
        right,
        planeView: PlaneView.FRONT,
        fillColor,
        fontSize: 30,
    })

    message.addAnimation({
        property: 'top',
        duration: animationDuration,
        repeat: 1,
        from: top,
        to: top + rise,
    })

    canvas.addChild(message)
    return await pause(pauseSeconds * 1000)
}