import { clockwise, jumpFigure, shiftFigure, spinFigure, turnFigure } from "@isogrid/map-canvas"
import type { FigureClickHandler, CellClickHandler, MapGridIsometricCanvas, } from "@isogrid/map-canvas"
import { MyFigure } from "./MyFigure"


function setSelectedFigure(newlySelectedFigure: MyFigure, that: MapGridIsometricCanvas<MyFigure>) {
  if (!newlySelectedFigure?.spriteIsoGroup || !that.children.includes(newlySelectedFigure.spriteIsoGroup)) {
    return false
  }
  that.figures.forEach(figure => {
    figure.classNames = figure === newlySelectedFigure ? ['selected'] : undefined
  })
  return that.render(that.renderOrientation)
}

function getSelectedFigure(that: MapGridIsometricCanvas<MyFigure>): MyFigure | undefined {
  return that.figures.find(figure => figure.classNames?.includes('selected')) as MyFigure | undefined
}


export const moveSelectedFigureToCell: CellClickHandler<boolean> = (that) => async (cell) => {
  const figure = getSelectedFigure(that)
  if (!figure) { return false }
  const coords = that.getCellCoords(cell)
  return that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

export const selectOrRotateFigure: FigureClickHandler<void, MyFigure> = (that) => async (figure) => {
  if (getSelectedFigure(that) === figure) {
    that.turnSingleFigure(figure, clockwise(figure.facing))
    console.log(`${figure.name || 'nameless figure'} is facing ${figure.facing.label}`)
  } else {
    setSelectedFigure(figure, that)
    console.log(`${figure.name || 'nameless figure'} selected`)
  }
}

export const danceParty = (that: MapGridIsometricCanvas<MyFigure>) => async (): Promise<boolean[]> => {
  return Promise.all(that.figures.map(async (figure) => {
    await shiftFigure(that)(figure, 0, -1)
    await jumpFigure(that)(figure, 2)
    await spinFigure(that)(figure, 2, 150, true)
    await spinFigure(that)(figure, 1, 300,)
    await shiftFigure(that)(figure, 0, 1)
    await turnFigure(that)(figure, clockwise(figure.facing))
    return true
  }))
}
