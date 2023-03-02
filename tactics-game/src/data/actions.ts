import { jumpFigure } from "../../../src/animations/jump";
import { spinFigure } from "../../../src/animations/spin";
import { Action, ActionRange } from "../Action";

const wait = new Action('wait', ActionRange.Self, async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle

    await canvas.executeAnimation(() => {
        return spinFigure(canvas)(actor, 2, 100)
    })
})

const jump = new Action('jump', ActionRange.Close, async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle

    await canvas.executeAnimation(() => {
        return jumpFigure(canvas)(actor, 2)
    })
})

const throwInAir = new Action('throw', ActionRange.Close, async (actor, targetFigure, targetCell, battle) => {
    const { canvas } = battle
    if (!targetFigure) {
        return
    }
    await canvas.executeAnimation(() => {
        return jumpFigure(canvas)(targetFigure, 3)
    })
})

export const ACTIONS = { wait, jump, throwInAir }
