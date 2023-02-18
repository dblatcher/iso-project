import { PlaneView, IsometricCircle, IsometricGroup } from "@elchininet/isometric";


export const renderIsometricShadow = (input: {
    coords: [number, number, number];
    radius?: number;
    classes?: string[];
}) => {
    const { radius: radius = 1 / 4, classes = [], coords } = input;
    const [right, left, top] = coords;
    const group = new IsometricGroup({ top, right, left });

    const shadow = new IsometricCircle({
        radius: radius,
        left: 0.5,
        right: 0.5,
        top: 0,
        planeView: PlaneView.TOP,
        fillColor: 'black'
    });
    shadow.getElement().classList.add(...classes);
    group.addChild(shadow);
    return group;
};
