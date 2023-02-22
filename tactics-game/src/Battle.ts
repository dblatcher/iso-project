import { MapCell, MapGridIsometricCanvas } from "../../src/MapGridIsometricCanvas";
import { CharacterFigure } from "./CharacterFigure";
import { Panel } from "./components/Panel";
import { h, render } from 'preact'


export type Team = {
    id: string,
    name: string,
}

export class Battle {
    canvas: MapGridIsometricCanvas<CharacterFigure>
    panel: HTMLElement
    teams: Team[]
    currentTeam: Team

    constructor(
        container: HTMLElement,
        teams: Team[],
        characterFigures: CharacterFigure[],
        terrain: MapCell[][],
        panel: HTMLElement,
    ) {
        characterFigures.forEach(figure => figure.battle = this)
        this.teams = teams
        this.currentTeam = teams[0]
        this.canvas = new MapGridIsometricCanvas(
            {
                container,
                width: 500,
                height: 500,
                scale: 25
            },
            terrain,
            characterFigures,
            {
                renderCompass: true
            }
        )

        this.canvas.onClick.figure = this.manageFigureClick
        this.canvas.onClick.cell = this.manageCellClick

        this.panel = panel
        this.updatePanel()
    }

    updatePanel() {
        const { selectedFigure, currentTeam } = this

        render(
            h(Panel, { team: currentTeam, selectedFigure: selectedFigure }),
            this.panel
        );
    }

    get selectedFigure(): CharacterFigure | undefined {
        return this.canvas.figures.find(figure => figure.selected)
    }

    set selectedFigure(selectedFigure: CharacterFigure) {
        if (this.canvas.figures.includes(selectedFigure)) {
            this.canvas.figures.forEach(figure => figure.selected = figure === selectedFigure)
        }
        this.redraw()
    }

    private redraw() {
        this.canvas.render(this.canvas.renderOrientation)
        this.updatePanel()
    }

    manageFigureClick = (canvas: MapGridIsometricCanvas) => async (figure: CharacterFigure) => {
        if (figure.isOnCurrentTeam) {
            this.selectedFigure = figure
            this.redraw()
        }
        return true
    }
    manageCellClick = (canvas: MapGridIsometricCanvas) => async (cell: MapCell) => {
        const { selectedFigure } = this
        if (selectedFigure && selectedFigure.isOnCurrentTeam && selectedFigure.remainingMoves > 0) {
            const { x, y } = canvas.getCellCoords(cell)
            selectedFigure.remainingMoves--
            await canvas.moveSingleFigure(selectedFigure, x - selectedFigure.x, y - selectedFigure.y)
            this.redraw()
        }
        return true
    }
}