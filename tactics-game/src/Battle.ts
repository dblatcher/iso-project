import { MapGridIsometricCanvas, MapGridCanvasConfig } from "../../src/MapGridIsometricCanvas";
import { CharacterFigure } from "./CharacterFigure";
import { Panel } from "./components/Panel";
import { h, render } from 'preact'
import { MapCell } from "../../src/MapCell";
import { findPathFrom } from "./lib/pathFind";
import { followPath } from "../../src/animations/followPath";


export type Team = {
    id: string,
    name: string,
    color: string,
}

const CELL_CLASS = {
    marked: 'marked',
    selected: 'selected',
}

export class Battle {
    canvas: MapGridIsometricCanvas<CharacterFigure>
    panel: HTMLElement
    teams: Team[]
    currentTeam: Team
    figureRoute?: MapCell[]

    constructor(
        container: HTMLElement,
        panel: HTMLElement,
        teams: Team[],
        characterFigures: CharacterFigure[],
        terrain: MapCell[][],
        mapGridCanvasConfig: MapGridCanvasConfig = {}
    ) {
        characterFigures.forEach(figure => figure.battle = this)
        this.teams = teams
        this.currentTeam = teams[0]
        this.canvas = new MapGridIsometricCanvas(
            {
                container,
                width: 600,
                height: 600,
                scale: 30,
                backgroundColor: 'transparent'
            },
            terrain,
            characterFigures,
            mapGridCanvasConfig,
        )

        this.canvas.onClick.figure = this.manageFigureClick
        this.canvas.onClick.cell = this.manageCellClick

        this.panel = panel
        this.updatePanel()
    }

    updatePanel() {
        const { selectedFigure, currentTeam, allFiguresMoved } = this

        render(
            h(Panel, {
                team: currentTeam,
                selectedFigure: selectedFigure,
                allFiguresMoved,
                endTurn: () => { this.endTurn() },
                nextFigure: (reverse = false) => { this.selectNextFigureWithMoves(reverse) },
            }),
            this.panel
        );
    }

    get allFiguresMoved(): boolean {
        return this.canvas.figures.every(figure => figure.remaining.move === 0 || !figure.isOnCurrentTeam)
    }

    get selectedFigure(): CharacterFigure | undefined {
        return this.canvas.figures.find(figure => figure.selected)
    }

    set selectedFigure(selectedFigure: CharacterFigure | undefined) {
        if (!selectedFigure) {
            this.canvas.figures.forEach(figure => figure.selected = false)
        } else if (this.canvas.figures.includes(selectedFigure)) {
            this.canvas.figures.forEach(figure => figure.selected = figure === selectedFigure)
        }
        this.redraw()
    }

    get selectedCell(): MapCell | undefined {
        return this.canvas.cells.flat().find(cell => cell.classes?.includes(CELL_CLASS.selected))
    }

    set selectedCell(selectedCell: MapCell | undefined) {
        if (!selectedCell) {
            this.canvas.cells.flat().forEach(cell => {
                if (!cell) { return }
                this.canvas.removeCellClass(cell, CELL_CLASS.selected)
            })
        } else {
            this.canvas.cells.flat().forEach(cell => {
                if (!cell) { return }
                if (cell === selectedCell) {
                    this.canvas.addCellClass(cell, CELL_CLASS.selected)
                } else {
                    this.canvas.removeCellClass(cell, CELL_CLASS.selected)
                }
            })
        }
    }

    markCells(cellsToMark: MapCell[]) {
        this.canvas.cells.flat().forEach(cell => {
            if (cellsToMark.includes(cell)) {
                this.canvas.addCellClass(cell, CELL_CLASS.marked)
            } else {
                this.canvas.removeCellClass(cell, CELL_CLASS.marked)
            }
        })
    }

    private redraw() {
        this.canvas.render(this.canvas.renderOrientation)
        this.updatePanel()
    }

    selectNextFigureWithMoves(reverse = false) {
        this.selectedCell = undefined
        this.markCells([])
        const { selectedFigure } = this
        const { figures } = this.canvas
        const list = reverse ? [...figures].reverse() : figures
        const currentSelectedIndex = list.indexOf(selectedFigure)
        const nextAfter = list.slice(currentSelectedIndex + 1).find(figure => figure.isOnCurrentTeam && figure.remaining.move > 0)
        if (nextAfter) {
            this.selectedFigure = nextAfter
            return
        }
        this.selectedFigure = list.find(figure => figure.isOnCurrentTeam && figure.remaining.move > 0)
    }

    endTurn() {
        const teamindex = this.teams.indexOf(this.currentTeam)
        this.currentTeam = this.teams[teamindex + 1] || this.teams[0]
        this.canvas.figures.map(figure => figure.resetForTurn())
        this.selectedFigure = undefined
        this.selectNextFigureWithMoves()
        this.redraw()
    }

    manageFigureClick = (canvas: MapGridIsometricCanvas) => async (figure: CharacterFigure) => {
        if (figure.isOnCurrentTeam) {
            this.selectedFigure = figure
            this.selectedCell = undefined
            this.markCells([])
            this.redraw()
        }
        return true
    }
    manageCellClick = (canvas: MapGridIsometricCanvas) => async (cell: MapCell) => {
        const { selectedFigure, selectedCell } = this
        const { x, y } = canvas.getCellCoords(cell)

        if (selectedFigure && selectedFigure.isOnCurrentTeam && selectedFigure.remaining.move > 0) {
            if (x == selectedFigure.x && y === selectedFigure.y) {
                this.selectedCell = undefined
                this.markCells([])
            }
            else if (selectedCell && cell === selectedCell) {
                const routeIsValid = this.figureRoute?.includes(selectedCell)

                if (routeIsValid) {
                    selectedFigure.remaining.move = selectedFigure.remaining.move - this.figureRoute.length
                    this.selectedCell = undefined
                    this.markCells([])
                    await canvas.executeAnimation(() => followPath(this.canvas)(selectedFigure, this.figureRoute))
                    this.figureRoute = undefined
                    this.redraw()
                }

            } else {
                const cellsInPath = findPathFrom(selectedFigure, { x, y }, this.canvas.cells)
                this.figureRoute = cellsInPath
                this.selectedCell = cell
                this.markCells(cellsInPath)
            }
        }
        return true
    }

}