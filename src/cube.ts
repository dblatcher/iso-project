import { IsometricGroup, IsometricRectangle, PlaneView, } from "@elchininet/isometric";

function toggleColor() {
    this.fillColor = this.fillColor === 'white' ? 'skyblue' : 'white';
}
export const buildCubeGroup = (coords: [number, number, number], size = 1) => {
    const [right, left, top] = coords
    const group = new IsometricGroup({ top, right, left, })
    const commonProps = { height: size, width: size };
    const topPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.TOP });
    const rightPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.FRONT });
    const leftPiece = new IsometricRectangle({ ...commonProps, planeView: PlaneView.SIDE });

    topPiece.top = size;
    topPiece.addEventListener('click', toggleColor, true);
    rightPiece.right = size;
    rightPiece.addEventListener('click', toggleColor, true);
    leftPiece.left = size;
    leftPiece.addEventListener('click', toggleColor, true);

    group
        .addChild(topPiece)
        .addChild(rightPiece)
        .addChild(leftPiece);

    return group
}

export const buildCubeGroupWithShadow = (coords: [number, number, number], size = 1) => {
    const [right, left, top] = coords
    const group = buildCubeGroup(coords, size)
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
