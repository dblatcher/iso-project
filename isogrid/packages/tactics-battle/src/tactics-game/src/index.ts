import { DIRECTION } from "@isogrid/map-canvas"
import { Battle } from "./Battle"
import { figures, teams } from "./data/figures"
import { buildGrid } from "./lib/buildGrid"


export const addAppToDocument = (document: Document) => {

  const container = document.createElement('div')
  document.body.appendChild(container)
  const actionPanel = document.createElement('div')
  actionPanel.classList.add('action')
  actionPanel.classList.add('panel')
  document.body.appendChild(actionPanel)

  const turnPanel = document.createElement('div')
  turnPanel.classList.add('turn')
  turnPanel.classList.add('panel')
  document.body.appendChild(turnPanel)

  const cells = buildGrid()

  const battle = new Battle(container, actionPanel, turnPanel, teams, figures, cells, {
    renderCompass: true,
    renderOrientation: DIRECTION.west,
    defaultBlockTopColor: 'lightgreen',
    defaultBlockSideColor: 'rosybrown',
  })

  return battle
}

