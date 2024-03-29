import { MapCell } from "@isogrid/map-canvas"
import { Battle } from "./Battle"
import { CharacterFigure } from "./CharacterFigure"

export enum ActionRange {
    Self,
    Close,
    OneAway,
}

export enum ActionTarget {
    Empty,
    Ally,
    Enemy,
    AnyFigure,
    Any,
}

type ExcutionFunction = { (actor: CharacterFigure, targetFigure: CharacterFigure | undefined, targetCell: MapCell, battle: Battle): Promise<void> }

export class Action {
    name: string
    range: ActionRange
    target: ActionTarget
    execute: ExcutionFunction
    constructor(name: string, range: ActionRange, target: ActionTarget, execute: ExcutionFunction) {
        this.name = name
        this.range = range
        this.target = target
        this.execute = execute
    }

    getCellsInRange(figure: CharacterFigure, Battle: Battle): MapCell[] {
        switch (this.range) {
            case ActionRange.Self:
                return [
                    Battle.canvas.cellAt(figure.x, figure.y)
                ].filter(item => item)
            case ActionRange.Close:
                return [
                    Battle.canvas.cellAt(figure.x - 1, figure.y),
                    Battle.canvas.cellAt(figure.x + 1, figure.y),
                    Battle.canvas.cellAt(figure.x, figure.y - 1),
                    Battle.canvas.cellAt(figure.x, figure.y + 1),
                ].filter(item => item)
            case ActionRange.OneAway:
                return [
                    Battle.canvas.cellAt(figure.x - 2, figure.y),
                    Battle.canvas.cellAt(figure.x + 2, figure.y),
                    Battle.canvas.cellAt(figure.x, figure.y - 2),
                    Battle.canvas.cellAt(figure.x, figure.y + 2),
                ].filter(item => item)
        }
    }

    isValidTarget(actor: CharacterFigure, targetCell: MapCell, battle: Battle): boolean {
        const { canvas } = battle
        const { x, y } = canvas.getCellCoords(targetCell)
        const targetFigure = canvas.figures.find(figure => figure.x === x && figure.y === y)

        switch (this.target) {
            case ActionTarget.Empty:
                return !targetFigure
            case ActionTarget.AnyFigure:
                return !!targetFigure
            case ActionTarget.Any:
                return true
            case ActionTarget.Ally:
                return targetFigure && targetFigure.teamId === actor.teamId
            case ActionTarget.Enemy:
                return targetFigure && targetFigure.teamId !== actor.teamId
        }
    }

    async perform(actor: CharacterFigure, targetCell: MapCell, battle: Battle) {
        const { canvas } = battle
        const { x, y } = canvas.getCellCoords(targetCell)
        const targetFigure = canvas.figures.find(figure => figure.x === x && figure.y === y)
        console.log(`${actor.attributes.name} is going to ${this.name} at [${x} , ${y}]`)
        if (targetFigure) {
            console.log(`${targetFigure.attributes.name} is in that cell.`)
        }

        return await this.execute(actor, targetFigure, targetCell, battle)
    }
}
