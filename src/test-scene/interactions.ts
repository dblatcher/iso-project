import { clockwise } from '../CardinalDirection'
import type { FigureClickHandler, CellClickHandler, MapGridIsometricCanvas } from '../MapGridIsometricCanvas'
import { MyFigure } from "./MyFigure"


function setSelectedFigure(newlySelectedFigure: MyFigure, that: MapGridIsometricCanvas<MyFigure>) {
    if (!newlySelectedFigure?.spriteIsoGroup || !that.children.includes(newlySelectedFigure.spriteIsoGroup)) {
        return false
    }
    that.figures.forEach(figure => {
        figure.classNames = figure === newlySelectedFigure ? ['selected'] : undefined
    })
    that.render(that.renderOrientation)
}

function getSelectedFigure(that: MapGridIsometricCanvas<MyFigure>): MyFigure | undefined {
    return that.figures.find(figure => figure.classNames?.includes('selected')) as MyFigure | undefined
}


export const moveSelectedFigureToCell: CellClickHandler<boolean> = (that) => async (cell) => {
    const figure = getSelectedFigure(that)
    if (!figure) { return }
    const coords = that.getCellCoords(cell)
    return that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

export const selectOrRotateFigure: FigureClickHandler<void, MyFigure> = (that) => async (figure) => {
    if (getSelectedFigure(that) === figure) {
        that.rotateSingleFigure(figure, clockwise(figure.facing))
        console.log(`${figure.name || 'nameless figure'} is facing ${figure.facing.label}`)
    } else {
        setSelectedFigure(figure, that)
        console.log(`${figure.name || 'nameless figure'} selected`)
    }
}
