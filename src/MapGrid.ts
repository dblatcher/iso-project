import { IsometricCanvas, IsometricRectangle, IsometricText, PlaneView } from "@elchininet/isometric"
import { buildCuboid } from "./cuboids"
import { antiClockwise, DIRECTION, Direction, rotateVector } from "./direction"
import { FigureSprite, renderFigure } from "./figures"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
}

type GridOfCells = Array<Array<MapCell | undefined>>


export class MapGrid {
    data: GridOfCells
    figures: FigureSprite[]
    renderOrientation: Direction

    constructor(data: (MapCell | undefined)[][], figures: FigureSprite[] = []) {
        this.data = data
        this.figures = figures
        this.renderOrientation = DIRECTION.north
        this.handleClickOnCell = this.handleClickOnCell.bind(this)
    }

    heightAt(right: number, left: number): number {
        return this.data[right]
            ? this.data[right][left]
                ? this.data[right][left].height
                : 0
            : 0;
    }

    getCellCoords(cell: MapCell): { x: number, y: number } {
        const { data: originalGrid } = this
        const rowContaining = originalGrid.find(row => row.some(cellInRow => cellInRow === cell));
        if (!rowContaining) { return { x: -1, y: -1 } }
        return { x: originalGrid.indexOf(rowContaining), y: rowContaining.indexOf(cell) }
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

    handleClickOnCell(cell: MapCell, canvas: IsometricCanvas) {
        const coords = this.getCellCoords(cell)
        const [figure] = this.figures
        this.moveSingleFigure(canvas, 0, coords.x - figure.x, coords.y - figure.y)
    }

    renderBlock(cell: MapCell, gridX: number, gridY: number, canvas: IsometricCanvas,) {
        const cuboid = buildCuboid({
            coords: [gridX, gridY, 0],
            size: 1,
            height: cell.height,
            topImage: cell.textureTop,
            sideImage: cell.textureSide,
        })

        cuboid.addEventListener('click', () => {
            this.handleClickOnCell(cell, canvas)
        })

        canvas.addChild(
            cuboid
        )
    }

    rotateGrid(grid: GridOfCells): GridOfCells {
        const maxColLength = grid.reduce<number>((previous, currentCol) => { return Math.max(previous, currentCol.length) }, 0)
        const newGrid: GridOfCells = []
        let colToRotate = maxColLength
        while (colToRotate >= 0) {
            newGrid.push(grid.map(row => row[colToRotate]))
            colToRotate--
        }
        return newGrid
    }
    rotateGridBy(orientation: Direction): GridOfCells {
        switch (orientation.orientation) {
            case 0:
                return [...this.data]
            case 1:
                return this.rotateGrid(this.data)
            case 2:
                return this.rotateGrid(this.rotateGrid(this.data))
            case 3:
                return this.rotateGrid(this.rotateGrid(this.rotateGrid(this.data)))
            default:
                return []
        }
    }

    render(canvas: IsometricCanvas, orientation: Direction) {
        this.renderOrientation = { ...orientation }
        canvas.clear()
        this.renderBackGrounds(canvas, orientation)
        const figures = [...this.figures]
        this.rotateGridBy(orientation).map((row, gridX) => {
            row.map((cell, gridY) => {
                if (!cell) {
                    return
                }
                this.renderBlock(cell, gridX, gridY, canvas)
                const { x: realX, y: realY } = this.getCellCoords(cell)
                const figuresHere = figures.filter(figure => figure.x === realX && figure.y == realY)
                figuresHere.forEach(figureHere => {
                    const { sprite, facing, x, y } = figureHere
                    const { image, planeView } = sprite.getView(facing, orientation)
                    const height = this.heightAt(x, y)
                    const iso = renderFigure(image, planeView, [gridX, gridY, height], 1, 1)
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

        const { x, y } = rotateVector(xDist, yDist, this.renderOrientation)

        // TO DO - change ordering at each step
        canvas.bringChildToFront(figure.iso)
        const { top, left, right } = figure.iso
        const zDist = this.heightAt(figure.x, figure.y) - top

        const hop = (step: number, totalSteps: number): number => {
            const x = step / totalSteps
            return (-2 * x ** 2) + (2 * x)
        }

        const step = (step: number, totalSteps: number) => {
            figure.iso.right = right + (step * x / totalSteps)
            figure.iso.left = left + (step * y / totalSteps)
            figure.iso.top = top + hop(step, totalSteps) + (step * zDist / totalSteps)
        }

        const pause = async (t: number) => await new Promise(resolve => {
            setTimeout(resolve, t)
        })

        const totalSteps = 100

        for (let i = 0; i++, i < totalSteps;) {
            await step(i, totalSteps)
            await pause(5)
        }

        return true
    }


    async moveSingleFigure(canvas: IsometricCanvas, figureIndex: number, xDist: number, yDist: number) {
        const wasAfigure = await this.shiftFigure(canvas, figureIndex, xDist, yDist)
        console.log({ wasAfigure })
        this.render(canvas, this.renderOrientation)
    }
}