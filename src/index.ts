import { IsometricCanvas } from '@elchininet/isometric'
import { buildCubeGroup } from './cube';


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
    buildCubeGroup(0, 0, 0, 1),
    buildCubeGroup(0, 1, 0, 1),
    buildCubeGroup(0, 2, 0, .75),
)
