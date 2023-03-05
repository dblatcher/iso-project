import { CardinalDirection, DIRECTION } from "../CardinalDirection";
import { DirectionalSprite } from "../DirectionalSprite";
import { IMAGES } from "./images";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { MyFigure } from "./MyFigure";
import { MapCell } from "../MapCell";

export const duckSprite = new DirectionalSprite({
    frontImage: [IMAGES.duck, IMAGES.duck2, IMAGES.duck3, IMAGES.duck4],
    backImage: [IMAGES.duckBack, IMAGES.duckBack2, IMAGES.duckBack3, IMAGES.duckBack4]
})
const barrelSprite = new DirectionalSprite({ frontImage: [IMAGES.barrell], backImage: [IMAGES.barrell] })
const stoney = { textureSide: IMAGES.wall, colorTop: 'slategray' }
const sandy = { colorSide: 'sandybrown', colorTop: 'yellow', }


export function createScene(orientation: CardinalDirection, container: string | HTMLElement): MapGridIsometricCanvas {

    const myDucks: MyFigure[] = [
        { sprite: duckSprite, x: 0, y: 0, facing: DIRECTION.south, name: 'Bob' },
        { sprite: duckSprite, x: 1, y: 3, facing: DIRECTION.west },
        { sprite: barrelSprite, x: 3, y: 3, facing: DIRECTION.north },
        { sprite: duckSprite, x: 3, y: 2, facing: DIRECTION.west },
    ];

    const cells: MapCell[][] = [
        [{ height: 1 }, { height: 1.2 }, { height: 1.4 }, { height: 1.6 }, { height: 1.8 }, { height: 2 }],
        [{ height: 1.2 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 1.4 }, { height: 1 }, { height: 1 }, { height: 2.5, ...stoney }],
        [{ height: 1.4 }, { height: 1 }, { height: 1 }, { height: 2.5, ...stoney }],
        [{ height: 1.6 }, { height: 1 }, { height: 1 }, { height: 1 }],
        [{ height: 1.8 }, { height: 0.8, ...stoney }],
        [{ height: 2 }, { height: 0.6, ...sandy }, { height: 0.8, ...sandy }],
        [{ height: 2.2 }, { height: 0.6, ...sandy }, { height: 0.8, ...sandy }],
    ]

    const mapGrid = new MapGridIsometricCanvas<MyFigure>(
        {
            container,
            backgroundColor: '#CCC',
            scale: 30,
            width: 600,
            height: 600,
        },
        cells,
        [
            ...myDucks
        ],
        [
            {
                x: 7, y: 0, facing: DIRECTION.north,
                paths: [
                    {
                        fillColor: 'white',
                        points: [
                            { x: 0, y: 0, z: 0 },
                            { x: .5, y: 1, z: 0 },
                            { x: 1, y: 0, z: 0 },
                        ],
                    },
                    {
                        fillColor: 'blue',
                        points: [
                            { x: 0, y: 0, z: 0 },
                            { x: .5, y: 0, z: .75 },
                            { x: 1, y: 0, z: 0 },
                        ],
                    }
                ]
            },
            {
                x: 0, y: 2, facing: DIRECTION.north,
                paths: [
                    {
                        fillColor: 'rgba(200,200,0,.75)',
                        points: [
                            { x: 0, y: 0, z: 0 },
                            { x: 0, y: 0, z: 2 },
                            { x: .5, y: 0, z: 2 },
                            { x: .5, y: 0, z: 1 },
                            { x: 1, y: 0, z: 1 },
                            { x: 1, y: 0, z: 0 },
                        ],
                    },
                    {
                        fillColor: 'goldenrod',
                        points: [
                            { x: 0, y: 0, z: 0 },
                            { x: 0, y: 0, z: 2 },
                            { x: 0, y: .5, z: 2 },
                            { x: 0, y: .5, z: 1 },
                            { x: 0, y: 1, z: 1 },
                            { x: 0, y: 1, z: 0 },
                        ],
                    },
                    {
                        fillColor: 'pink',
                        points: [
                            { x: 1, y: 0, z: 0 },
                            { x: 1, y: 1, z: 0 },
                            { x: 1, y: 1, z: .5 },
                            { x: 1, y: 0, z: .5 },

                        ],
                    },
                ]
            },
            { x: 0, y: 3, facing: DIRECTION.north, fillColor: 'crimson' },
            { x: 0, y: 4, facing: DIRECTION.north, fillColor: 'pink' },
        ],
        {
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
            cssPrefix: "test-scene__",
            frameChangeInterval: 150,
        }
    );

    return mapGrid
}