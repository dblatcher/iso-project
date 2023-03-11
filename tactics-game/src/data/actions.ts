import { jumpFigure } from "../../../src/animations/jump";
import { shiftFigure } from "../../../src/animations/shiftFigure";
import { spinFigure } from "../../../src/animations/spin";
import { turnFigure } from "../../../src/animations/turn";
import { pause } from "../../../src/animations/util";
import { getDirectionTowards } from "../../../src/CardinalDirection";
import { Action, ActionRange, ActionTarget } from "../Action";

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
        const { canvas } = battle
        await turnFigure(canvas)(actor, getDirectionTowards(actor, targetFigure))
        await jumpFigure(canvas)(actor, .5)
        await targetFigure.takeDamage(1)
        await jumpFigure(canvas)(targetFigure, .75)
        console.log(targetFigure.remaining)
    }
)

export const ACTIONS = { wait, jump, throwInAir, punch }
