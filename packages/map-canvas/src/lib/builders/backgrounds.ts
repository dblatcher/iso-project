import { IsometricRectangle, PlaneView, IsometricGraphicProps, } from "@elchininet/isometric"

const buildTexture = (planeView: PlaneView, imageUrl: string, height: number, rotation = 0): IsometricGraphicProps['texture'] => {
  return {
    height,
    width: 10,
    pixelated: false,
    url: imageUrl,
    planeView,
    rotation: {
      axis: 'TOP',
      value: rotation,
    },
  }
}

export const buildBackgrounds = (input: {
  fillColor?: string,
  backdropSide?: string
  backdropFront?: string
  backdropFloor?: string
  floorRotation?: number
  backdropHeight?: number
}) => {
  const { fillColor = 'skyblue', backdropFront, backdropSide, backdropFloor, floorRotation, backdropHeight = 5 } = input
  const backgroundProps = {
    left: 0,
    right: 0,
    top: 0,
    width: 10,
    fillColor,
  }

  const sideBackground = new IsometricRectangle({
    planeView: PlaneView.SIDE,
    ...backgroundProps,
    height: backdropHeight,
    texture: backdropSide ? buildTexture(PlaneView.SIDE, backdropSide, backdropHeight) : undefined,
  })
  const frontBackground = new IsometricRectangle({
    planeView: PlaneView.FRONT,
    ...backgroundProps,
    height: backdropHeight,
    texture: backdropFront ? buildTexture(PlaneView.FRONT, backdropFront, backdropHeight) : undefined,
  })

  const floor = new IsometricRectangle({
    ...backgroundProps,
    planeView: PlaneView.TOP,
    height: 10,
    texture: backdropFloor ? buildTexture(PlaneView.TOP, backdropFloor, 10, floorRotation) : undefined,
  })

  return {
    sideBackground, frontBackground, floor
  }
}
