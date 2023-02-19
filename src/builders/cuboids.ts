import { IsometricGraphicProps, IsometricGroup, IsometricRectangle, PlaneView, } from "@elchininet/isometric";

export const makeSideTexture = (imageUrl: string, planeView: PlaneView): IsometricGraphicProps['texture'] => {
    return {
        height: 5,
        width: 5,
        pixelated: true,
        url: imageUrl,
        planeView,
    }
}

export type CuboidConfig = {
    coords: [number, number, number];
    size?: number
    height?: number
    sideImage?: string
    topImage?: string
    sideColor?: string
    topColor?: string
}

export const buildCuboid = (config: CuboidConfig) => {
    const { coords, size = 1, height = size, sideImage, topImage } = config
    const [right, left, top] = coords
    const group = new IsometricGroup({ top, right, left, })

    const topPiece = new IsometricRectangle({
        height: size, width: size, planeView: PlaneView.TOP,
        texture: topImage ? makeSideTexture(topImage, PlaneView.TOP) : undefined,
        fillColor: config.topColor || 'white',
    });
    const rightPiece = new IsometricRectangle({
        height: height, width: size, planeView: PlaneView.FRONT,
        texture: sideImage ? makeSideTexture(sideImage, PlaneView.FRONT) : undefined,
        fillColor: config.sideColor || 'white',
    });
    const leftPiece = new IsometricRectangle({
        height: height, width: size, planeView: PlaneView.SIDE,
        texture: sideImage ? makeSideTexture(sideImage, PlaneView.SIDE) : undefined,
        fillColor: config.sideColor || 'white',
    });

    topPiece.top = height;
    rightPiece.right = size;
    leftPiece.left = size;

    topPiece.getElement().classList.add('block', 'top')

    group
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece);

    return { group, topPiece }
}

export const buildCuboidWithShadow = (config: CuboidConfig) => {
    const { coords, size = 1, } = config
    const [right, left, top] = coords
    const { group } = buildCuboid(config)

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

    return { group }
}
