import { clockwise, DIRECTION } from './direction';
import { FigureSprite } from './figures';
import { MapCell } from './MapGrid';
import { createScene } from './createScene';

const { canvas, mapGrid } = createScene(DIRECTION.west);
let selectedDuckIndex = 0

mapGrid.onClick.cell = (that) => async (cell: MapCell) => {
    const coords = that.getCellCoords(cell)
    const figure = that.figures[selectedDuckIndex]
    that.moveSingleFigure(selectedDuckIndex, coords.x - figure.x, coords.y - figure.y)
}

mapGrid.onClick.figure = (that) => async (figure: FigureSprite) => {
    console.log(`figure is facing ${figure.facing.label}`)
    selectedDuckIndex = that.figures.indexOf(figure)
}

const button = document.createElement('button')
button.innerText = 'rotate';
button.addEventListener('click', () => {
    mapGrid.render(clockwise(mapGrid.renderOrientation))
})
document.body.appendChild(button);

(window as Record<string, any>).canvas = canvas;
(window as Record<string, any>).mapGrid = mapGrid;