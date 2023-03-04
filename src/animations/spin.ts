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
            that.renderFigureSprite(figure) 
        }

        await repeatStep(step, timesRound * 4, delay)
        return true
    }
