import { DIRECTION } from "../../src/CardinalDirection"
import { Battle } from "./Battle"
import { figures, teams } from "./data/figures"
import { buildGrid } from "./lib/buildGrid"

const container = document.createElement('div')
document.body.appendChild(container)
const panel = document.createElement('div')
panel.classList.add('panel')
document.body.appendChild(panel)

const cells = buildGrid()

const battle = new Battle(container, panel, teams, figures, cells, {
    renderCompass: true,
    renderOrientation: DIRECTION.west,
    defaultBlockTopColor: 'lightgreen',
    defaultBlockSideColor: 'rosybrown',
})

const windowWithBattle = window as Window & { battle?: Battle };
windowWithBattle.battle = battle


