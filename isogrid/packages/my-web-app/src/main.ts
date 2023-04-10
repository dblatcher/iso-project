// import './app/app.element.ts';
import { createScene, moveSelectedFigureToCell, selectOrRotateFigure, danceParty } from '@isogrid/test-scene'
import { antiClockwise, clockwise, DIRECTION, MapGridIsometricCanvas } from "@isogrid/map-canvas";

console.log('running')





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

const enhancedWindow = window as Window & { mapGrid?: MapGridIsometricCanvas }
enhancedWindow['mapGrid'] = mapGrid;
