import { BaseFigure } from "../BaseFigure";
import { rotateVector } from "../CardinalDirection";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { hop, repeatStep } from "./util";

export const shiftFigure = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, xDist: number, yDist: number, hopMultiplier = 1): Promise<boolean> => {
        const { x: startX, y: startY, spriteIsoGroup, shadowIsoGroup } = figure

        if (!that.figures.includes(figure)) {
            return false
        }

        figure.x += xDist
        figure.y += yDist

        if (!spriteIsoGroup || !that.children.includes(spriteIsoGroup)) {
            return false
        }

        const { x, y } = rotateVector(xDist, yDist, that.renderOrientation)

        // TO DO - change ordering at each step
        if (shadowIsoGroup) {
            that.bringChildToFront(shadowIsoGroup)
        }
        that.bringChildToFront(spriteIsoGroup)
        const { top, left, right } = figure.spriteIsoGroup
        const zDist = that.heightAt(figure.x, figure.y) - top

        const step = (step: number, totalSteps: number) => {
            const altitude = hop(
                step,
                totalSteps,
                (.5 + Math.abs(zDist) * 2) * hopMultiplier
            ) + (step * zDist / totalSteps)
            spriteIsoGroup.right = right + (step * x / totalSteps)
            spriteIsoGroup.left = left + (step * y / totalSteps)
            spriteIsoGroup.top = top + altitude

            if (shadowIsoGroup) {
                shadowIsoGroup.right = right + (step * x / totalSteps)
                shadowIsoGroup.left = left + (step * y / totalSteps)
                const cellX = Math.round(startX + (step * xDist / totalSteps))
                const cellY = Math.round(startY + (step * yDist / totalSteps))
                const floorLevel = that.heightAt(cellX, cellY)
                shadowIsoGroup.top = floorLevel
            }
        }

        await repeatStep(step, 100)
        return true
    }