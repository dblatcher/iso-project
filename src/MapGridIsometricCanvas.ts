import { IsometricCanvas, type IsometricCanvasProps } from "@elchininet/isometric"
import { buildCuboid } from "./builders/cuboids"
import { DIRECTION, CardinalDirection, clockwise, antiClockwise } from "./CardinalDirection"
import { BaseFigure } from "./BaseFigure"
import { renderIsometricImage } from "./builders/renderImage"
import { renderIsometricShadow } from "./builders/renderIsometricShadow"
import { buildBackgrounds } from "./builders/backgrounds"
import { buildCompass } from "./builders/compass"
import { shiftFigure } from "./animations/shiftFigure"
import { jumpFigure } from "./animations/jump"
import { turnFigure } from "./animations/turn"
import { pause } from "./animations/util"
import { spinFigure } from "./animations/spin"


export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
    colorTop?: string,
    colorSide?: string,
}

type GridOfCells = Array<Array<MapCell | undefined>>

export type CellClickHandler<T> = { (mapGridCanvas: MapGridIsometricCanvas): { (cell: MapCell): Promise<T> } }
export type FigureClickHandler<T, Figure extends BaseFigure> = { (mapGridCanvas: MapGridIsometricCanvas): { (figure: Figure): Promise<T> } }

export type MapGridCanvasConfig = {
    renderOrientation?: CardinalDirection;
    defaultBlockSideColor?: string;
    defaultBlockTopColor?: string;
    defaultBlockTextureTop?: string;
    defaultBlockTextureSide?: string;
    backdropImage?: {
        north?: string
        east?: string
        south?: string
        west?: string
        floor?: string
    };
    renderCompass?: boolean
    cssPrefix?: string
    frameChangeInterval?: number
    startWithoutAnimatedFrames?: boolean
}

export class MapGridIsometricCanvas<Figure extends BaseFigure = BaseFigure> extends IsometricCanvas {
    cells: GridOfCells
    figures: Figure[]
    renderOrientation: CardinalDirection
    private config: MapGridCanvasConfig
    private frameTimer: number | undefined

    onClick: {
        cell?: CellClickHandler<any>,
        figure?: FigureClickHandler<any, Figure>,
    }
    animationInProgress: boolean

    constructor(
        canvasProps: IsometricCanvasProps,
        cells: GridOfCells,
        figures: Figure[],
        config: MapGridCanvasConfig
    ) {
        super(canvasProps)
        const { renderOrientation = DIRECTION.north } = config
        this.cells = cells
        this.figures = figures
        this.renderOrientation = renderOrientation
        this.onClick = {}
        this.handleClickOnCell = this.handleClickOnCell.bind(this)
        this.handleClickOnFigure = this.handleClickOnFigure.bind(this)
        this.animationInProgress = false
        this.config = config
        this.render(this.renderOrientation);
        if (!this.config.startWithoutAnimatedFrames) {
            this.frameTimer = window.setInterval(this.changeSpriteFrames.bind(this), this.config.frameChangeInterval || 200)
        }
    }

    private handleClickOnCell(cell: MapCell) {
        if (this.animationInProgress) {
            return
        }
        if (this.onClick.cell) {
            this.onClick.cell(this)(cell);
        }
    }
    private handleClickOnFigure(figure: Figure) {
        if (this.animationInProgress) {
            return
        }
        if (this.onClick.figure) {
            this.onClick.figure(this)(figure);
        }
    }

    stopFrameAnimation() {
        if (typeof this.frameTimer === 'undefined') {
            return
        }
        window.clearInterval(this.frameTimer)
        this.frameTimer = undefined
    }

    startFrameAnimation(delay = this.config.frameChangeInterval) {
        this.stopFrameAnimation()
        this.frameTimer = window.setInterval(this.changeSpriteFrames.bind(this), delay)
    }

    private changeSpriteFrames() {
        this.figures.forEach(figure => {
            const { sprite, facing, frameIndex: currentFrameIndex = 0 } = figure
            const { images } = sprite.getView(facing, this.renderOrientation)
            if (images.length === 1) {
                return
            }
            figure.frameIndex = currentFrameIndex + 1 >= images.length ? 0 : currentFrameIndex + 1
            if (figure.frameRectangles) {
                figure.frameRectangles.forEach((frame, index) => {
                    frame.getElement().style.display = index === figure.frameIndex ? 'block' : 'none';
                })
            }
        })
    }

