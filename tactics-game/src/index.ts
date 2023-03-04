import { antiClockwise, clockwise, DIRECTION } from "../../src/CardinalDirection"
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



const clockwiseButton = document.createElement('button')
clockwiseButton.innerText = '↺';
document.body.appendChild(clockwiseButton);
const anticlockwiseButton = document.createElement('button')
anticlockwiseButton.innerText = '↻';
document.body.appendChild(anticlockwiseButton);

clockwiseButton.addEventListener('click', () => {
    battle.canvas.render(clockwise(battle.canvas.renderOrientation))
})
anticlockwiseButton.addEventListener('click', () => {
    battle.canvas.render(antiClockwise(battle.canvas.renderOrientation))
})