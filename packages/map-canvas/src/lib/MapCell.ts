import { IsometricGroup, IsometricRectangle } from "@elchininet/isometric";

export interface MapCell {
    height: number,
    textureTop?: string,
    textureSide?: string,
    colorTop?: string,
    colorSide?: string,
    classes?: string[],
    isoGroup?: IsometricGroup,
    isoTop?: IsometricRectangle,
}

export const addClassToCell = (cell: MapCell, className: string) => {
    if (!cell.classes) {
        cell.classes = []
    }
    if (!cell.classes.includes(className)) {
        cell.classes.push(className)
    }
    if (cell.isoGroup) {
        cell.isoGroup.getElement().classList.add(className)
    }
    if (cell.isoTop) {
        cell.isoTop.getElement().classList.add(className)
    }
}

export const removeClassFromCell = (cell: MapCell, className: string) => {
    if (!cell.classes) {
        cell.classes = []
    }
    if (cell.classes.includes(className)) {
        cell.classes.splice(cell.classes.indexOf(className), 1)
    }
    if (cell.isoGroup) {
        cell.isoGroup.getElement().classList.remove(className)
    }
    if (cell.isoTop) {
        cell.isoTop.getElement().classList.remove(className)
    }
}
