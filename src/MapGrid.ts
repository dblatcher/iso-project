import { IsometricCanvas, IsometricCircle, IsometricRectangle, IsometricText, PlaneView } from "@elchininet/isometric"
import { buildCuboid } from "./builders/cuboids"
import { antiClockwise, clockwise, DIRECTION, Direction, rotateVector } from "./direction"
import { FigureSprite } from "./FigureSprite"
import { renderIsometricImage } from "./builders/renderImage"
import { renderIsometricShadow } from "./builders/renderIsometricShadow"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
}

type GridOfCells = Array<Array<MapCell | undefined>>

type CellClickHandler<T> = { (mapGridCanvas: MapGridCanvas): { (cell: MapCell): Promise<T> } }
type FigureClickHandler<T> = { (mapGridCanvas: MapGridCanvas): { (figure: FigureSprite): Promise<T> } }

type MapGridCanvasConfig = {
    renderOrientation?: Direction,
    figures?: FigureSprite[],
}

export class MapGridCanvas {
    cells: GridOfCells
    figures: FigureSprite[]
    renderOrientation: Direction
    canvas: IsometricCanvas
    onClick: {
        cell?: CellClickHandler<any>,
        figure?: FigureClickHandler<any>,
    }
    animationInProgress: boolean

    constructor(canvas: IsometricCanvas, cells: (MapCell | undefined)[][], config: MapGridCanvasConfig) {
        const { figures = [], renderOrientation = DIRECTION.north } = config
        this.canvas = canvas
        this.cells = cells
        this.figures = figures
        this.renderOrientation = renderOrientation
        this.onClick = {}
        this.handleClickOnCell = this.handleClickOnCell.bind(this)
        this.handleClickOnFigure = this.handleClickOnFigure.bind(this)
        this.animationInProgress = false
        this.render(this.renderOrientation);
    }

    private handleClickOnCell(cell: MapCell) {
        if (this.animationInProgress) {
            return
        }
        if (this.onClick.cell) {
            this.onClick.cell(this)(cell);
        }
    }
    private handleClickOnFigure(figure: FigureSprite) {
        if (this.animationInProgress) {
            return
        }
        if (this.onClick.figure) {
            this.onClick.figure(this)(figure);
        }
    }

    heightAt(right: number, left: number): number {
        return this.cells[right]
            ? this.cells[right][left]
                ? this.cells[right][left].height
                : 0
            : 0;
    }

    getCellCoords(cell: MapCell): { x: number, y: number } {
        const { cells: originalGrid } = this
        const rowContaining = originalGrid.find(row => row.some(cellInRow => cellInRow === cell));
        if (!rowContaining) { return { x: -1, y: -1 } }
        return { x: originalGrid.indexOf(rowContaining), y: rowContaining.indexOf(cell) }
    }

    renderBackGrounds(orientation: Direction) {
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

        this.canvas.addChildren(
            sideBackground,
            sideLabel,
            frontBackground,
            frontLabel,
        )
    }

    renderBlock(cell: MapCell, gridX: number, gridY: number) {
        const { group: cuboid, topPiece } = buildCuboid({
            coords: [gridX, gridY, 0],
            size: 1,
            height: cell.height,
            topImage: cell.textureTop,
            sideImage: cell.textureSide,
        })

        topPiece.addEventListener('click', () => {
            this.handleClickOnCell(cell)
        })

        this.canvas.addChild(
            cuboid
        )
    }

    renderFigureSprite(figure: FigureSprite, gridX: number, gridY: number,) {
        const { sprite, facing, x, y, className = 'default', spriteIsoGroup: iso } = figure

        if (iso && this.canvas.children.includes(iso)) {
            this.canvas.removeChild(iso)
        }

        const { image, planeView } = sprite.getView(facing, this.renderOrientation)
        const height = this.heightAt(x, y)
        const newImage = renderIsometricImage({
            url: image,
            planeView,
            classes: ['figure', 'sprite', className],
            coords: [gridX, gridY, height],
        })

        newImage.addEventListener('click', () => {
            this.handleClickOnFigure(figure)
        })

        const newShadow = renderIsometricShadow({
            coords: [gridX, gridY, height],
        })

        this.canvas.addChildren(newShadow, newImage)
        figure.spriteIsoGroup = newImage
        figure.shadowIsoGroup = newShadow
    }

