import { MapCell } from "../../../src/MapCell"

const irregularRow = (): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < 10; i++) {
        const height = Math.floor(Math.random() * 10) / 25
        row.push({ height: .8 + height })
    }
    return row
}

const regularRow = (): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < 10; i++) {
        row.push({ height: 1 })
    }
    return row
}

export const buildGrid = (): MapCell[][] => [
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    regularRow(),
    regularRow(),
]