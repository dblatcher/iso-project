import { DIRECTION } from "../../src/CardinalDirection"
import { MapCell } from "../../src/MapCell"
import { Battle, Team } from "./Battle"
import { CharacterFigure } from "./CharacterFigure"
import { barrelSprite, duckSprite, manSprite } from "./sprites"

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

cells[3][3].classes = ['marked']

const figures = [
    new CharacterFigure({ x: 2, y: 2, sprite: manSprite, facing: DIRECTION.south, }, 'team1', { name: 'Bob', move: 4, health: 5, action: 1 }),
    new CharacterFigure({ x: 3, y: 2, sprite: barrelSprite, facing: DIRECTION.south }, 'team1', { name: 'Tun', move: 2, health: 8, action: 0 }),
    new CharacterFigure({ x: 4, y: 2, sprite: duckSprite, facing: DIRECTION.south }, 'team1', { name: 'Abdul', move: 4, health: 4, action: 1 }),
    new CharacterFigure({ x: 3, y: 6, sprite: duckSprite, facing: DIRECTION.north }, 'team2', { name: 'Mary', move: 4, health: 4, action: 1 }),
    new CharacterFigure({ x: 4, y: 6, sprite: manSprite, facing: DIRECTION.north }, 'team2', { name: 'Gregor', move: 4, health: 4, action: 1 }),
]

const teams: Team[] = [
    { id: 'team1', name: 'Red Team', color: 'crimson' },
    { id: 'team2', name: 'Blue Squad', color: 'skyblue' },
]

const battle = new Battle(container, panel, teams, figures, cells, {
    renderCompass: true,
    renderOrientation: DIRECTION.west,
    defaultBlockTopColor: 'lightgreen',
    defaultBlockSideColor: 'rosybrown',
})

const windowWithBattle = window as Window & { battle?: Battle };
windowWithBattle.battle = battle


