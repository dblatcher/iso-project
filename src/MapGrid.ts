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
                const figuresHere = figures.filter(figure => figure.x === gridX && figure.y == gridY)
                figuresHere.forEach(figureHere => {
                    const { image, planeView, x, y } = figureHere
                    const iso = makeSprite(image, planeView, this.surfaceCoord(x, y), 1, 1)
                    canvas.addChild(iso)
                    figureHere.iso = iso
                    figures.splice(figures.indexOf(figureHere), 1)
                })
            })
        })
        figures.forEach(unrenderedFigure => unrenderedFigure.iso = undefined)
    }

    async shiftFigure(canvas: IsometricCanvas, figureIndex: number, xDist: number, yDist: number): Promise<boolean> {
        const figure = this.figures[figureIndex]

        if (!figure) {
            return false
        }

        figure.x += xDist
        figure.y += yDist
        if (!figure.iso) {
            return false
        }

        // TO DO - change ordering at each step
        canvas.bringChildToFront(figure.iso)
        const oldZ = figure.iso.top
        const zDist = this.surfaceCoord(figure.x, figure.y)[2] - oldZ
        const step = (totalSteps: number) => {
            figure.iso.right = figure.iso.right + xDist / totalSteps
            figure.iso.left = figure.iso.left + yDist / totalSteps
            figure.iso.top = figure.iso.top + zDist / totalSteps // to do - parabella hopping function
        }

        const pause = async (t: number) => await new Promise(resolve => {
            setTimeout(resolve, t)
        })

        const totalSteps = 10

        for (let i = 0; i++, i < totalSteps;) {
            await step(totalSteps)
            await pause(100)
        }

        return true
    }


    async move(canvas: IsometricCanvas, figureIndex: number, xDist: number, yDist: number) {
        const wasAfigure = await this.shiftFigure(canvas, figureIndex, xDist, yDist)
        console.log({ wasAfigure })
        this.render(canvas)
    }
}