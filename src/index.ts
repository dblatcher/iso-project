import { IsometricCanvas } from '@elchininet/isometric'
import { makeBlock } from './blockWithTexture';
import { buildCubeGroup, buildCubeGroupWithShadow } from './cube';

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
    buildCubeGroupWithShadow(0, 0, 3, 2),
    buildCubeGroupWithShadow(0, 5, 2, 2),
    buildCubeGroupWithShadow(5, 0, 0, 2),
    buildCubeGroup(4, 2, 0, .75),

    makeBlock(0, 0, 0),
    makeBlock(0, 3, 0),
)
