import { BaseFigure } from "../BaseFigure";
import { rotateVector } from "../CardinalDirection";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { repeatStep } from "./util";

export const slideFigure = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, dist: { x: number, y: number }, steps: number): Promise<boolean> => {
        const { x: startX, y: startY, spriteIsoGroup, shadowIsoGroup } = figure

        if (!that.figures.includes(figure)) {
            return false
        }

        if (!spriteIsoGroup || !that.children.includes(spriteIsoGroup)) {
            return false
        }

        const { x, y } = rotateVector(dist.x, dist.y, that.renderOrientation)

        // TO DO - change ordering at each step
        if (shadowIsoGroup) {
            that.bringChildToFront(shadowIsoGroup)
        }
        that.bringChildToFront(spriteIsoGroup)
        const { left, right } = figure.spriteIsoGroup


        const step = (step: number, totalSteps: number) => {

            spriteIsoGroup.right = right + (step * x / totalSteps)
            spriteIsoGroup.left = left + (step * y / totalSteps)

            if (shadowIsoGroup) {
                shadowIsoGroup.right = right + (step * x / totalSteps)
                shadowIsoGroup.left = left + (step * y / totalSteps)
                const cellX = Math.round(startX + (step * dist.x / totalSteps))
                const cellY = Math.round(startY + (step * dist.y / totalSteps))
                const floorLevel = that.heightAt(cellX, cellY)
                shadowIsoGroup.top = floorLevel
            }
        }

        await repeatStep(step, steps, 1)
        return true
    }