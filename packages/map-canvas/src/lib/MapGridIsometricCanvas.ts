import { IsometricCanvas, type IsometricCanvasProps } from "@elchininet/isometric"
import { buildCuboid } from "./builders/cuboids"
import { DIRECTION, CardinalDirection } from "./CardinalDirection"
import { BaseFigure } from "./BaseFigure"
import { renderIsometricImage } from "./builders/renderImage"
import { renderIsometricShadow } from "./builders/renderIsometricShadow"
import { buildBackgrounds } from "./builders/backgrounds"
import { buildCompass } from "./builders/compass"
import { shiftFigure } from "./animations/shiftFigure"
import { jumpFigure } from "./animations/jump"
import { turnFigure } from "./animations/turn"
import { addClassToCell, MapCell, removeClassFromCell } from "./MapCell"
import { findPositionInRotatedGrid, getGridDimensions, rotateGridByDirection } from "./grids"
import { makeObstacleShape } from "./builders/obstacleShape"
import { BaseObstacle } from "./BaseObstacle"


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
  obstacles: BaseObstacle[]
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
    obstacles: BaseObstacle[],
    config: MapGridCanvasConfig
  ) {
    super(canvasProps)
    const { renderOrientation = DIRECTION.north } = config
    this.cells = cells
    this.figures = figures
    this.obstacles = obstacles
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
      this.onClick.cell(this.castToBase())(cell);
    }
  }
  private handleClickOnFigure(figure: Figure) {
    if (this.animationInProgress) {
      return
    }
    if (this.onClick.figure) {
      this.onClick.figure(this.castToBase())(figure);
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

  addCellClass(cell: MapCell | undefined, className: string) {
    if (!cell) { return }
    if (!this.cells.flat().includes(cell)) {
      return
    }
    addClassToCell(cell, className)
  }
  removeCellClass(cell: MapCell | undefined, className: string) {
    if (!cell) { return }
    if (!this.cells.flat().includes(cell)) {
      return
    }
    removeClassFromCell(cell, className)
  }

  prefixCssClassNames(classNames: string[]): string[] {
    if (!this.config.cssPrefix) { return classNames }
    return classNames.map(className => `${this.config.cssPrefix}${className}`)
  }

  heightAt(x: number, y: number): number {
    return this.cellAt(x, y)?.height || 0
  }

  cellAt(x: number, y: number): MapCell | undefined {
    return this.cells[x]
      ? this.cells[x][y]
        ? this.cells[x][y]
        : undefined
      : undefined;
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
    const { defaultBlockSideColor, defaultBlockTextureTop, defaultBlockTopColor, defaultBlockTextureSide, } = this.config
    const { classes = [], colorSide, colorTop, textureSide, textureTop, height } = cell

    const { group, topPiece } = buildCuboid({
      coords: [gridX, gridY, 0],
      size: 1,
      height: height,
      topImage: (colorTop && !textureTop) ? undefined : textureTop || defaultBlockTextureTop,
      sideImage: (colorSide && !textureSide) ? undefined : textureSide || defaultBlockTextureSide,
      sideColor: colorSide || defaultBlockSideColor,
      topColor: colorTop || defaultBlockTopColor,
      groupClasses: [...this.prefixCssClassNames(['block']), ...classes],
      topClasses: [...this.prefixCssClassNames(['top']), ...classes],
    })

    topPiece.addEventListener('click', () => {
      this.handleClickOnCell(cell)
    })

    this.addChild(
      group
    )

    cell.isoGroup = group
    cell.isoTop = topPiece
  }

  renderFigureSprite(figure: Figure) {
    const { renderOrientation } = this
    const { sprite, facing, x, y, classNames = [], spriteIsoGroup, shadowIsoGroup } = figure
    const [rowCount, columnCount] = getGridDimensions(this.cells)
    const { x: gridX, y: gridY } = findPositionInRotatedGrid(figure, rowCount, columnCount, renderOrientation)

    if (spriteIsoGroup && this.children.includes(spriteIsoGroup)) {
      this.removeChild(spriteIsoGroup)
    }
    if (shadowIsoGroup && this.children.includes(shadowIsoGroup)) {
      this.removeChild(shadowIsoGroup)
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

  renderFakeObstable(obstacle: BaseObstacle) {
    const { x, y } = obstacle
    const g = findPositionInRotatedGrid({ x, y }, ...getGridDimensions(this.cells), this.renderOrientation)
    const block = makeObstacleShape({
      coords: [g.x, g.y, this.heightAt(x, y)],
      obstacle,
      orientation: this.renderOrientation
    })
    this.addChild(block)
  }

  render(orientation = this.renderOrientation) {
    this.renderOrientation = orientation
    this.clear()
    this.renderBackGrounds()
    const figures = [...this.figures]
    const obstacles = [...this.obstacles]
    rotateGridByDirection(this.cells, orientation).map((row, gridX) => {
      row.map((cell, gridY) => {
        if (!cell) {
          return
        }
        this.renderCell(cell, gridX, gridY)
        const { x: realX, y: realY } = this.getCellCoords(cell)
        const figuresHere = figures.filter(figure => figure.x === realX && figure.y == realY)
        figuresHere.forEach(figureHere => {
          this.renderFigureSprite(figureHere)
          figures.splice(figures.indexOf(figureHere), 1)
        })

        const obstaclesHere = obstacles.filter(obstacle => obstacle.x === realX && obstacle.y == realY)
        obstaclesHere.forEach(obstacleHere => {
          this.renderFakeObstable(obstacleHere)
          obstacles.splice(obstacles.indexOf(obstacleHere), 1)
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

  executeAnimation = async <T>(animationFunction: { (): Promise<T> }): Promise<T> => {
    const that = (this as unknown as MapGridIsometricCanvas);
    if (that.animationInProgress) {
      throw new Error('Animation already in progress.')
    }
    that.animationInProgress = true
    const result = await animationFunction()
    that.render(that.renderOrientation)
    that.animationInProgress = false
    return result
  }

  async turnSingleFigure(figure: Figure, direction: CardinalDirection) {
    return this.executeAnimation(() => turnFigure(this.castToBase())(figure, direction))
  }

  async bounceSingleFigure(figure: Figure, height: number) {
    return this.executeAnimation(() => jumpFigure(this.castToBase())(figure, height))
  }

  async moveSingleFigure(figure: Figure, xDist: number, yDist: number) {
    return this.executeAnimation(() => shiftFigure(this.castToBase())(figure, xDist, yDist))
  }

  castToBase(): MapGridIsometricCanvas<BaseFigure> {
    return this as unknown as MapGridIsometricCanvas<BaseFigure>
  }
}
