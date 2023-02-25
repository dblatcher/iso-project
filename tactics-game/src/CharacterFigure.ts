import { IsometricGroup } from "@elchininet/isometric";
import type { BaseFigure } from "../../src/BaseFigure";
import type { CardinalDirection } from "../../src/CardinalDirection";
import type { DirectionalSprite } from "../../src/DirectionalSprite";
import type { Battle } from "./Battle";

export type Attributes = {
    name: string;
    move: number;
}

const CSS_CLASSES = {
    selected: 'selected',
    ourTurn: 'current-team',
    noMovesLeft: 'no-moves',
}

export class CharacterFigure implements BaseFigure {
    x: number;
    y: number;
    facing: CardinalDirection
    sprite: DirectionalSprite
    spriteIsoGroup?: IsometricGroup;
    attributes: Attributes
    teamId: string
    selected: boolean;
    remainingMoves: number;
    battle?: Battle
    constructor(base: BaseFigure, teamId: string, attributes: Attributes) {
        const { x, y, facing, sprite } = base
        this.x = x
        this.y = y
        this.facing = facing
        this.sprite = sprite
        this.teamId = teamId
        this.attributes = attributes
        this.selected = false
        this.remainingMoves = attributes.move
    }

    get isOnCurrentTeam() {
        return this.battle?.currentTeam.id === this.teamId
    }

    get classNames() {
        const classNames = []
        if (this.isOnCurrentTeam) { classNames.push(CSS_CLASSES.ourTurn) }
        if (this.selected) { classNames.push(CSS_CLASSES.selected) }
        if (this.remainingMoves === 0) { classNames.push(CSS_CLASSES.noMovesLeft) }
        return classNames
    }
}