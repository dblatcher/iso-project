import { BaseFigure } from "../BaseFigure";
import { MapCell } from "../MapCell";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";
import { shiftFigure } from "./shiftFigure";

export const followPath = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, path: MapCell[]): Promise<boolean> => {
        const routeCoords = path.map(cell => that.getCellCoords(cell))
        while (routeCoords.length > 0) {
            const nextCoords = routeCoords.shift()
            const { x, y } = figure
            await shiftFigure(that)(figure, nextCoords.x - x, nextCoords.y - y)
        }
        return true
    }
