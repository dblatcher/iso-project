import { MapGridIsometricCanvas, MapGridCanvasConfig, MapCell, followPath } from "@isogrid/map-canvas"
import { CharacterFigure } from "./CharacterFigure";
import { Panel } from "./components/Panel";
import { h, render } from 'preact'
import { findPathFrom, findReachableCells } from "./lib/pathFind";
import { CommandType, Team } from "./types";
import { Action } from "./Action";
import { TurnPanel } from "./components/TurnPanel";


const CELL_CLASS = {
  path: 'marked',
  selected: 'selected',
  reachable: 'reachable',
}

export class Battle {
  canvas: MapGridIsometricCanvas<CharacterFigure>
  actionPanelElement: HTMLElement
  turnPanelElement: HTMLElement
  teams: Team[]
  currentTeam: Team
  figureRoute?: MapCell[]
  commandType: CommandType

  constructor(
    container: HTMLElement,
    actionPanelElement: HTMLElement,
    turnPanelElement: HTMLElement,
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
      [

      ],
      mapGridCanvasConfig,
    )
    this.commandType = 'MOVE'

    this.canvas.onClick.figure = this.manageFigureClick
    this.canvas.onClick.cell = this.manageCellClick
    this.actionPanelElement = actionPanelElement
    this.updateActionPanel()

