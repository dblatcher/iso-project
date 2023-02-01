import { IsometricGroup, IsometricRectangle, PlaneView } from "@elchininet/isometric";

function toggleColor() {
    this.fillColor = this.fillColor === 'white' ? 'skyblue' : 'white';
}
export const buildCubeGroup = (right: number, left: number, top: number, size = 1) => {

    const group = new IsometricGroup({ top, right, left })

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