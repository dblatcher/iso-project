import { CardinalDirection, DIRECTION } from "../CardinalDirection";
import { DirectionalSprite } from "../DirectionalSprite";
import { IMAGES } from "./images";
import { MapCell, MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { MyFigure } from "./MyFigure";

export const duckSprite = new DirectionalSprite({ frontImage: IMAGES.duck, backImage: IMAGES.duckBack })
const barrelSprite = new DirectionalSprite({ frontImage: IMAGES.barrell, backImage: IMAGES.barrell })
const stoney = { textureSide: IMAGES.wall, colorTop: 'slategray' }
const sandy = { colorSide: 'sandybrown', colorTop: 'yellow', }


export function createScene(orientation: CardinalDirection, container: string | HTMLElement): MapGridIsometricCanvas {

    const myDucks: MyFigure[] = [
        { sprite: duckSprite, x: 3, y: 1, facing: DIRECTION.south, name: 'Bob' },
        { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.west },
        { sprite: barrelSprite, x: 3, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 2, facing: DIRECTION.south },
        { sprite: duckSprite, x: 0, y: 5, facing: DIRECTION.east },
    ];

    const cells: MapCell[][] = [
        [{ height: 1 }, { height: 1.2 }, { height: 1.4 }, { height: 1.6 }, { height: 1.8 }, { height: 2 }],
        [{ height: 2 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 3.5, ...stoney }],
        [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 0.8 }, { height: 0.8, ...stoney }],
        [, { height: 0.6, ...sandy }, { height: 0.8, ...sandy }],
        [, { height: 0.6, ...sandy }, { height: 0.8, ...sandy }],
    ]

    const mapGrid = new MapGridIsometricCanvas<MyFigure>(
        {
            container,
            backgroundColor: '#CCC',
            scale: 30,
            width: 600,
            height: 500,
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
            backdropImage: {
                south: IMAGES.hillside,
                north: IMAGES.sky1,
                floor: IMAGES.wall,
            },
            renderCompass: true,
        }
    );

    return mapGrid
}