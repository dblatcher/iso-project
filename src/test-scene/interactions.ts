import { clockwise } from '../CardinalDirection'
import { FigureSprite } from '../FigureSprite'
import type { FigureClickHandler, CellClickHandler } from '../MapGridIsometricCanvas'

export const moveSelectedFigureToCell: CellClickHandler<boolean> = (that) => async (cell) => {
    const figure = that.getSelectedFigure()
    if (!figure) { return }
    const coords = that.getCellCoords(cell)
    return that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

export const selectOrRotateFigure: FigureClickHandler<void> = (that) => async (figure: FigureSprite) => {
    if (that.getSelectedFigure() === figure) {
        that.rotateSingleFigure(figure, clockwise(figure.facing))
        console.log(`figure is facing ${figure.facing.label}`)
    } else {
        that.setSelectedFigure(figure)
    }
}
