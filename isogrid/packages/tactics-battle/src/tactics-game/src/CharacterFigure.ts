import { IsometricGroup } from "@elchininet/isometric";
import { floatingMessage } from "@isogrid/map-canvas";
import type { CardinalDirection, BaseFigure, DirectionalSprite } from "@isogrid/map-canvas";
import { Action } from "./Action";
import type { Battle } from "./Battle";
import { ACTIONS } from "./data/actions";

export type Attributes = {
    name: string;
    move: number;
    action: number;
    health: number;
}

const CSS_CLASSES = {
    selected: 'selected',
    ourTurn: 'current-team',
    noMovesLeft: 'no-moves',
    down: 'blacked-out',
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
    remaining: {
        move: number;
        action: number;
        health: number;
    }
    selectedAction?: Action
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
        this.remaining = {
            move: attributes.move,
            action: attributes.action,
            health: attributes.health,
        }
        this.selectedAction = undefined
    }

    get isOnCurrentTeam() {
        return this.battle?.currentTeam.id === this.teamId
    }

    get classNames() {
        const classNames = []
        if (this.isOnCurrentTeam) { classNames.push(CSS_CLASSES.ourTurn) }
        if (this.selected) { classNames.push(CSS_CLASSES.selected) }
        if (this.remaining.move === 0 && this.remaining.action === 0) { classNames.push(CSS_CLASSES.noMovesLeft) }
        if (this.isOut) { classNames.push(CSS_CLASSES.down) }
        return classNames
    }

    get availableActions(): Action[] {
        const actions: Action[] = [
            ACTIONS.wait,
            ACTIONS.punch,
            ACTIONS.jump,
            ACTIONS.throwInAir,
        ]
        return actions
    }

    get isOut(): boolean {
        return this.remaining.health <= 0
    }

    async takeDamage(amount: number) {
        this.remaining.health = this.remaining.health - amount
        if (this.isOut) {
            this.remaining.action = 0
            this.remaining.move = 0
        }

        const { battle, spriteIsoGroup, sprite } = this
        const { height = 1 } = sprite

        return floatingMessage(battle.canvas, {
            text: `-${amount.toString()}`,
            top: spriteIsoGroup.top + height,
            left: spriteIsoGroup.left,
            right: spriteIsoGroup.right,
            rise: 2,
            fillColor: 'red',
            pauseSeconds: 1.5,
        });
    }

    resetForTurn() {
        this.remaining.move = this.isOut ? 0 : this.attributes.move;
        this.remaining.action = this.isOut ? 0 : this.attributes.action;
    }
}
