import { IsometricCircle, IsometricGroup, IsometricText, PlaneView } from "@elchininet/isometric";
import { CardinalDirection, rotateVector } from "../CardinalDirection";

const getLetterVectors = (letter: 'N' | 'W' | 'S' | 'E'): [number, number] => {
    switch (letter) {
        case 'N': return [0, -0.6];
        case 'W': return [-0.6, 0];
        case 'S': return [0, .6];
        case 'E': return [0.6, 0];
    }
}

const getLetterRotation = (letter: 'N' | 'W' | 'S' | 'E'): number => {
    switch (letter) {
        case 'N': return 0;
        case 'W': return 90;
        case 'S': return 180;
        case 'E': return 270;
    }
}

const getLetterPosition = (letter: 'N' | 'W' | 'S' | 'E', orientation: CardinalDirection): { right: number, left: number, rotation: number } => {
    const roatatedVector = rotateVector(...getLetterVectors(letter), orientation)
    return {
        right: roatatedVector.x,
        left: roatatedVector.y,
        rotation: -90 + orientation.rotation * 90 + getLetterRotation(letter)
    }
}

export const buildCompass = (orientation: CardinalDirection) => {

    const group = new IsometricGroup({

    })

    const face = new IsometricCircle({
        radius: 1,
        left: 0,
        top: 0,
        right: 0,
        planeView: PlaneView.TOP,
    })
    const center = new IsometricCircle({
        radius: .1,
        left: 0,
        top: 0,
        right: 0,
        planeView: PlaneView.TOP,
        fillColor: 'black',
    })


    const north = new IsometricText({
        text: 'N',
        fontSize: 15,
        planeView: PlaneView.TOP,
        ...getLetterPosition('N', orientation),
        fillColor: 'red',
        strokeColor: 'red',
    })
    group.addChildren(face, center, north)

    const south = new IsometricText({
        text: 'S',
        fontSize: 15,
        planeView: PlaneView.TOP,
        ...getLetterPosition('S', orientation)
    })
    const east = new IsometricText({
        text: 'E',
        fontSize: 15,
        planeView: PlaneView.TOP,
        ...getLetterPosition('E', orientation)
    })
    const west = new IsometricText({
        text: 'W',
        fontSize: 15,
        planeView: PlaneView.TOP,
        ...getLetterPosition('W', orientation)
    })
    group.addChildren(face, center, north, east, south, west)

    return { group, north, east, south, west }
}