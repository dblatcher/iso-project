import { getDirectionTowards, rotateFunnyVector, turnFigure, spinFigure, slideFigure, shiftFigure, jumpFigure } from "@isogrid/map-canvas"
import { Action, ActionRange, ActionTarget } from "../../Action";

const wait = new Action('wait', ActionRange.Self, ActionTarget.Any,
  async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle
    await canvas.executeAnimation(() => {
      return spinFigure(canvas)(actor, 2, 100)
    })
  }
)

const jump = new Action('jump', ActionRange.OneAway, ActionTarget.Empty,
  async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle
    const { x, y } = canvas.getCellCoords(targetCell)
    await canvas.executeAnimation(async () => {
      await turnFigure(canvas)(actor, getDirectionTowards(actor, { x, y }))
      await jumpFigure(canvas)(actor, 1)
      await shiftFigure(canvas)(actor, x - actor.x, y - actor.y, 3)
      return
    })
  }
)

const throwInAir = new Action('throw', ActionRange.Close, ActionTarget.AnyFigure,
  async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle
    if (!targetFigure) {
      return
    }
    await canvas.executeAnimation(() => {
      return jumpFigure(canvas)(targetFigure, 3)
    })
  }
)

const punch = new Action('punch', ActionRange.Close, ActionTarget.Enemy,
  async (actor, targetFigure, targetCell, battle) => {
    if (!targetFigure) {
      return
    }
    const direction = getDirectionTowards(actor, targetFigure)
    const towards = rotateFunnyVector(0, -0.5, direction)
    const { canvas } = battle

    await turnFigure(canvas)(actor, direction)
    await slideFigure(canvas)(actor, { x: towards.x * -1, y: towards.y * -1 }, 50)
    await slideFigure(canvas)(actor, { x: towards.x * 1.4, y: towards.y * 1.4 }, 25)
    await slideFigure(canvas)(actor, { x: towards.x * -.4, y: towards.y * -.4 }, 25)
    await slideFigure(canvas)(targetFigure, { x: towards.x * .5, y: towards.y * .5 }, 15)
    await slideFigure(canvas)(targetFigure, { x: towards.x * -.5, y: towards.y * -.5 }, 15)

    await targetFigure.takeDamage(1)
  }
)

export const ACTIONS = { wait, jump, throwInAir, punch }
