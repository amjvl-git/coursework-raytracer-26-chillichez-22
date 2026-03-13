import * as vectors from "./maths_dir/vectors.js";
import * as rays from "./maths_dir/rays.js";


// Projection


export class Frustum{

    constructor( near, far, left, right, top, bottom ){

        this.near = near;
        this.far = far;
        this.left = left;
        this.right = right;
        this.top = top;
        this.bottom = bottom;
    }
}

// Shapes
export class BaseShape{

}

export class Sphere extends BaseShape{
    // A 3d Sphere class

    /**
     * Creates a sphere using centre-point and a radius.
     * 
     * @param {vectors.Vector3} centre Centre of the sphere.
     * @param {Number} radius Radius of the sphere.
     * @param {Number} index Index in the list.
     * @param {*} colour Base colour of the sphere
     */
    constructor( centre, radius, index, colour ){

        super();

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

        let oc = ray.start.subbed( this.centre );

        let a = ray.direction.dot( ray.direction );
        let b = 2 * ray.direction.dot( oc );
        let c = oc.dot( oc ) - (this.radius * this.radius);

        let discriminant = ( b * b ) - (4 * a * c );

        if (discriminant < 0){
            return -1
        }

        let negativeRoot = ( (-b - Math.sqrt( discriminant ) ) / (2 * a) );

        // Chooses root to display
        
        if (negativeRoot > 0 ){
            return negativeRoot
        }

        return -1;
        
    }   

}
