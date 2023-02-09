export interface Direction {
    label: string,
    orientation: number,

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