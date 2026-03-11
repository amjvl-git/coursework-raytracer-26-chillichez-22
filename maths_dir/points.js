import * as tuples from "./tuples.js"
import * as matrixs from "./matrixs.js"
import * as vectors from "./vectors.js"

/*
    BV <- BT -> BP
    |     |     |
    V2 <- T2 -> B2
    |     |     |
    V3 <- T3 -> B3
    |     |     |
    V4 <- T4 -> B4

    BaseVector & BasePoint Inherit from BaseTuple

    Tuple2,3,4 Inherit BaseTuple
    Vector2,3,4 Inherit BaseVector
    Point2,3,4 Inherit BasePoint

    Vector2 & Point2 *also* Inherit from Tuple2
    Vector3 & Point3 *also* Inherit from Tuple3
    Vector4 & Point4 *also* Inherit from Tuple4

*/


// Points

/**
 * @template thisName
 */
class BasePoint{
    // Base point class
    
    /**
     * Returns a copy of this point translated 
     * @param {vectors.BaseVector} translationVector Vector to translate the point by
     * @returns {thisName} Translated point
     */
    translated(translationVector ){

        let newPoint = this.copy();
        newPoint.translate(translationVector );

        return newPoint;
    }

}

/**
 * @extends {tuples.Tuple2<Point2>}
 */
export class Point2 extends tuples.Tuple2{
    // A 2D point class

     /**
     * Creates a 2d point with X and y.
     * @param {Number} x X value for the point.
     * @param {Number} y Y value for the point.
     */
    constructor(x, y){

        super(x, y);
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {BasePoint} otherPoint The point, to create a vector to.
     * @returns {vectors.Vector2} Vector from this to otherPoint.
     */
    vectorToPoint(otherPoint ){
        
        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;

        return new vectors.Vector2(x, y);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {BasePoint} otherPoint The point, to create a vector from.
     * @returns {vectors.Vector2} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;

        return new vectors.Vector2(x, y);
    }

    /**
     * Moves this point by the inputted vector
     * @param {vectors.Vector2} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
    }

}

/**
 * @extends {tuples.Tuple3<Point3>}
 */
export class Point3 extends tuples.Tuple3{
    // A 3D point class

    constructor(x, y, z){

        super(x, y, z);
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * 
     * @param {BasePoint} otherPoint The point, to create a vector to.
     * @returns {vectors.Vector3} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;
        let z = otherPoint.z - this.z;

        return new vectors.Vector3(x, y, z);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * 
     * @param {BasePoint} otherPoint The point, to create a vector from.
     * @returns {vectors.Vector3} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;
        let z = this.z - otherPoint.z;

        return new vectors.Vector3(x, y, z);
    }

    /**
     * Moves this point by the inputted vector.
     * 
     * @param {vectors.Vector3} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
        this.z = this.z + translationVector.z;

    }

}

/**
 * @extends {tuples.Tuple4<Point4>}
 */
export class Point4 extends tuples.Tuple4{
        // A 4D point class

    constructor(x, y, z, w){

        super(x, y, z, w);
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * 
     * @param {BasePoint} otherPoint The point, to create a vector to.
     * @returns {vectors.Vector4} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        const x = otherPoint.x - this.x;
        const y = otherPoint.y - this.y;
        const z = otherPoint.z - this.z;
        const w = otherPoint.w - this.w;

        return new vectors.Vector4(x, y, z, w);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {BasePoint} otherPoint The point, to create a vector from.
     * @returns {vectors.Vector4} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        const x = this.x - otherPoint.x;
        const y = this.y - otherPoint.y;
        const z = this.z - otherPoint.z;
        const w = this.w - otherPoint.w;

        return new vectors.Vector4(x, y, z, w);
    }

    /**
     * Moves this point by the inputted vector
     * @param {vectors.Vector4} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
        this.z = this.z + translationVector.z;
        this.w = this.w + translationVector.w;
    }

}

// Point2,3,4 inherting from BasePoint

Object.getOwnPropertyNames(BasePoint.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Point2.prototype[name] = BasePoint.prototype[name];
});

Object.getOwnPropertyNames(BasePoint.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Point3.prototype[name] = BasePoint.prototype[name];
});

Object.getOwnPropertyNames(BasePoint.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Point4.prototype[name] = BasePoint.prototype[name];
});

