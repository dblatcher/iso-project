import { IsometricCanvas, IsometricGroup, PlaneView } from "@elchininet/isometric"
import { buildCuboid } from "./cuboids"
import { makeSprite } from "./flatSprite"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
}

export interface FigureSprite {
    x: number,
    y: number,
    planeView: PlaneView,
    image: string,
}

export class MapGrid {
    data: Array<Array<MapCell | undefined>>
    figures: FigureSprite[]

    constructor(data: (MapCell | undefined)[][], figures: FigureSprite[] = []) {
        this.data = data
        this.figures = figures
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

        const figures = [...this.figures]

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
                const figureHere = figures.find(figure => figure.x === rowIndex && figure.y == cellIndex)
                if (figureHere) {
                    canvas.addChild(makeSprite(figureHere.image, figureHere.planeView, this.surfaceCoord(figureHere.x, figureHere.y), 1, 1))
                    figures.splice(figures.indexOf(figureHere), 1)
                }
            })
        })
    }
}