    setSelectedFigure(newlySelectedFigure: FigureSprite) {
        if (!newlySelectedFigure?.spriteIsoGroup || !this.canvas.children.includes(newlySelectedFigure.spriteIsoGroup)) {
            return false
        }
        this.figures.forEach(figure => {
            figure.className = figure === newlySelectedFigure ? 'selected' : undefined
        })
        this.render(this.renderOrientation)
    }

    getSelectedFigure(): FigureSprite | undefined {
        return this.figures.find(figure => figure.className === 'selected') as FigureSprite | undefined
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
                return [...this.cells]
            case 1:
                return this.rotateGrid(this.cells)
            case 2:
                return this.rotateGrid(this.rotateGrid(this.cells))
            case 3:
                return this.rotateGrid(this.rotateGrid(this.rotateGrid(this.cells)))
            default:
                return []
        }
    }

    render(orientation: Direction) {
        this.renderOrientation = { ...orientation }
        this.canvas.clear()
        this.renderBackGrounds(orientation)
        const figures = [...this.figures]
        this.rotateGridBy(orientation).map((row, gridX) => {
            row.map((cell, gridY) => {
                if (!cell) {
                    return
                }
                this.renderBlock(cell, gridX, gridY)
                const { x: realX, y: realY } = this.getCellCoords(cell)
                const figuresHere = figures.filter(figure => figure.x === realX && figure.y == realY)
                figuresHere.forEach(figureHere => {
                    this.renderFigureSprite(figureHere, gridX, gridY)
                    figures.splice(figures.indexOf(figureHere), 1)
                })
            })
        })
        figures.forEach(unrenderedFigure => {
            unrenderedFigure.spriteIsoGroup = undefined
            unrenderedFigure.shadowIsoGroup = undefined
        })
    }

    private async shiftFigure(figure: FigureSprite, xDist: number, yDist: number): Promise<boolean> {
        const { canvas } = this

        const { x: startX, y: startY, spriteIsoGroup, shadowIsoGroup } = figure

        figure.x += xDist
        figure.y += yDist

        if (!spriteIsoGroup || !canvas.children.includes(spriteIsoGroup)) {
            return false
        }

        const { x, y } = rotateVector(xDist, yDist, this.renderOrientation)
        // to do - find the shadow better?
        // should it be a separate property of figure?


        // TO DO - change ordering at each step
        if (shadowIsoGroup) {
            canvas.bringChildToFront(shadowIsoGroup)
        }
        canvas.bringChildToFront(spriteIsoGroup)
        const { top, left, right } = figure.spriteIsoGroup
        const zDist = this.heightAt(figure.x, figure.y) - top

        const hop = (step: number, totalSteps: number, hopHeight: number): number => {
            const d = step / totalSteps
            return ((-2 * d ** 2) + (2 * d)) * hopHeight
        }

        const step = (step: number, totalSteps: number) => {
            const altitude = hop(step, totalSteps, .5 + Math.abs(zDist * 2)) + (step * zDist / totalSteps)
            spriteIsoGroup.right = right + (step * x / totalSteps)
            spriteIsoGroup.left = left + (step * y / totalSteps)
            spriteIsoGroup.top = top + altitude

            if (shadowIsoGroup) {

                shadowIsoGroup.right = right + (step * x / totalSteps)
                shadowIsoGroup.left = left + (step * y / totalSteps)

                const cellX = Math.round(startX + (step * xDist / totalSteps))
                const cellY = Math.round(startY + (step * yDist / totalSteps))
                const floorLevel = this.heightAt(cellX, cellY)
                shadowIsoGroup.top = floorLevel
            }
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

    async rotateSingleFigure(figure: FigureSprite, direction: Direction) {
        if (!figure?.spriteIsoGroup || !this.canvas.children.includes(figure.spriteIsoGroup)) {
            return false
        }
        this.animationInProgress = true
        figure.facing = direction
        this.render(this.renderOrientation)
        this.animationInProgress = false
    }

    async moveSingleFigure(figure: FigureSprite, xDist: number, yDist: number) {
        if (!figure?.spriteIsoGroup || !this.canvas.children.includes(figure.spriteIsoGroup)) {
            return false
        }
        this.animationInProgress = true
        await this.shiftFigure(figure, xDist, yDist)
        this.render(this.renderOrientation)
        this.animationInProgress = false
    }

    async moveAllFigures() {
        this.animationInProgress = true
        await Promise.all(this.figures.map(figure => {
            return this.shiftFigure(figure, 0, -1)
        }))
        this.render(this.renderOrientation)
        this.animationInProgress = false
    }
}