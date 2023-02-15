import { IsometricGroup } from '@elchininet/isometric'
import { Direction } from './direction';
import { DirectionalSprite } from './DirectionalSprite';

export interface FigureSprite {
    x: number,
    y: number,
    facing: Direction,
    sprite: DirectionalSprite,
    iso?: IsometricGroup,
}
