import { IsometricCanvas } from '@elchininet/isometric'
import { clockwise, Direction, DIRECTION } from './direction';
import { FigureSprite } from './figures';
import { MapGridCanvas } from './MapGrid';
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
        { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 1, facing: DIRECTION.south },
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
        [
            ...myDucks
        ]
    );

    mapGrid.render(orientation);
    return { canvas, mapGrid }
}

// createScene(DIRECTION.north)
// createScene(DIRECTION.east)
// createScene(DIRECTION.south)
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