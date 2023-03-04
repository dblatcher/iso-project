import { BaseFigure } from "../BaseFigure";
import { getDirectionTowards } from "../CardinalDirection";
import { MapCell } from "../MapCell";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { shiftFigure } from "./shiftFigure";
import { turnFigure } from "./turn";

export const followPath = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, path: MapCell[], keepDirection = false): Promise<boolean> => {
        const routeCoords = path.map(cell => that.getCellCoords(cell))
        while (routeCoords.length > 0) {
            const nextCoords = routeCoords.shift()
            const { x, y } = figure

            if (!keepDirection) {
                const direction = getDirectionTowards(figure, nextCoords)
                await turnFigure(that)(figure,direction)
            }

            await shiftFigure(that)(figure, nextCoords.x - x, nextCoords.y - y)
        }
        return true
    }
