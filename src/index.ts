import { clockwise, DIRECTION } from './direction';
import { createScene } from './test-scene/createScene';
import { moveSelectedFigureToCell, selectOrRotateFigure } from './test-scene/interactions';

const container = document.createElement('div')
document.body.appendChild(container)

const clockwiseButton = document.createElement('button')
clockwiseButton.innerText = 'rotate';
document.body.appendChild(clockwiseButton);

const magicButton = document.createElement('button')
magicButton.innerText = 'moveAll';
document.body.appendChild(magicButton);

const mapGrid = createScene(DIRECTION.west, container);
mapGrid.onClick.cell = moveSelectedFigureToCell
mapGrid.onClick.figure = selectOrRotateFigure

clockwiseButton.addEventListener('click', () => {
    mapGrid.render(clockwise(mapGrid.renderOrientation))
})
magicButton.addEventListener('click', () => {
    mapGrid.moveAllFigures()
})

const enhancedWindow = window as Record<string, any>
enhancedWindow.mapGrid = mapGrid;