    prefixCssClassNames(classNames: string[]): string[] {
        if (!this.config.cssPrefix) { return classNames }
        return classNames.map(className => `${this.config.cssPrefix}${className}`)
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

    renderBackGrounds() {
        const { backdropImage = {} } = this.config
        let backdropSide: string | undefined;
        let backdropFront: string | undefined;

        switch (this.renderOrientation.rotation) {
            case (DIRECTION.north.rotation):
                backdropSide = backdropImage.north
                backdropFront = backdropImage.west
                break;
            case (DIRECTION.west.rotation):
                backdropSide = backdropImage.west
                backdropFront = backdropImage.south
                break;
            case (DIRECTION.south.rotation):
                backdropSide = backdropImage.south
                backdropFront = backdropImage.east
                break;
            case (DIRECTION.east.rotation):
                backdropSide = backdropImage.east
                backdropFront = backdropImage.north
                break;
        }

        const { sideBackground, frontBackground, floor, } = buildBackgrounds({
            backdropSide,
            backdropFront,
            backdropFloor: backdropImage.floor,
            floorRotation: 90 * this.renderOrientation.rotation,
        })

        this.addChildren(
            floor,
            sideBackground,
            frontBackground,
        )
    }

    renderCell(cell: MapCell, gridX: number, gridY: number) {
        const { defaultBlockSideColor, defaultBlockTextureTop, defaultBlockTopColor, defaultBlockTextureSide } = this.config

        const { group: cuboid, topPiece } = buildCuboid({
            coords: [gridX, gridY, 0],
            size: 1,
            height: cell.height,
            topImage: (cell.colorTop && !cell.textureTop) ? undefined : cell.textureTop || defaultBlockTextureTop,
            sideImage: (cell.colorSide && !cell.textureSide) ? undefined : cell.textureSide || defaultBlockTextureSide,
            sideColor: cell.colorSide || defaultBlockSideColor,
            topColor: cell.colorTop || defaultBlockTopColor,
            groupClasses: this.prefixCssClassNames(['block']),
            topClasses: this.prefixCssClassNames(['top']),
        })

        topPiece.addEventListener('click', () => {
            this.handleClickOnCell(cell)
        })

        this.addChild(
            cuboid
        )
    }

    renderFigureSprite(figure: Figure, gridX: number, gridY: number,) {
        const { sprite, facing, x, y, classNames = [], spriteIsoGroup: iso, frameIndex = 0 } = figure
        if (iso && this.children.includes(iso)) {
            this.removeChild(iso)
        }

        const { images, planeView } = sprite.getView(facing, this.renderOrientation)
        const groundLevel = this.heightAt(x, y)
        const { group: newImage, frameRectangles } = renderIsometricImage({
            imageUrls: images,
            planeView,
            height: sprite.height,
            classes: [...this.prefixCssClassNames(['figure']), ...classNames],
            coords: [gridX, gridY, groundLevel],
        })

        newImage.addEventListener('click', () => {
            this.handleClickOnFigure(figure)
        })

        const newShadow = renderIsometricShadow({
            coords: [gridX, gridY, groundLevel],
            classes: [...this.prefixCssClassNames(['shadow']), ...classNames],
        })

        this.addChildren(newShadow, newImage)
        figure.spriteIsoGroup = newImage
        figure.shadowIsoGroup = newShadow
        figure.frameRectangles = frameRectangles
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
    rotateGridBy(orientation: CardinalDirection): GridOfCells {
        switch (orientation.rotation) {
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

    render(orientation = this.renderOrientation) {
        this.renderOrientation = orientation
        this.clear()
        this.renderBackGrounds()
        const figures = [...this.figures]
        this.rotateGridBy(orientation).map((row, gridX) => {
            row.map((cell, gridY) => {
                if (!cell) {
                    return
                }
                this.renderCell(cell, gridX, gridY)
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
            unrenderedFigure.frameRectangles = undefined
        })

        if (this.config.renderCompass) {
            const { group: compass } = buildCompass(this.renderOrientation)
            compass.top = 10
            compass.left = 0
            compass.right = 10
            this.addChild(compass)
        }
    }

    executeAnimation = async function <T>(animationFunction: { (): Promise<T> }): Promise<T> {
        if (this.animationInProgress) {
            throw new Error('Animation already in progress.')
        }
        this.animationInProgress = true
        const result = await animationFunction()
        this.render(this.renderOrientation)
        this.animationInProgress = false
        return result
    }

    async turnSingleFigure(figure: Figure, direction: CardinalDirection) {
        return this.executeAnimation(() => turnFigure(this)(figure, direction))
    }

    async bounceSingleFigure(figure: Figure, height: number) {
        return this.executeAnimation(() => jumpFigure(this)(figure, height))
    }

    async moveSingleFigure(figure: Figure, xDist: number, yDist: number) {
        return this.executeAnimation(() => shiftFigure(this)(figure, xDist, yDist))
    }
}