import * as vectors from "./maths_dir/vectors.js";
import * as rays from "./maths_dir/rays.js";


// Projection

/**
 * A 3d sphere class, with equidistant radius and a centre.
 */
export class Sphere{
    // A 3d Sphere class

    /**
     * Creates a sphere using centre-point and a radius.
     * 
     * @param {vectors.Vector3} centre Centre of the sphere.
     * @param {Number} radius Radius of the sphere.
     * @param {Number} index Index in the list.
     * @param {vectors.Vector3} colour Base colour of the sphere
     */
    constructor( centre, radius, index, colour ){

        this.centre = centre;
        this.radius = radius;
        this.index = index;
        this.colour = colour;
    }

    /**
     * Tests if the ray passes through the sphere, and returns n RayResult3
     * object
     * 
     * @param {rays.Ray3} ray Ray to test.
     * @returns {Number} Roots of the intersection 
     */
    rayIntersect(ray ){

        // ( o - c ) in the equation, since its used quite alot 
        let oc = ray.start.subbed( this.centre );

        let a = ray.direction.dot( ray.direction );
        let b = 2 * ray.direction.dot( oc );
        let c = oc.dot( oc ) - (this.radius * this.radius);

        let discriminant = ( b * b ) - (4 * a * c );

        // Checks if the discriminant, if the ray is inside the circle 
        if (discriminant < 0){
            return -1
        }

        // Gets the closest root for the intersection
        let negativeRoot = ( (-b - Math.sqrt( discriminant ) ) / (2 * a) );
        if (negativeRoot > 0 ){
            return negativeRoot
        }

        // Error handling, just dont show the pixel
        return -1;
        
    }   

}
