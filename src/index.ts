import { IsometricCanvas } from '@elchininet/isometric'
import { DIRECTION } from './direction';
import { FigureSprite } from './figures';
import { MapGrid } from './MapGrid';
import { IMAGES } from './images';
import { duckSprite } from './DirectionalSprite'

const container = document.createElement('div')
document.body.appendChild(container)


const canvas = new IsometricCanvas({
    container,
    backgroundColor: '#CCC',
    scale: 40,
    width: 500,
    height: 500,
});


const myDucks: FigureSprite[] = [
    { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.north },
    { sprite: duckSprite, x: 2, y: 3, facing: DIRECTION.west },
    { sprite: duckSprite, x: 3, y: 3, facing: DIRECTION.south },
];

const mapGrid = new MapGrid([
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }, { height: 2 }],
    [{ height: 2 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1.5, textureSide: IMAGES.wall, textureTop: IMAGES.grass }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 0 }, { height: 0 }],
    [, { height: 0 }, { height: 0 }],
],
    [
        ...myDucks
    ]
);

mapGrid.render(canvas, DIRECTION.north);


(window as Record<string, any>).canvas = canvas;
(window as Record<string, any>).mapGrid = mapGrid;

