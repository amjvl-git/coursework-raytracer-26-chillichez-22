/*
import * as matrixs from "./maths_dir/matrixs.js"
import * as points from "./maths_dir/points.js"
import * as rays from "./maths_dir/rays.js";
// Tuple not needed, is a base class
import * as vectors from "./maths_dir/vectors.js"
*/

export * from "./maths_dir/matrixs.js"
export * from "./maths_dir/points.js"
export * from "./maths_dir/rays.js"
export * from "./maths_dir/vectors.js"
// Functions



// Conversions

/**
 * Converts from Vector4 to Vector3, by stripping the w value.
 *  
 * @param {Vector4} vectorFour 
 * @returns {Vector3} Stripped vector3 value. 
 */
export function stipWToVector3( vectorFour ){

    return new Vector3( vectorFour.x, vectorFour.y, vectorFour.z );
}

/**
 * Converts from Vector3 to Vector2, by stripping the z value.
 *  
 * @param {Vector3} vectorThree
 * @returns {Vector2} Stipped vector 2 value.
 */
export function stipZToVector2( vectorThree ){

    return new Vector2( vectorThree.x, vectorThree.y );
}

/**
 * Converts from point4 to point3, by stripping the w value.
 *  
 * @param {Point4} pointFour 
 * @returns {Point3} Stripped vector3 value. 
 */
export function stipWToPoint3( pointFour ){

    return new Point3( pointFour.x, pointFour.y, pointFour.z );
}

/**
 * Converts from point3 to point2, by stripping the z value.
 *  
 * @param {Point3} pointThree
 * @returns {Point2} Stipped vector 2 value.
 */
export function stipZToPoint2( pointThree ){

    return new Point2( pointThree.x, pointThree.y );
}

