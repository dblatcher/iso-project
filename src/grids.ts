import { CardinalDirection } from "./CardinalDirection"
import { MapCell } from "./MapCell"

type GridOfCells = Array<Array<MapCell | undefined>>

const makeEmptyGrid = (rows: number, cols: number): GridOfCells => {
    const grid: GridOfCells = []

    const makeEmptyOfRightLengthColumn = (): Array<MapCell | undefined> => {
        const column: Array<MapCell | undefined> = []
        column.length = cols
        column.fill(undefined, 0, cols)
        return column
    }
    for (let i = 0; i < rows; i++) {
        grid.push(makeEmptyOfRightLengthColumn())
    }
    return grid
}

const checkMissing = (originalGrid: GridOfCells, newGrid: GridOfCells): void => {
    const missing = originalGrid.flat().filter(cell => !newGrid.flat().includes(cell))
    if (missing.length > 0) {
        console.warn('MISSING CELLS', missing)
    }
}

export const rotateGridByDirection = (grid: GridOfCells, direction: CardinalDirection): GridOfCells => {
    const longestColumn = [...grid].reduce<number>((previous, currentCol) => { return Math.max(previous, currentCol.length) }, 0)
    const longestRow = grid.length
    switch (direction.rotation) {

        case 0: {
            const newGrid = [...grid]
            return newGrid
        }
        case 1: {
            const newGrid = makeEmptyGrid(longestColumn, longestRow)
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[longestColumn - x - 1][y] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
        case 2: {
            const newGrid = makeEmptyGrid(longestRow, longestColumn)
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[longestRow - y - 1][longestColumn - x - 1] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
        case 3: {
            const newGrid = makeEmptyGrid(longestColumn, longestRow)

            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[x][longestRow - y - 1] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
    }
}
