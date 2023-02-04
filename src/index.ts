import { IsometricCanvas, IsometricRectangle, PlaneView } from '@elchininet/isometric'
import { makeBlock } from './blockWithTexture';
import { buildCuboid, buildCuboidWithShadow } from './cuboids';
import { makeSprite } from './flatSprite';
import { MapGrid } from './MapGrid';
import { IMAGES } from './textures';

const container = document.createElement('div')
document.body.appendChild(container)


const canvas = new IsometricCanvas({
    container,
    backgroundColor: '#CCC',
    scale: 40,
    width: 500,
    height: 500,
});


canvas.addChild(
    new IsometricRectangle({
        height: 400,
        width: 400,
        planeView: PlaneView.TOP,
        fillColor: 'pink',
    })
)
canvas.addChild(
    new IsometricRectangle({
        height: 400,
        width: 400,
        planeView: PlaneView.SIDE,
        fillColor: 'pink',
    })
)
canvas.addChild(
    new IsometricRectangle({
        height: 400,
        width: 400,
        planeView: PlaneView.FRONT,
        fillColor: 'pink',
    })
)

const mapGrid = new MapGrid([
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }, { height: 2 }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 5.5, textureSide: IMAGES.wall, textureTop: IMAGES.grass }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 0 }, { height: 0 }],
])

mapGrid.render(canvas)

canvas.addChildren(
    // makeBlock([3, 0, 0]),
    // makeSprite('./assets/brick_wall.png', PlaneView.TOP, [2, 2, 0], 4, 4),
    // makeSprite('./assets/duck.png', PlaneView.SIDE, [2, 2, 0], 4, 4),
    // makeSprite('./assets/duck.png', PlaneView.FRONT, [6, 2, 0], 4, 4),

    makeSprite('./assets/duck.png', PlaneView.FRONT, mapGrid.surfaceCoord(0, 0), 1, 1),
    makeSprite('./assets/duck.png', PlaneView.SIDE, mapGrid.surfaceCoord(1, 2), 1, 1),
    makeSprite('./assets/duck.png', PlaneView.SIDE, mapGrid.surfaceCoord(2, 3), 1, 1),
    // makeSprite('./assets/duck.png', PlaneView.TOP, [0, 4, 2], 2, 2),
);

(window as Record<string, any>).canvas = canvas

