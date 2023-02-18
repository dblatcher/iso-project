import { CardinalDirection, DIRECTION } from "./direction";
import { duckSprite } from "./DirectionalSprite";
import { FigureSprite } from "./FigureSprite";
import { IMAGES } from "./images";
import { MapCell, MapGridIsometricCanvas } from "./MapGrid";

export function createScene(orientation: CardinalDirection, container: string | HTMLElement): MapGridIsometricCanvas {

    const myDucks: FigureSprite[] = [
        { sprite: duckSprite, x: 3, y: 1, facing: DIRECTION.south },
        { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.west },
        { sprite: duckSprite, x: 3, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 2, facing: DIRECTION.south },
        { sprite: duckSprite, x: 0, y: 5, facing: DIRECTION.east },
    ];

    const cells: MapCell[][] = [
        [{ height: 1 }, { height: 1.2 }, { height: 1.4 }, { height: 1.6 }, { height: 1.8 }, { height: 2 }],
        [{ height: 2 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 3.5, textureSide: IMAGES.wall, textureTop: IMAGES.grass }],
        [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 0.8 }, { height: 0.8 }],
        [, { height: 0.6 }, { height: 0.8 }],
        [, { height: 0.6 }, { height: 0.8, colorSide: 'gray', colorTop: 'yellow', }],
    ]

    const mapGrid = new MapGridIsometricCanvas(
        {
            container,
            backgroundColor: '#CCC',
            scale: 30,
            width: 400,
            height: 400,
        },
        cells,
        {
            figures: [
                ...myDucks
            ],
            renderOrientation: orientation,
            defaultBlockSideColor: 'brown',
            defaultBlockTopColor: 'limegreen',
            defaultBlockTextureTop: IMAGES.grass,
        }
    );

    return mapGrid
}