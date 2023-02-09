import { IsometricCanvas, IsometricRectangle, IsometricText, PlaneView } from "@elchininet/isometric"
import { buildCuboid } from "./cuboids"
import { antiClockwise, DIRECTION, Direction } from "./direction"
import { FigureSprite, renderFigure } from "./figures"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
}



export class MapGrid {
    data: Array<Array<MapCell | undefined>>
    figures: FigureSprite[]
    renderOrientation: Direction

    constructor(data: (MapCell | undefined)[][], figures: FigureSprite[] = []) {
        this.data = data
        this.figures = figures
        this.renderOrientation = DIRECTION.north
    }

    surfaceCoord(right: number, left: number): [number, number, number] {
        const heightAt = this.data[right]
            ? this.data[right][left]
                ? this.data[right][left].height
                : 0
            : 0;
        return [right, left, heightAt]
    }

    renderBackGrounds(canvas: IsometricCanvas, orientation: Direction) {



        const backgroundProps = {
            left: 0,
            right: 0,
            top: 0,
            width: 100,
            height: 100,
            fillColor: 'blue',
        }
        const labelProps = {
            top: 4,
            fontSize: 100,
        }

        const sideBackground = new IsometricRectangle({
            planeView: PlaneView.SIDE,
            ...backgroundProps,
        })
        const sideLabel = new IsometricText({
            planeView: PlaneView.SIDE,
            text: orientation.label[0],
            right: 4,
            ...labelProps,
        })
        const frontBackground = new IsometricRectangle({
            planeView: PlaneView.FRONT,
            ...backgroundProps,
        })
        const frontLabel = new IsometricText({
            planeView: PlaneView.FRONT,
            text: antiClockwise(orientation).label[0],
            left: 4,
            ...labelProps,
        })

        canvas.addChildren(
            sideBackground,
            sideLabel,
            frontBackground,
            frontLabel,
        )
    }

    render(canvas: IsometricCanvas, orientation: Direction) {
        this.renderOrientation = orientation
        canvas.clear()
        this.renderBackGrounds(canvas, orientation)

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
                    const { sprite, facing, x, y } = figureHere
                    const { image, planeView } = sprite.getView(facing, orientation)
                    const iso = renderFigure(image, planeView, this.surfaceCoord(x, y), 1, 1)
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
        this.render(canvas, this.renderOrientation)
    }
}