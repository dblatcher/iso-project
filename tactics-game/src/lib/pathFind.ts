import { MapCell } from "../../../src/MapCell"
import { CharacterFigure } from "../CharacterFigure"

const getCellAt = (x: number, y: number, grid: (MapCell | undefined)[][]): MapCell | undefined => {
    const row = grid[x]
    if (!row) {
        return undefined
    }
    return row[y]
}

export const findReachableCells = (figure: CharacterFigure, grid: (MapCell | undefined)[][]): MapCell[] => {
    const reachable: MapCell[] = []
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            const cell = grid[x][y]
            const distance = Math.abs(x - figure.x) + Math.abs(y - figure.y)
            if (distance <= figure.remaining.move) {
                reachable.push(cell)
            }
        }
    }
    return reachable
}

/**
 * Returns the array of cells to get the figure to the target. Returns undefined if the target is not reachable
 */
export const findPathFrom = (figure: CharacterFigure, target: { x: number, y: number }, grid: (MapCell | undefined)[][]): MapCell[] => {

    let { x, y, remaining } = figure
    let { move: remainingMoves } = remaining

    const cellsInPath: MapCell[] = [
    ]

    // TO DO - proper path finding
    // checking if accessible! (function will need more data!)
    const changeCoords = () => {
        if (y < target.y) {
            return y++
        }
        if (x < target.x) {
            return x++
        }
        if (y > target.y) {
            return y--
        }
        if (x > target.x) {
            return x--
        }
    }

    const nextCell = () => {
        remainingMoves--
        changeCoords()
        const cell = getCellAt(x, y, grid)
        if (!cell) {
            return
        }

        cellsInPath.push(cell)

        if (x === target.x && y === target.y) {
            return
        }
        if (remainingMoves <= 0) {
            return
        }
        nextCell()
    }

    nextCell()
    return cellsInPath
}