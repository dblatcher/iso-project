import { IsometricGroup } from '@elchininet/isometric'
import { CardinalDirection } from './CardinalDirection';
import { DirectionalSprite } from './DirectionalSprite';

export interface FigureSprite {
    x: number,
    y: number,
    facing: CardinalDirection,
    sprite: DirectionalSprite,
    spriteIsoGroup?: IsometricGroup,
    shadowIsoGroup?: IsometricGroup,
    className?: string,
}
