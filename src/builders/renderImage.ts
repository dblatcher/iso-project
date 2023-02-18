import { PlaneView, IsometricRectangle, IsometricCircle, IsometricGroup } from "@elchininet/isometric";

export const renderIsometricImage = (input: {
    url: string,
    planeView: PlaneView,
    coords: [number, number, number],
    width?: number,
    height?: number,
    classes?: string[]
    renderShadow?: boolean,
}) => {
    const { url, planeView, width = 1, height = 1, classes = [], coords } = input
    const [right, left, top] = coords
    const group = new IsometricGroup({ top, right, left, })

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
        strokeColor: 'none',
    });

    switch (planeView) {
        case 'SIDE':
            sprite.right = (-width / 2) + .5
            sprite.left = .5
            break;
        case 'FRONT':
            // sprite.left = (-width / 2) + .5
            sprite.right = .5
            break;
        case 'TOP':
            sprite.left = (-width / 2) + .5
            sprite.right = (-width / 2) + .5
            break;

    }

    sprite.getElement().classList.add(...classes)

    if (input.renderShadow) {
        const shadow = new IsometricCircle({ 
            radius: width / 4, 
            left: 0.5, 
            right: 0.5, 
            top: 0, 
            planeView: PlaneView.TOP, 
            fillColor: 'black' 
        })
        shadow.getElement().classList.add('shadow')
        group.addChild(shadow)
    }

    group.addChild(sprite)
    return group
}