
// Used to get the files inside the maths dir

import * as matrixs from "./maths_dir/matrixs.js"
import * as rays from "./maths_dir/rays.js";
import * as vectors from "./maths_dir/vectors.js"


// Exports
export * from "./maths_dir/matrixs.js"
export * from "./maths_dir/rays.js"
export * from "./maths_dir/vectors.js"


// Functions

/**
 * Converts from Vector4 to Vector3, by stripping the w value.
 *  
 * @param {vectors.Vector4} maths.VectorFour 
 * @returns {vectors.Vector3} Stripped maths.Vector3 value. 
 */
export function stipWToVector3( VectorFour ){

    return new maths.Vector3( VectorFour.x, VectorFour.y, VectorFour.z );
}

/**
 * Converts from Vector3 to Vector2, by stripping the z value.
 *  
 * @param {vectors.Vector3} VectorThree
 * @returns {vectors.Vector2} Stipped maths.Vector 2 value.
 */
export function stipZToVector2( VectorThree ){

    return new maths.Vector2( VectorThree.x, VectorThree.y );
}
