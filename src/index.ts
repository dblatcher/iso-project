import { clockwise, DIRECTION } from './direction';
import { FigureSprite } from './FigureSprite';
import { MapCell } from './MapGrid';
import { createScene } from './createScene';

const { canvas, mapGrid } = createScene(DIRECTION.west);

mapGrid.onClick.cell = (that) => async (cell: MapCell) => {
    const figure = that.getSelectedFigure()
    if (!figure) { return }
    const coords = that.getCellCoords(cell)
    that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

mapGrid.onClick.figure = (that) => async (figure: FigureSprite) => {

    if (that.getSelectedFigure() === figure) {
        that.rotateSingleFigure(figure, clockwise(figure.facing))
        console.log(`figure is facing ${figure.facing.label}`)
    } else {
        that.setSelectedFigure(figure)
    }
}

const clockwiseButton = document.createElement('button')
clockwiseButton.innerText = 'rotate';
clockwiseButton.addEventListener('click', () => {
    mapGrid.render(clockwise(mapGrid.renderOrientation))
})
document.body.appendChild(clockwiseButton);

const magicButton = document.createElement('button')
magicButton.innerText = 'moveAll';
magicButton.addEventListener('click', () => {
    mapGrid.moveAllFigures()
})
document.body.appendChild(magicButton);

(window as Record<string, any>).canvas = canvas;
(window as Record<string, any>).mapGrid = mapGrid;