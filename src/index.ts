import { IsometricCanvas } from '@elchininet/isometric'
import { clockwise, Direction, DIRECTION } from './direction';
import { FigureSprite } from './figures';
import { MapCell, MapGridCanvas } from './MapGrid';
import { IMAGES } from './images';

import { duckSprite } from './DirectionalSprite'

function createScene(orientation: Direction) {
    const container = document.createElement('span')
    document.body.appendChild(container)


    const canvas = new IsometricCanvas({
        container,
        backgroundColor: '#CCC',
        scale: 30,
        width: 400,
        height: 400,
    });


    const myDucks: FigureSprite[] = [
        { sprite: duckSprite, x: 3, y: 1, facing: DIRECTION.south },
        { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.west },
        { sprite: duckSprite, x: 3, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 2, facing: DIRECTION.south },
        { sprite: duckSprite, x: 0, y: 5, facing: DIRECTION.east },
    ];

    const mapGrid = new MapGridCanvas(canvas,
        [
            [{ height: 1 }, { height: 1.2 }, { height: 1.4 }, { height: 1.6 }, { height: 1.8 }, { height: 2 }],
            [{ height: 2 }, { height: 1 }, { height: 1 }, { height: 1 }],
            [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 3.5, textureSide: IMAGES.wall, textureTop: IMAGES.grass }],
            [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
            [{ height: 0.8 }, { height: 0.8 }],
            [, { height: 0.6 }, { height: 0.8 }],
            [, { height: 0.6 }, { height: 0.8 }],
        ],
        {

            figures: [
                ...myDucks
            ],
            renderOrientation: orientation,
        }
    );

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

    return { canvas, mapGrid }
}

const { canvas, mapGrid } = createScene(DIRECTION.west);

const button = document.createElement('button')
button.innerText = 'rotate';
button.addEventListener('click', () => {
    mapGrid.render(clockwise(mapGrid.renderOrientation))
})
document.body.appendChild(button)

    ;
(window as Record<string, any>).canvas = canvas;
(window as Record<string, any>).mapGrid = mapGrid;