export type CardinalDirection = Readonly<{
    label: string,
    rotation: 0 | 1 | 2 | 3,
}>

const north: CardinalDirection = {
    label: 'North',
    rotation: 0,
}
const west: CardinalDirection = {
    label: 'West',
    rotation: 1,
}
const south: CardinalDirection = {
    label: 'South',
    rotation: 2,
}
const east: CardinalDirection = {
    label: 'East',
    rotation: 3,
}

export const DIRECTION = {
    north, west, south, east
}

export const antiClockwise = (direction: CardinalDirection): CardinalDirection => {
    const { rotation } = direction
    return Object.values(DIRECTION).find(d => d.rotation === rotation + 1) || DIRECTION.north
}

export const clockwise = (direction: CardinalDirection): CardinalDirection => {
    const { rotation } = direction
    return Object.values(DIRECTION).find(d => d.rotation === rotation - 1) || DIRECTION.east
}

export const rotateVector = (x: number, y: number, orientation: CardinalDirection): { x: number, y: number } => {
    switch (orientation.rotation) {
        case 0:
            return {
                x, y
            }
        case 1:
            return {
                x: -y, y: x
            }
        case 2:
            return {
                x: -x, y: -y
            }
        case 3:
            return {
                x: y, y: -x
            }
    }
}