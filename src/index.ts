import { IsometricCanvas, PlaneView } from '@elchininet/isometric'
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


canvas.addChildren(
    makeSprite('./assets/duck.png', PlaneView.SIDE,  0, 5, 0, 2, 2),
    makeSprite('./assets/duck.png', PlaneView.FRONT, 0, 5, 0, 4, 4),
    makeSprite('./assets/duck.png', PlaneView.TOP,   0, 5, 0, 3, 3),
    // buildCubeGroupWithShadow(0, 0, 3, 2),
    buildCubeGroupWithShadow(0, 5, 0, 2),
    // buildCubeGroupWithShadow(5, 0, 0, 2),

    buildCubeGroup(4, 2, 0, .75),

    makeBlock(0, 0, 0),
)