    this.turnPanelElement = turnPanelElement
    this.updateTurnPanel()
  }

  updateActionPanel() {
    const { selectedFigure, currentTeam } = this

    render(
      h(Panel, {
        team: currentTeam,
        selectedFigure: selectedFigure,
        commandType: this.commandType,
        setCommandType: (commandType: CommandType) => { this.setCommandType(commandType) },
        setFigureAction: (action: Action) => { this.setFigureAction(selectedFigure, action) }
      }),
      this.actionPanelElement
    );
  }

  updateTurnPanel() {
    render(h(TurnPanel, {
      battle: this
    }), this.turnPanelElement)
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

  get cellsInRange(): MapCell[] {
    const { selectedFigure, commandType } = this
    if (!selectedFigure) {
      return []
    }
    if (commandType === 'MOVE') {
      return findReachableCells(this.selectedFigure, this.canvas.cells)
    }
    if (commandType === 'ACTION') {
      if (selectedFigure.remaining.action <= 0) {
        return []
      }
      const { selectedAction } = selectedFigure
      if (!selectedAction) {
        return []
      }
      return selectedAction.getCellsInRange(selectedFigure, this)
    }
    return []
  }


  markCells(cellsToMark: MapCell[], cssClass: string) {
    this.canvas.cells.flat().forEach(cell => {
      if (cellsToMark.includes(cell)) {
        this.canvas.addCellClass(cell, cssClass)
      } else {
        this.canvas.removeCellClass(cell, cssClass)
      }
    })
  }

  private redraw() {
    this.canvas.render(this.canvas.renderOrientation)
    this.updateActionPanel()
    this.updateTurnPanel()
  }

  setCommandType(commandType: CommandType) {
    this.commandType = commandType
    this.selectedCell = undefined
    this.markCells([], CELL_CLASS.path)
    if (commandType === 'ACTION' && this.selectedFigure) {
      this.setFigureAction(this.selectedFigure, this.selectedFigure.selectedAction || this.selectedFigure.availableActions[0])
    }
    this.markCells(this.cellsInRange, CELL_CLASS.reachable)
    this.updateActionPanel()
  }

  setFigureAction(figure: CharacterFigure, action: Action) {
    figure.selectedAction = action
    if (figure === this.selectedFigure) {
      this.markCells(this.cellsInRange, CELL_CLASS.reachable)
    }
    this.redraw()
  }

  selectNextFigureWithMoves(reverse = false) {
    this.selectedCell = undefined
    this.markCells([], CELL_CLASS.path)
    const { selectedFigure } = this
    const { figures } = this.canvas
    const list = reverse ? [...figures].reverse() : figures
    const currentSelectedIndex = list.indexOf(selectedFigure)
    const nextAfter = list.slice(currentSelectedIndex + 1).find(figure => figure.isOnCurrentTeam && figure.remaining.move > 0)
    if (nextAfter) {
      this.selectedFigure = nextAfter
      this.setCommandType('MOVE')
      return
    }
    this.selectedFigure = list.find(figure => figure.isOnCurrentTeam && figure.remaining.move > 0)
    this.setCommandType('MOVE')
  }

  endTurn() {
    const teamindex = this.teams.indexOf(this.currentTeam)
    this.currentTeam = this.teams[teamindex + 1] || this.teams[0]
    this.canvas.figures.map(figure => figure.resetForTurn())
    this.selectedFigure = undefined
    this.selectNextFigureWithMoves()
    this.redraw()
  }

  async doAction(cell: MapCell) {
    const { selectedFigure } = this
    const { selectedAction } = selectedFigure
    if (selectedFigure.remaining.action <= 0) {
      console.log(`${selectedFigure.attributes.name} has no actions left`)
      return
    }
    const targets = selectedFigure.selectedAction.getCellsInRange(selectedFigure, this)

    if (!targets.includes(cell)) {
      console.log(`out of range to ${selectedFigure.selectedAction.name}`)
      return
    }

    if (!selectedAction.isValidTarget(selectedFigure, cell, this)) {
      console.log(`Not valid target to ${selectedAction.name}`)
      return
    }

    selectedFigure.remaining.action--
    await selectedFigure.selectedAction.perform(selectedFigure, cell, this)
    this.markCells(this.cellsInRange, CELL_CLASS.reachable)
    this.redraw()
  }

  async doMove(cell: MapCell) {
    const { selectedFigure, selectedCell, canvas } = this
    const { x, y } = canvas.getCellCoords(cell)
    if (selectedFigure && selectedFigure.isOnCurrentTeam && selectedFigure.remaining.move > 0) {
      // if user clicks on the selected figure, unselect the selected cell
      if (x == selectedFigure.x && y === selectedFigure.y) {
        this.selectedCell = undefined
        this.markCells([], CELL_CLASS.path)
      }
      // user clicks on the cell they selected to confirm the move
      else if (selectedCell && cell === selectedCell) {
        const routeIsValid = this.figureRoute?.includes(selectedCell)
        if (routeIsValid) {
          selectedFigure.remaining.move = selectedFigure.remaining.move - this.figureRoute.length
          this.selectedCell = undefined
          this.markCells([], CELL_CLASS.path)
          await canvas.executeAnimation(() => followPath(this.canvas)(selectedFigure, this.figureRoute))
          this.figureRoute = undefined
          if (selectedFigure.remaining.move <= 0) {
            this.setCommandType('ACTION')
          } else {
            this.markCells(this.cellsInRange, CELL_CLASS.reachable)
          }
          this.redraw()
        }
        // user clicks on the cell to select
      } else {
        this.figureRoute = findPathFrom(selectedFigure, { x, y }, this.canvas.cells)
        this.selectedCell = cell
        this.markCells(this.figureRoute, CELL_CLASS.path)
      }
    }
  }

  manageFigureClick = (canvas: MapGridIsometricCanvas) => async (figure: CharacterFigure) => {
    const { commandType } = this
    const cell = canvas.cells[figure.x][figure.y]

    switch (commandType) {
      case 'MOVE':
        if (figure.isOnCurrentTeam) {
          this.selectedFigure = figure
          this.selectedCell = undefined
          this.markCells([], CELL_CLASS.path)
          this.markCells(this.cellsInRange, CELL_CLASS.reachable)
          this.redraw()
        }
        return true;
      case 'ACTION':
        return await this.doAction(cell)
    }
  }

  manageCellClick = (canvas: MapGridIsometricCanvas) => async (cell: MapCell) => {
    const { commandType } = this
    switch (commandType) {
      case 'ACTION':
        this.doAction(cell)
        break
      case 'MOVE': {
        this.doMove(cell)
        break
      }
    }
  }

}

export { Team };
