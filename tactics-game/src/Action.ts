import { MapCell } from "../../src/MapCell"
import { Battle } from "./Battle"
import { CharacterFigure } from "./CharacterFigure"

export enum ActionRange {
    Self,
    Close,
}

export class Action {
    name: string
    range: ActionRange
    constructor(name: string, range: ActionRange) {
        this.name = name
        this.range = range
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
}
