import { IsometricCanvas, IsometricGroup } from "@elchininet/isometric"
import { buildCuboid } from "./cuboids"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
}


export class MapGrid {
    data: Array<Array<MapCell | undefined>>
    groups?: IsometricGroup[][]

    constructor(data: (MapCell | undefined)[][]) {
        this.data = data
    }

    surfaceCoord(right: number, left: number): [number, number, number] {
        const heightAt = this.data[right]
            ? this.data[right][left]
                ? this.data[right][left].height
                : 0
            : 0;

        return [right, left, heightAt]
    }


    render(canvas: IsometricCanvas) {
        this.data.map((row, rowIndex) => {
            row.map((cell, cellIndex) => {
                if (!cell) {
                    return
                }
                canvas.addChild(
                    buildCuboid({
                        coords: [rowIndex, cellIndex, 0],
                        size: 1,
                        height: cell.height,
                        topImage: cell.textureTop,
                        sideImage: cell.textureSide,
                    })
                )
            })
        })
    }
}