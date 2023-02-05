import { IsometricGraphicProps, PlaneView } from "@elchininet/isometric";

export const IMAGES = {
    wall: 'assets/brick_wall.png',
    grass: 'assets/grass.jpg',
    duck: 'assets/duck.png',
} as const;


export const makeSideTexture = (imageUrl: string, planeView: PlaneView): IsometricGraphicProps['texture'] => {
    return {
        height: 5,
        width: 5,
        pixelated: true,
        url: imageUrl,
        planeView,
    }
}
