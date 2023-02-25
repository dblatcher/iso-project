import { PlaneView, IsometricRectangle, IsometricGroup } from "@elchininet/isometric";

export const renderIsometricImage = (input: {
    imageUrls: string[],
    planeView: PlaneView,
    coords: [number, number, number],
    width?: number,
    height?: number,
    classes?: string[]
}) => {
    const { imageUrls, planeView, width = 1, height = 1, classes = [], coords } = input
    const [right, left, top] = coords
    const group = new IsometricGroup({ top, right, left, })

    const commonTextureProps = {
        height,
        width,
        pixelated: true
    };

    const positionProps = planeView == 'SIDE' ? {
        right: (-width / 2) + .5,
        left: .5,
    } : planeView === 'FRONT' ? {
        right: .5,
        left: 0,
    } : {
        right: (-width / 2) + .5,
        left: (-width / 2) + .5,
    }

    const frameRectangles = imageUrls.map(url => new IsometricRectangle({
        planeView,
        height,
        width,
        texture: { ...commonTextureProps, url },
        strokeColor: 'none',
        ...positionProps
    }));


    frameRectangles.forEach(sprite => sprite.getElement().classList.add(...classes))

    frameRectangles.forEach((sprite, index) => {
        if (index > 0) {
            sprite.getElement().style.display = 'none'
        }
    })

    group.addChildren(...frameRectangles)
    return { group, frameRectangles }
}