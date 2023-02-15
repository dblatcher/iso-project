import { clockwise, DIRECTION } from './direction';
import { FigureSprite } from './FigureSprite';
import { MapCell } from './MapGrid';
import { createScene } from './createScene';

const { canvas, mapGrid } = createScene(DIRECTION.west);
let selectedDuckIndex = 0

mapGrid.onClick.cell = (that) => async (cell: MapCell) => {
    const coords = that.getCellCoords(cell)
    const figure = that.figures[selectedDuckIndex]
    that.moveSingleFigure(figure, coords.x - figure.x, coords.y - figure.y)
}

mapGrid.onClick.figure = (that) => async (figure: FigureSprite) => {
    console.log(`figure is facing ${figure.facing.label}`)
    selectedDuckIndex = that.figures.indexOf(figure)
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