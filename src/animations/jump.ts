import { BaseFigure } from "../BaseFigure";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { hop, repeatStep } from "./util";

export const jumpFigure = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, height: number): Promise<boolean> => {
        const { spriteIsoGroup } = figure

        if (!that.figures.includes(figure)) {
            return false
        }

        const { top } = figure.spriteIsoGroup

        const step = (step: number, totalSteps: number) => {
            const altitude = hop(step, totalSteps, height)
            spriteIsoGroup.top = top + altitude
        }

        await repeatStep(step, 100)
        return true
    }
