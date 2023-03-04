import { BaseFigure } from "../BaseFigure";
import { CardinalDirection } from "../CardinalDirection";
import { MapGridIsometricCanvas } from "../MapGridIsometricCanvas";

export const turnFigure = (that: MapGridIsometricCanvas) =>
    async (figure: BaseFigure, direction: CardinalDirection): Promise<boolean> => {

        if (!that.figures.includes(figure)) {
            return false
        }

        figure.facing = direction
        that.renderFigureSprite(figure) 
        return true
    }
