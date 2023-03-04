import { MapCell } from "../../../src/MapCell"

const irregularRow = (l = 10): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < l; i++) {
        const height = .8 + Math.floor(Math.random() * 10) / 25
        row.push({ height })
    }
    return row
}

const regularRow = (l = 10): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < l; i++) {
        row.push({ height: 1 })
    }
    return row
}

export const buildGrid = (): MapCell[][] => [
    irregularRow(5),
    irregularRow(8),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    regularRow(5),
    regularRow(5),
    regularRow(8),
]