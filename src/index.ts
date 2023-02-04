import { IsometricCanvas, IsometricRectangle, PlaneView } from '@elchininet/isometric'
import { makeBlock } from './blockWithTexture';
import { buildCuboid, buildCuboidWithShadow } from './cuboids';
import { makeSprite } from './flatSprite';
import { IMAGES } from './textures';

const container = document.createElement('div')
document.body.appendChild(container)


const canvas = new IsometricCanvas({
    container,
    backgroundColor: '#CCC',
    scale: 30,
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

canvas.addChildren(
    // makeBlock([3, 0, 0]),
    // makeSprite('./assets/brick_wall.png', PlaneView.TOP, [2, 2, 0], 4, 4),
    // makeSprite('./assets/duck.png', PlaneView.SIDE, [2, 2, 0], 4, 4),
    // makeSprite('./assets/duck.png', PlaneView.FRONT, [6, 2, 0], 4, 4),

    buildCuboid({ coords: [2, 4, 0], size: 1, height: 5 }),
    buildCuboid({ coords: [3, 4, 0], size: 1, height: 10, sideImage:IMAGES.wall }),
    buildCuboid({ coords: [5, 3, 0], size: 1, height: 10, sideImage:IMAGES.wall }),
    buildCuboid({ coords: [6, 3, 0], size: 1, height: 10, sideImage:IMAGES.wall }),
    buildCuboid({ coords: [7, 3, 0], size: 1, height: 10, sideImage:IMAGES.wall }),
    buildCuboid({ coords: [4, 4, 0], size: 5, height: 3, sideImage: IMAGES.wall, topImage:IMAGES.grass }),
    makeSprite('./assets/duck.png', PlaneView.FRONT, [6, 6, 3], 4, 4),
);

(window as Record<string, any>).canvas = canvas

