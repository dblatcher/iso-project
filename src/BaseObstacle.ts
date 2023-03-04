import { IsometricGroup, } from '@elchininet/isometric'
import { CardinalDirection } from './CardinalDirection';

export interface BaseObstacle {
    x: number;
    y: number;
    facing: CardinalDirection;
    textureUrl?: string,
    fillColor?: string,
    isoGroup?: IsometricGroup;
}
