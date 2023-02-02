import { IsometricCanvas, IsometricRectangle, PlaneView } from '@elchininet/isometric'
import { makeBlock } from './blockWithTexture';
import { buildCubeGroup, buildCubeGroupWithShadow } from './cube';
import { makeSprite } from './flatSprite';

const container = document.createElement('div')
document.body.appendChild(container)


const canvas = new IsometricCanvas({
    container,
    backgroundColor: '#CCC',
    scale: 30,
    width: 500,
    height: 320
});


canvas.addChild(
    new IsometricRectangle({
        height:400,
        width:400,
        planeView:PlaneView.TOP,
        fillColor: 'pink',
    })
)
canvas.addChild(
    new IsometricRectangle({
        height:400,
        width:400,
        planeView:PlaneView.SIDE,
        fillColor: 'pink',
    })
)
canvas.addChild(
    new IsometricRectangle({
        height:400,
        width:400,
        planeView:PlaneView.FRONT,
        fillColor: 'pink',
    })
)

canvas.addChildren(
    // makeBlock([3, 0, 0]),
    // makeSprite('./assets/duck.png', PlaneView.SIDE, [0, 0, 0], 4, 4),
    makeSprite('./assets/brick_wall.png', PlaneView.TOP, [2, 2, 0], 4, 4),
    makeSprite('./assets/duck.png', PlaneView.SIDE, [2, 2, 0], 4, 4),
    makeSprite('./assets/duck.png', PlaneView.FRONT, [6, 2, 0], 4, 4),
    // buildCubeGroupWithShadow([0, 0, 3], 2),
    // buildCubeGroupWithShadow([0, 5, 0], 2),
    // buildCubeGroupWithShadow([5, 0, 0], 2),

    // buildCubeGroup([1, 1, 0], 1),

)


