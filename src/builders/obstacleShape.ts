import { IsometricPath, IsometricRectangle, PlaneView, Axis, IsometricGroup } from '@elchininet/isometric'
import { BaseObstacle } from '../BaseObstacle';
import { CardinalDirection } from '../CardinalDirection';
import { findPositionInRotatedGrid } from '../grids';

interface ObstableShapeConfig {
    coords: [number, number, number];
    obstacle: BaseObstacle;
    orientation: CardinalDirection;
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

const makeDefaultShape = (config: ObstableShapeConfig) => {
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

    group.addChildren(
        side,
        front,
        chop,
    )

    return group
}

const spreadPoint = (point: { x: number, y: number, z: number }): [number, number, number] => [point.x, point.y, point.z]

export const makeObstacleShape = (config: ObstableShapeConfig) => {
    const { coords, obstacle, orientation } = config
    const { paths } = obstacle

    if (!paths) {
        return makeDefaultShape(config)
    }
    const [right, left, top] = coords


    // TO DO - order the side by render priority
    // draw furthest back first, so the nearer are 'on top'
    const sides = paths.map(path => {
        const side = new IsometricPath({
            fillColor: path.fillColor || obstacle.fillColor || 'transparent'
        });

        const rotatedPoints = path.points.map(point => {
            const { x, y } = findPositionInRotatedGrid(point, 2, 2, orientation)
            return { x, y, z: point.z }
        })

        const [firstPoint, ...restOfPoints] = rotatedPoints

        side.moveTo(...spreadPoint(firstPoint));

        [...restOfPoints, firstPoint].forEach(point => side.lineTo(...spreadPoint(point)))
        return side
    })



    const group = new IsometricGroup({ top, right, left, })

    group.addChildren(
        ...sides,
    )

    return group
}
