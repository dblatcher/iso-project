import { clockwise } from '../CardinalDirection'
import type { FigureClickHandler, CellClickHandler } from '../MapGridIsometricCanvas'
import { MyFigure } from "./MyFigure"

export const moveSelectedFigureToCell: CellClickHandler<boolean> = (that) => async (cell) => {
    const figure = that.getSelectedFigure()
    if (!figure) { return }
    const coords = that.getCellCoords(cell)
    return that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

export const selectOrRotateFigure: FigureClickHandler<void, MyFigure> = (that) => async (figure) => {
    if (that.getSelectedFigure() === figure) {
        that.rotateSingleFigure(figure, clockwise(figure.facing))
        console.log(`${figure.name || 'nameless figure'} is facing ${figure.facing.label}`)
    } else {
        that.setSelectedFigure(figure)
        console.log(`${figure.name || 'nameless figure'} selected`)
    }
}
