import { DIRECTION } from "../../../src/CardinalDirection";
import { Team } from "../types";
import { CharacterFigure } from "../CharacterFigure";
import { manSprite, barrelSprite, duckSprite } from "../sprites";

export const teams: Team[] = [
    { id: 'team1', name: 'Red Team', color: 'crimson' },
    { id: 'team2', name: 'Blue Squad', color: 'skyblue' },
]

export const figures = [
    new CharacterFigure({ x: 2, y: 2, sprite: manSprite, facing: DIRECTION.south, }, 'team1', { name: 'Bob', move: 4, health: 5, action: 1 }),
    new CharacterFigure({ x: 3, y: 2, sprite: barrelSprite, facing: DIRECTION.south }, 'team1', { name: 'Tun', move: 2, health: 8, action: 0 }),
    new CharacterFigure({ x: 4, y: 2, sprite: duckSprite, facing: DIRECTION.south }, 'team1', { name: 'Abdul', move: 4, health: 4, action: 1 }),
    new CharacterFigure({ x: 3, y: 6, sprite: duckSprite, facing: DIRECTION.north }, 'team2', { name: 'Mary', move: 4, health: 4, action: 1 }),
    new CharacterFigure({ x: 4, y: 6, sprite: manSprite, facing: DIRECTION.north }, 'team2', { name: 'Gregor', move: 4, health: 4, action: 1 }),
]
