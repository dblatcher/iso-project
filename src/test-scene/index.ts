import { antiClockwise, clockwise, DIRECTION } from '../CardinalDirection';
import { createScene } from './createScene';
import { danceParty, moveSelectedFigureToCell, selectOrRotateFigure } from './interactions';

const container = document.createElement('div')
document.body.appendChild(container)

const clockwiseButton = document.createElement('button')
clockwiseButton.innerText = '↺';
document.body.appendChild(clockwiseButton);
const anticlockwiseButton = document.createElement('button')
anticlockwiseButton.innerText = '↻';
document.body.appendChild(anticlockwiseButton);

const magicButton = document.createElement('button')
magicButton.innerText = 'Everybody dance now!';
document.body.appendChild(magicButton);

const mapGrid = createScene(DIRECTION.west, container);
mapGrid.onClick.cell = moveSelectedFigureToCell
mapGrid.onClick.figure = selectOrRotateFigure

clockwiseButton.addEventListener('click', () => {
    mapGrid.render(clockwise(mapGrid.renderOrientation))
})
anticlockwiseButton.addEventListener('click', () => {
    mapGrid.render(antiClockwise(mapGrid.renderOrientation))
})
magicButton.addEventListener('click', () => {
    mapGrid.executeAnimation(() => danceParty(mapGrid)())
})

const enhancedWindow = window as Record<string, any>
enhancedWindow.mapGrid = mapGrid;