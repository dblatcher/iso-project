import { BaseObstacle } from "../BaseObstacle";
import { DIRECTION } from "../CardinalDirection";

export const pyramid = (x: number, y: number, height: number, fillColor: string): BaseObstacle => {

    return {
        x, y, facing: DIRECTION.north,
        fillColor,
        paths: [
            {
                points: [
                    { x: 0, y: 0, z: 0 },
                    { x: 0.5, y: 0.5, z: height },
                    { x: 0, y: 1, z: 0 },
                ]
            },
            {
                points: [
                    { x: 0, y: 1, z: 0 },
                    { x: 0.5, y: 0.5, z: height },
                    { x: 1, y: 1, z: 0 },
                ]
            },
            {
                points: [
                    { x: 1, y: 1, z: 0 },
                    { x: 0.5, y: 0.5, z: height },
                    { x: 1, y: 0, z: 0 },
                ]
            },
            {
                points: [
                    { x: 1, y: 0, z: 0 },
                    { x: 0.5, y: 0.5, z: height },
                    { x: 0, y: 0, z: 0 },
                ]
            },
        ]
    }

}