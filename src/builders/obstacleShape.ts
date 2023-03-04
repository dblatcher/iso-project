import { IsometricPath, IsometricRectangle, PlaneView, Axis, IsometricGroup } from '@elchininet/isometric'
import { BaseObstacle } from '../BaseObstacle';

interface ObstableShapeConfig {
    coords: [number, number, number];
    obstacle: BaseObstacle;
}


const makeTextures = (url: string) => {
    const commonTextureProps = {
        height: 1,
        width: 1,
        pixelated: true
    };

    const side = {
        url,
        PlaneView: PlaneView.SIDE,
        ...commonTextureProps
    };
    const front = {
        url,
        PlaneView: PlaneView.FRONT,
        ...commonTextureProps
    };

    const top = {
        url,
        planeView: PlaneView.TOP,
        rotation: {
            axis: Axis.LEFT,
            value: 26.5650
        },
        ...commonTextureProps
    };
    return {
        front, side, top
    }
}

export const makeObstacleShape = (config: ObstableShapeConfig) => {
    const { coords, obstacle } = config
    const [right, left, top] = coords

    const side = new IsometricPath({
        fillColor: obstacle.fillColor
    });

    const front = new IsometricRectangle({
        planeView: PlaneView.FRONT,
        height: 0.5,
        width: 1,
        fillColor: obstacle.fillColor,
    });

    const chop = new IsometricPath({
        fillColor: obstacle.fillColor
    });


    side
        .moveTo(1, 1, 0)
        .lineTo(1, 1, .5)
        .lineTo(0, 1, 1)
        .lineTo(0, 1, 0)
    chop.draw('M1 1 0.5 L0 1 1 L0 0 1 L1 0 0.5');


    front.right = 1;

    const group = new IsometricGroup({ top, right, left, })
    group.addChildren(side, front, chop)

    return group
}
