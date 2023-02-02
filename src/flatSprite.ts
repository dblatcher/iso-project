import { IsometricPath, IsometricRectangle, PlaneView, IsometricGroup } from '@elchininet/isometric'

export const makeSprite = (url: string, planeView: PlaneView, right: number, left: number, top: number, width = 1, height = 1) => {

    const commonTextureProps = {
        url,
        height,
        width,
        pixelated: true
    };


    const sprite = new IsometricRectangle({
        planeView,
        height,
        width,
        texture: commonTextureProps,
        // strokeColor: 'none',
    });

    switch (planeView) {
        case 'SIDE':
            // sprite.left = -width / 2
            // sprite.right = -width
            break;
        case 'FRONT':
            // sprite.left = -width
            // sprite.right = -width /2
            break;

    }

    const group = new IsometricGroup({ top, right, left, })
    group.addChildren(sprite)
    sprite.drag = 'TOP'
    return group

}