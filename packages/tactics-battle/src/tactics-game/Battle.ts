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
  private _selectedCell?: MapCell

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
    this._selectedCell = undefined

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
        setFigureAction: (action: Action) => {
          if (!selectedFigure) return
          this.setFigureAction(selectedFigure, action)
        }
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
    return this._selectedCell
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
    this._selectedCell = selectedCell
  }

  get cellsInRange(): MapCell[] {
    const { selectedFigure, commandType } = this
    if (!selectedFigure) {
      return []
    }
    if (commandType === 'MOVE') {
      return findReachableCells(selectedFigure, this.canvas.cells)
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
      if (!cell) { return }
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
    const currentSelectedIndex = selectedFigure ? list.indexOf(selectedFigure) : -1;
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

  async handleActionClick(cell: MapCell) {
    const { selectedFigure } = this
    if (!selectedFigure) { return }
    const { selectedAction } = selectedFigure
    if (!selectedAction) { return }
    if (selectedFigure.remaining.action <= 0) {
      console.log(`${selectedFigure.attributes.name} has no actions left`)
      return
    }
    const targets = selectedAction.getCellsInRange(selectedFigure, this)

    if (!targets.includes(cell)) {
      console.log(`out of range to ${selectedAction.name}`)
      return
    }

    if (!selectedAction.isValidTarget(selectedFigure, cell, this)) {
      console.log(`Not valid target to ${selectedAction.name}`)
      return
    }

    await this.doAction(selectedFigure, cell, selectedAction)
    this.redraw()
  }

  async handleMoveCellClick(cell: MapCell) {
    const { selectedFigure, selectedCell, canvas, figureRoute = [] } = this
    const cellCoords = canvas.getCellCoords(cell)

    if (!selectedFigure || !selectedFigure.isOnCurrentTeam || selectedFigure.remaining.move <= 0) {
      return
    }

    // if user clicked on the selected figure's cell, unselect the selected cell
    if (cellCoords.x == selectedFigure.x && cellCoords.y === selectedFigure.y) {
      this.selectedCell = undefined
      this.markCells([], CELL_CLASS.path)
      return
    }

    // if user clicked on the previously clicked selectedCell to confirm the move, execute the command
    if (cell === selectedCell) {
      const routeIsValid = figureRoute.includes(selectedCell)
      if (routeIsValid) {

        await this.doMove(selectedFigure, figureRoute)

        this.figureRoute = undefined
        if (selectedFigure.remaining.move <= 0) {
          this.setCommandType('ACTION')
        } else {
          this.markCells(this.cellsInRange, CELL_CLASS.reachable)
        }
        this.redraw()
      }
      return
    }

    // If use clicks on any other cell, set it as the selectedCell
    this.figureRoute = findPathFrom(selectedFigure, cellCoords, this.canvas.cells)
    this.selectedCell = cell
    this.markCells(this.figureRoute, CELL_CLASS.path)
  }

  manageFigureClick = (canvas: MapGridIsometricCanvas) => async (figure: CharacterFigure) => {
    const { commandType } = this
    const cell = canvas.cells[figure.x][figure.y]
    if (!cell) { return false }

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
        return await this.handleActionClick(cell)
    }
  }

  manageCellClick = () => async (cell: MapCell) => {
    const { commandType } = this
    switch (commandType) {
      case 'ACTION':
        this.handleActionClick(cell)
        break
      case 'MOVE': {
        this.handleMoveCellClick(cell)
        break
      }
    }
  }


  async doMove(figure: CharacterFigure, route: MapCell[]) {
    const { canvas } = this
    figure.remaining.move = figure.remaining.move - route.length
    this.selectedCell = undefined
    this.markCells([], CELL_CLASS.path)
    return await canvas.executeAnimation(() => followPath(canvas.castToBase())(figure, route))
  }


  async doAction(figure: CharacterFigure, targetCell: MapCell, action: Action) {
    figure.remaining.action--
    this.markCells(this.cellsInRange, CELL_CLASS.reachable)
    return await action.perform(figure, targetCell, this)
  }
}

