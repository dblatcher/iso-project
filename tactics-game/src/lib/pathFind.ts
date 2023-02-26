import { MapCell } from "../../../src/MapCell"
import { CharacterFigure } from "../CharacterFigure"

const getCellAt = (x: number, y: number, grid: (MapCell | undefined)[][]): MapCell | undefined => {
    const row = grid[x]
    if (!row) {
        return undefined
    }
    return row[y]
}

export const findPathFrom = (figure: CharacterFigure, target: { x: number, y: number }, grid: (MapCell | undefined)[][]): MapCell[] => {

    let { x, y, remainingMoves } = figure

    const cellsInPath: MapCell[] = [
        grid[x][y]
    ]

    // TO DO - proper path finding
    // checking if accessible! (function will need more data!)
    const changeCoords = () =>{
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
            console.log('no cell, exiting', { x, y })
            return
        }

        cellsInPath.push(cell)

        if (x === target.x && y === target.y) {
            console.log('reached target, exiting', { x, y })
            return
        }
        if (remainingMoves <= 0) {
            console.log('out of moves, exiting', { x, y })
            return
        }
        nextCell()
    }

    nextCell()
    return cellsInPath
}