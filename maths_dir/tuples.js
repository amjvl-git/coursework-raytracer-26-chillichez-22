import * as matrixs from "./matrixs.js";

// Base Vector, Point Class


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

/**
 * @template thisName
 */
export class BaseTuple{

    /**
     * Subtracts the inputted object from this:
     * return = this + otherObject.
     * 
     * @param {thisName} otherObject object to add from this.
     */
    added(otherObject ){

        let copyObject = this.copy();
        copyObject.add(otherObject );

        return copyObject;
    }

    /**
     * Subtracts the inputted object from this:
     * return = this - otherObject.
     * 
     * @param {thisName} otherObject object to sub from this.
     */
    subbed(otherObject ){

        let copyObject = this.copy();
        copyObject.sub(otherObject );

        return copyObject;
    }

    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets returns it:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {thisName}
     */
    matrixMultiplied( otherMatrix ){

        const copyVector = this.copy()
        copyVector.matrixMultiply( otherMatrix );

        return copyVector;
    }

}

/**
 * @template thisName
 */
export class Tuple2 extends BaseTuple{

    /**
     * Creates a 2d object with x, y.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     */
    constructor (x, y ){
        super();
        this.x = x;
        this.y = y;
    }

    /**
     * Logs the object to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {thisName} Copy of this Vector.
     */
    copy(){

        return new this.constructor( this.x, this.y );
    }


    // Calculations
        
    /**
     * Adds the inputted object to this:
     * this = this + otherObject
     * 
     * @param {thisName} otherObject Object to add to this.
     */
    add(otherObject ){

        this.x = this.x + otherObject.x;
        this.y = this.y + otherObject.y;
    }

    /**
     * Subtracts the inputted object from this:
     * this = this - otherObject
     * 
     * @param {thisName} otherObject Object to sub from this.
     */
    sub(otherObject ){

        this.x = this.x - otherObject.x;
        this.y = this.y - otherObject.y;
    }

    
    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new matrixs.Matrix([ [this.x], [this.y] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
    }

    
    // Rotation

    /**
     * Rotates this object clock-wise by the inputted rotation.
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    rotate(radianRotation ){

        this.x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        this.y = (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));
    }

    /**
     * Returns a copy of this vector rotated clock-wise by the inputted rotation.
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {object} Copy og this vector rotated.
     */
    rotated(radianRotation ){

        return new this.constructor(
            (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation )),
            (this.x * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ))
        );
    }

}

/**
 * @template thisName
 */
export class Tuple3 extends BaseTuple{

    /**
     * Creates a 3d object with x, y, z.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     */
    constructor (x, y, z ){
        super();
        this.x = x;
        this.y = y;
        this.z = z;
    }


    /**
     * Logs the object to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y}, ${this.z} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {thisName} Copy of this Vector.
     */
    copy(){

        return new this.constructor( this.x, this.y, this.z );
    }


    // Calculations
        
    /**
     * Adds the inputted object to this:
     * this = this + otherObject
     * 
     * @param {thisName} otherObject Object to add to this.
     */
    add(otherObject ){

        this.x = this.x + otherObject.x;
        this.y = this.y + otherObject.y;
        this.z = this.z + otherObject.z;
    }

    /**
     * Subtracts the inputted object from this:
     * this = this - otherObject
     * 
     * @param {thisName} otherObject Object to sub from this.
     */
    sub(otherObject ){

        this.x = this.x - otherObject.x;
        this.y = this.y - otherObject.y;
        this.z = this.z - otherObject.z;
    }

    
    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        let vectorMatrix = new matrixs.Matrix([ [this.x], [this.y], [this.z] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
    }

}

/**
 * @template thisName
 */
export class Tuple4 extends BaseTuple{

    /**
     * Creates a 4d object with x, y, z, w.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     * @param {Number} w W value for the vector.
     */
    constructor (x, y, z, w ){
        
        super();
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    /**
     * Logs the object to the console.
     */
    repr(){

        console.log(`${this.constructor.name}: ${this.x}, ${this.y}, ${this.z}, ${this.w} `);
    }

    /**
     * Returns a copy of this Vector.
     * 
     * @returns {thisName} Copy of this Vector.
     */
    copy(){

        return new this.constructor( this.x, this.y, this.z, this.w );
    }


    // Calculations
        
    /**
     * Adds the inputted object to this:
     * this = this + otherObject
     * 
     * @param {thisName} otherObject Object to add to this.
     */
    add(otherObject ){

        this.x = this.x + otherObject.x;
        this.y = this.y + otherObject.y;
        this.z = this.z + otherObject.z;
        this.w = this.w + otherObject.w;
    }

    /**
     * Subtracts the inputted object from this:
     * this = this - otherObject
     * 
     * @param {thisName} otherObject Object to sub from this.
     */
    sub(otherObject ){

        this.x = this.x - otherObject.x;
        this.y = this.y - otherObject.y;
        this.z = this.z - otherObject.z;
        this.w = this.w - otherObject.w;
    }

    
    /**
     * Does a matrix multiplication on this vector and the other matrix; and 
     * sets it to this vector:
     * 
     * * Vector = A
     * * otherMatrix = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * Vector dimension must equal B columns,
     * 
     * Multiply matrix size is: Vector dimension x 1 column. 
     * 
     * @param {matrixs.Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new matrixs.Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
        this.w = vectorMatrix[3][0];
    }

}
