import * as maths from "./maths";


export function backgroundColour(ray){

    const white = new maths.Vector3(1, 1, 1);
    const blue = new maths.Vector3(0.3, 0.5, 0.9);
    const t = 0.5*( ray.y + 1);

    return white.scaled( 1 - t ).added
}