export interface Direction {
    label: string,
    orientation: 0 | 1 | 2 | 3,

}

const north: Direction = {
    label: 'North',
    orientation: 0,
}
const west: Direction = {
    label: 'West',
    orientation: 1,
}
const south: Direction = {
    label: 'South',
    orientation: 2,
}
const east: Direction = {
    label: 'East',
    orientation: 3,
}

export const DIRECTION = {
    north, west, south, east
}

export const antiClockwise = (direction: Direction): Direction => {
    const { orientation } = direction
    return Object.values(DIRECTION).find(d => d.orientation === orientation + 1) || DIRECTION.north
}

export const clockwise = (direction: Direction): Direction => {
    const { orientation } = direction
    return Object.values(DIRECTION).find(d => d.orientation === orientation - 1) || DIRECTION.east
}

export const rotateVector = (x: number, y: number, orientation: Direction): { x: number, y: number } => {
    switch (orientation.orientation) {
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