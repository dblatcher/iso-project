import { IsometricPath, IsometricRectangle, PlaneView, Axis, IsometricGroup } from '@elchininet/isometric'
import { BaseObstacle, PathDef } from '../BaseObstacle';
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

const getLowestXCoord = (path: PathDef): number => {
    return path.points.reduce<number>((currentLowest, nextPoint) => {
        return Math.min(currentLowest, nextPoint.x)
    }, 1000)
}
const getLowestYCoord = (path: PathDef): number => {
    return path.points.reduce<number>((currentLowest, nextPoint) => {
        return Math.min(currentLowest, nextPoint.y)
    }, 1000)
}

const sortByFurthestBack = (pathA: PathDef, pathB: PathDef): number => {
    const xDiff = getLowestXCoord(pathA) - getLowestXCoord(pathB)
    if (xDiff!==0) {return xDiff}
    return getLowestYCoord(pathA) - getLowestYCoord(pathB)
}

export const makeObstacleShape = (config: ObstableShapeConfig) => {
    const { coords, obstacle, orientation } = config
    const { paths } = obstacle

    if (!paths) {
        return makeDefaultShape(config)
    }
    const [right, left, top] = coords

    const rotatedPaths = obstacle.paths.map((path): PathDef => {
        const rotatedPoints = path.points.map(point => {
            const { x, y } = findPositionInRotatedGrid(point, 2, 2, orientation)
            return { x, y, z: point.z }
        })

        return {
            ...path,
            points: rotatedPoints
        }
    })

    rotatedPaths.sort(sortByFurthestBack)

    const sideIsoPaths = rotatedPaths.map(path => {
        const sideIsoPath = new IsometricPath({
            fillColor: path.fillColor || obstacle.fillColor || 'transparent'
        });

        const [firstPoint, ...restOfPoints] = path.points
        sideIsoPath.moveTo(...spreadPoint(firstPoint));
        [...restOfPoints, firstPoint].forEach(point => sideIsoPath.lineTo(...spreadPoint(point)))
        return sideIsoPath
    })



    const group = new IsometricGroup({ top, right, left, })

    group.addChildren(
        ...sideIsoPaths,
    )

    return group
}
