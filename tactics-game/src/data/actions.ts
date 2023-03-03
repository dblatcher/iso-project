import { jumpFigure } from "../../../src/animations/jump";
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

const jump = new Action('jump', ActionRange.Close, ActionTarget.Empty,
    async (actor, targetFigure, targetCell, battle) => {
        const { canvas } = battle

        await canvas.executeAnimation(() => {
            return jumpFigure(canvas)(actor, 2)
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
