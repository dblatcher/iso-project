import { IsometricGroup, IsometricRectangle } from '@elchininet/isometric'
import { CardinalDirection } from './CardinalDirection';
import { DirectionalSprite } from './DirectionalSprite';

export interface BaseFigure {
    x: number;
    y: number;
    facing: CardinalDirection;
    sprite: DirectionalSprite;
    frameIndex?: number;
    spriteIsoGroup?: IsometricGroup;
    shadowIsoGroup?: IsometricGroup;
    frameRectangles?: IsometricRectangle[];
    classNames?: string[];
}
