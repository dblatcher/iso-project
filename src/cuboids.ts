import { IsometricGroup, IsometricRectangle, PlaneView, } from "@elchininet/isometric";
import { makeSideTexture } from "./images";

export type CuboidConfig = {
    coords: [number, number, number];
    size?: number
    height?: number
    sideImage?: string
    topImage?: string
}

export const buildCuboid = (config: CuboidConfig) => {
    const { coords, size = 1, height = size, sideImage, topImage } = config
    const [right, left, top] = coords
    const group = new IsometricGroup({ top, right, left, })

    const topPiece = new IsometricRectangle({
        height: size, width: size, planeView: PlaneView.TOP,
        texture: topImage ? makeSideTexture(topImage, PlaneView.TOP) : undefined
    });
    const rightPiece = new IsometricRectangle({
        height: height, width: size, planeView: PlaneView.FRONT,
        texture: sideImage ? makeSideTexture(sideImage, PlaneView.FRONT) : undefined
    });
    const leftPiece = new IsometricRectangle({
        height: height, width: size, planeView: PlaneView.SIDE,
        texture: sideImage ? makeSideTexture(sideImage, PlaneView.SIDE) : undefined
    });

    topPiece.top = height;
    rightPiece.right = size;
    leftPiece.left = size;


    group
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece);

    return group
}

export const buildCuboidWithShadow = (config: CuboidConfig) => {
    const { coords, size = 1, } = config
    const [right, left, top] = coords
    const group = buildCuboid(config)

    const shadowSize = size * (1 + (top / 5))
    const shadow = new IsometricRectangle({
        height: shadowSize,
        width: shadowSize,
        planeView: PlaneView.TOP,
        top: -top,
    })
    shadow.left = shadow.left - (shadowSize - size) / 2
    shadow.right = shadow.right - (shadowSize - size) / 2

    shadow.fillColor = 'rgba(0,0,0,.75)'
    shadow.strokeOpacity = 0
    shadow.getElement().style.filter = `blur(${Math.ceil(top * 1.5)}px)`

    group.addChild(shadow)
    group.sendChildToBack(shadow)

    return group
}
