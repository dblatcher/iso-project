import { IsometricCanvas, IsometricRectangle, PlaneView } from '@elchininet/isometric'
import { makeBlock } from './blockWithTexture';
import { DIRECTION } from './direction';
import { makeSprite } from './flatSprite';
import { MapGrid } from './MapGrid';
import { IMAGES } from './textures';

const container = document.createElement('div')
document.body.appendChild(container)


const canvas = new IsometricCanvas({
    container,
    backgroundColor: '#CCC',
    scale: 40,
    width: 500,
    height: 500,
});


const mapGrid = new MapGrid([
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }, { height: 2 }],
    [{ height: 2 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1.5, textureSide: IMAGES.wall, textureTop: IMAGES.grass }],
    [{ height: 1 }, { height: 1 }, { height: 1 }, { height: 1 }],
    [{ height: 0 }, { height: 0 }],
    [,{ height: 0 }, { height: 0 }],
],
    [
        // { image: IMAGES.duck, x: 0, y: 3, planeView: PlaneView.FRONT },
        // { image: IMAGES.duck, x: 1, y: 3, planeView: PlaneView.SIDE },
        { image: IMAGES.duck, x: 2, y: 3, planeView: PlaneView.SIDE },
        // { image: IMAGES.duckBack, x: 2, y: 2, planeView: PlaneView.FRONT },
        // { image: IMAGES.duckBack, x: 3, y: 1, planeView: PlaneView.SIDE },
        // { image: IMAGES.duck, x: 4, y: 1, planeView: PlaneView.FRONT },
    ]
);

mapGrid.render(canvas, DIRECTION.north);


(window as Record<string, any>).canvas = canvas;
(window as Record<string, any>).mapGrid = mapGrid;

