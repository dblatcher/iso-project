import { IsometricCanvas } from "@elchininet/isometric";
import { CardinalDirection, DIRECTION } from "./direction";
import { duckSprite } from "./DirectionalSprite";
import { FigureSprite } from "./FigureSprite";
import { IMAGES } from "./images";
import { MapGridCanvas } from "./MapGrid";

export function createScene(orientation: CardinalDirection) {
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

    return { canvas, mapGrid }
}