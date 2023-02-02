import { IsometricPath, IsometricRectangle, PlaneView, Axis, IsometricGroup } from '@elchininet/isometric'

export const makeBlock = (right: number, left: number, top: number) => {

    const commonTextureProps = {
        height: 1,
        width: 1,
        pixelated: true
    };

    const textureSides = {
        url: 'assets/brick_wall.png',
        ...commonTextureProps
    };

    const textureTop = {
        url: 'assets/brick_wall.png',
        planeView: PlaneView.TOP,
        rotation: {
            axis: Axis.LEFT,
            value: 26.5650
        },
        ...commonTextureProps
    };

    const side = new IsometricPath({
        texture: {
            planeView: PlaneView.SIDE,
            ...textureSides
        }
    });

    const front = new IsometricRectangle({
        planeView: PlaneView.FRONT,
        height: 0.5,
        width: 1,
        texture: textureSides
    });

    const chop = new IsometricPath({
        texture: textureTop
    });

    side.draw('M1 1 0 L1 1 0.5 L0 1 1 L0 1 0');
    chop.draw('M1 1 0.5 L0 1 1 L0 0 1 L1 0 0.5');

    side.moveTo(0, 1, 0)
    front.right = 1;

    const group = new IsometricGroup({ top, right, left, })
    group.addChildren(side, front, chop)

    return group

}