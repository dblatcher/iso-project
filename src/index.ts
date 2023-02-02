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
        height:500,
        width:500,
        planeView:PlaneView.TOP,
        fillColor: 'pink',
    })
)

canvas.addChildren(
    makeSprite('./assets/duck.png', PlaneView.FRONT, [0, 0, 0], 2, 2),
    makeSprite('./assets/duck.png', PlaneView.FRONT, [0, 0, 0], 4, 4),
    makeSprite('./assets/duck.png', PlaneView.TOP, [0, 0, 0], 3, 3),
    // buildCubeGroupWithShadow([0, 0, 3], 2),
    buildCubeGroupWithShadow([0, 5, 0], 2),
    // buildCubeGroupWithShadow([5, 0, 0], 2),

    buildCubeGroup([1, 1, 0], 1),

    makeBlock([3, 0, 0]),
)


