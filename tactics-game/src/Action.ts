import { jumpFigure } from "../../src/animations/jump"
import { MapCell } from "../../src/MapCell"
import { Battle } from "./Battle"
import { CharacterFigure } from "./CharacterFigure"

export enum ActionRange {
    Self,
    Close,
}

type ExcutionFunction = { (actor: CharacterFigure, targetFigure: CharacterFigure | undefined, targetCell: MapCell, battle: Battle): Promise<void> }

export class Action {
    name: string
    range: ActionRange
    execute: ExcutionFunction
    constructor(name: string, range: ActionRange, execute: ExcutionFunction) {
        this.name = name
        this.range = range
        this.execute = execute
    }

    getTargetCells(figure: CharacterFigure, Battle: Battle): MapCell[] {
        switch (this.range) {
            case ActionRange.Self:
                return [
                    Battle.canvas.cells[figure.x][figure.y]
                ]
            case ActionRange.Close:
                return [
                    Battle.canvas.cells[figure.x - 1][figure.y],
                    Battle.canvas.cells[figure.x + 1][figure.y],
                    Battle.canvas.cells[figure.x][figure.y - 1],
                    Battle.canvas.cells[figure.x][figure.y + 1],
                ]
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
