import { IsometricRectangle, PlaneView, IsometricGroup, IsometricCircle } from '@elchininet/isometric'
import { Direction } from './direction';
import { DirectionalSprite } from './DirectionalSprite';

export interface FigureSprite {
    x: number,
    y: number,
    facing: Direction,
    sprite: DirectionalSprite,
    iso?: IsometricGroup,
}

export const renderFigure = (url: string, planeView: PlaneView, coords: [number, number, number], width = 1, height = 1) => {
    const [right, left, top] = coords
    const commonTextureProps = {
        url,
        height,
        width,
        pixelated: true
    };

    const sprite = new IsometricRectangle({
        planeView,
        height,
        width,
        texture: commonTextureProps,
        strokeColor: 'none',
    });

    switch (planeView) {
        case 'SIDE':
            sprite.right = (-width / 2) + .5
            sprite.left = .5
            break;
        case 'FRONT':
            // sprite.left = (-width / 2) + .5
            sprite.right = .5
            break;
        case 'TOP':
            sprite.left = (-width / 2) + .5
            sprite.right = (-width / 2) + .5
            break;

    }

    sprite.getElement().classList.add('sprite','figure')

    const shadow = new IsometricCircle({ radius: width / 4, left: 0.5, right: 0.5, top: 0, planeView: PlaneView.TOP, fillColor: 'black' })

    const group = new IsometricGroup({ top, right, left, })
    group.addChildren(shadow, sprite,)
    return group

}