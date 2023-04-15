import { IsometricGroup, } from '@elchininet/isometric'
import { CardinalDirection } from './CardinalDirection';

export type PathDef = {
    points: {
        x: number,
        y: number,
        z: number,
    }[]
    fillColor?: string,
}

export interface BaseObstacle {
    x: number;
    y: number;
    facing: CardinalDirection;
    textureUrl?: string,
    fillColor?: string,
    isoGroup?: IsometricGroup;
    paths: PathDef[]
}
