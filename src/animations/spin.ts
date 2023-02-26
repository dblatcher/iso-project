import { BaseFigure } from "../BaseFigure";
import { antiClockwise, clockwise } from "../CardinalDirection";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { repeatStep } from "./util";

export const spinFigure = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, timesRound: number, delay: number, goAntiClockwise = false): Promise<boolean> => {
        const { spriteIsoGroup } = figure

        if (!that.figures.includes(figure)) {
            return false
        }

        if (!spriteIsoGroup) {
            return false
        }

        const step = (step: number, totalSteps: number) => {
            figure.facing = goAntiClockwise ? antiClockwise(figure.facing) : clockwise(figure.facing)
            that.render() // NOT GOOD TO USE THE RENDER FUNCTION HERE. SHOULD JUST BE UPDATING THE SPRITE SOMEHOW
        }

        await repeatStep(step, timesRound * 4, delay)
        return true
    }
