import { IsometricGraphicProps, PlaneView } from "@elchininet/isometric";

export const IMAGES = {
    wall: 'assets/brick_wall.png',
    grass: 'assets/grass.jpg',
    duck: 'assets/duck/walk/front/1.png',
    duckBack: 'assets/duck/walk/back/1.png',
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
