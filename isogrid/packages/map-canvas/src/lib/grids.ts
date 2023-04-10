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

export const findPositionInRotatedGrid = (
    placeInGrid: { x: number, y: number },
    rowCount: number,
    columnCount: number,
    orientation: CardinalDirection
): { x: number, y: number } => {
    const { x, y } = placeInGrid

    switch (orientation.rotation) {
        case 0: {
            return { x, y }
        }
        case 1: {
            return {
                x: rowCount - y - 1,
                y: x
                
            }
        }
        case 2: {
            return {
                x: columnCount - x - 1,
                y: rowCount - y - 1,
            }
        }
        case 3: {
            return {
                x: y,
                y: columnCount - x - 1
            }
        }
    }
}

export const getGridDimensions = (grid: GridOfCells): [number, number] => {
    return [
        [...grid].reduce<number>((previous, currentCol) => { return Math.max(previous, currentCol.length) }, 0),
        grid.length
    ]
}

export const rotateGridByDirection = (grid: GridOfCells, orientation: CardinalDirection): GridOfCells => {

    const [rowCount, columnCount] = getGridDimensions(grid)

    switch (orientation.rotation) {

        case 0: {
            const newGrid = [...grid]
            return newGrid
        }
        case 1: {
            const newGrid = makeEmptyGrid(rowCount, columnCount)
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[rowCount - x - 1][y] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
        case 2: {
            const newGrid = makeEmptyGrid(columnCount, rowCount)
            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[columnCount - y - 1][rowCount - x - 1] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
        case 3: {
            const newGrid = makeEmptyGrid(rowCount, columnCount)

            for (let y = 0; y < grid.length; y++) {
                for (let x = 0; x < grid[y].length; x++) {
                    newGrid[x][columnCount - y - 1] = grid[y][x]
                }
            }
            checkMissing(grid, newGrid)
            return newGrid
        }
    }
}
