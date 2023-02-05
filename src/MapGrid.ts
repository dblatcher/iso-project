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
    iso?: IsometricGroup,
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
        canvas.clear()
        const figures = [...this.figures]
        this.data.map((row, gridX) => {
            row.map((cell, gridY) => {
                if (!cell) {
                    return
                }
                canvas.addChild(
                    buildCuboid({
                        coords: [gridX, gridY, 0],
                        size: 1,
                        height: cell.height,
                        topImage: cell.textureTop,
                        sideImage: cell.textureSide,
                    })
                )
                const figureHere = figures.find(figure => figure.x === gridX && figure.y == gridY)
                if (figureHere) {
                    const { image, planeView, x, y } = figureHere
                    const iso = makeSprite(image, planeView, this.surfaceCoord(x, y), 1, 1)
                    canvas.addChild(iso)
                    figureHere.iso = iso
                    figures.splice(figures.indexOf(figureHere), 1)
                }
            })
        })
    }

    move(canvas: IsometricCanvas, figureIndex:number, xDist: number, yDist: number) {
        const figure = this.figures[figureIndex]

        if (!figure) {
            return
        }

        figure.x += xDist
        figure.y += yDist

        this.render(canvas)
    }
}