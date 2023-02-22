import { DIRECTION } from "../../src/CardinalDirection"
import { MapCell } from "../../src/MapGridIsometricCanvas"
import { Battle, Team } from "./Battle"
import { CharacterFigure } from "./CharacterFigure"
import { barrelSprite, duckSprite } from "./sprites"

const container = document.createElement('div')
document.body.appendChild(container)
const panel = document.createElement('div')
panel.classList.add('panel')
document.body.appendChild(panel)

const irregularRow = (): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < 10; i++) {
        const height = Math.floor(Math.random() * 10) / 25
        row.push({ height: .8 + height })
    }
    return row
}

const regularRow = (): MapCell[] => {
    const row: MapCell[] = []
    for (let i = 0; i < 10; i++) {
        row.push({ height: 1 })
    }
    return row
}

const cells: MapCell[][] = [
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    irregularRow(),
    regularRow(),
    regularRow(),
]

const figures = [
    new CharacterFigure({ x: 2, y: 2, sprite: duckSprite, facing: DIRECTION.south }, 'team1', { move: 4 }),
    new CharacterFigure({ x: 3, y: 2, sprite: barrelSprite, facing: DIRECTION.south }, 'team1', { move: 2 }),
    new CharacterFigure({ x: 4, y: 2, sprite: duckSprite, facing: DIRECTION.south }, 'team1', { move: 4 }),
    new CharacterFigure({ x: 3, y: 6, sprite: duckSprite, facing: DIRECTION.north }, 'team2', { move: 4 }),
    new CharacterFigure({ x: 4, y: 6, sprite: duckSprite, facing: DIRECTION.north }, 'team2', { move: 4 }),
]

const teams: Team[] = [
    { id: 'team1', name: 'Red Team' },
    { id: 'team2', name: 'Blue Squad' },
]

const battle = new Battle(container, teams, figures, cells, panel)


