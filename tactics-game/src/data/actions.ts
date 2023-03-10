import { jumpFigure } from "../../../src/animations/jump";
import { shiftFigure } from "../../../src/animations/shiftFigure";
import { spinFigure } from "../../../src/animations/spin";
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

export const ACTIONS = { wait, jump, throwInAir }
