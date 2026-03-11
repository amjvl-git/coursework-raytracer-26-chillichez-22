// Functions

// Matrix functions

/**
 * Creates a matrix full of 0's 
 * 
 * @param {Number} rows Row count
 * @param {Number} cols Column Count
 * @returns {Matrix} Empty Matrix 
 */
export function createEmptyMatrix( rows, cols ){

    let matrixList = [];
    for ( let r = 0; r < rows; r++ ){

        matrixList[r] = [];

        for (let c = 0; c < cols; c++){

            matrixList[r][c] = 0
        }
    }

    return new Matrix( matrixList)
}

// Vector & Point Functions

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



// Classes

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


export class Matrix{

    // Constructing / Creating

    /**
     * Creates a matrix from a list of rows.
     * List should contain 1 or more (nested) lists as the rows,
     * 
     * -------------
     * 1 X 1 Matrix:
     * 
     * [
     *  [ Col1 ]
     * ]
     * 
     * e.g
     * 
     * [ [ 1 ] ]
     * 
     * -------------
     * 3 X 2 Matrix:
     * 
     * [
     *  [ Col1, Col2 ],
     * 
     *  [ Col1, Col2 ],
     * 
     *  [ Col1, Col2 ]
     * ]
     * 
     * e.g
     * 
     * [ 
     *   [ 1, 4, 7 ],
     * 
     *   [ 2, 5, 8 ],
     * 
     *   [ 3, 6, 9 ] 
     * ]
     * 
     * -------------
     * @param {List} matrixAsList 
     */
    constructor( matrixAsList ){

        this.matrix = matrixAsList;

        this.checkMatrix();

        this.rows = this.matrix.length;
        this.columns = this.matrix[0].length; // Assume all the same since it was checked 
    }

    /** 
     * Checks if the matrix was written correctly:
     * 
     * * Each row has the same number of columns
     */
    checkMatrix(){  

        // console.log(`Matrix list: ${this.repr()}`)

        let rows = this.matrix.length;
        let prevCols = this.matrix[0].length;

        // 1 X 1 matrix - ( one ) column, no other to compare
        if (rows === 1){

            if ( this.matrix[0].constructor === Array ){

                return;
            }
        }
        
        for (let r = 0; r < rows; r++ ){

            // Checks if each item is a list
            if ( this.matrix[ r ].constructor != Array ){

                throw new Error(`Row ${this.matrix[ r ]} at matrix index: ${r}, is type ${ typeof this.matrix[ r ]}, not an ${Array} type.`);
            }

            let rowCount = this.matrix[ r ].length;

            // Checks the first col with the frist col, but should be fine
            if ( rowCount != prevCols ){

                throw new Error(`Row ${this.matrix[ r ]} at matrix index: ${r}, has differing column counts: previous count ${prevCols}, index col count ${rowCount}.`); 
            }

            // Dont need to updated prevCols, since every size *should* be the same, otherwise it would throw an error
        }
    }

    /**
     * Logs the matrix to the console.
     */
    repr(){

        console.log("Matrix: ");
        this.matrix.forEach(element => { console.log( element ) });

    }

    /**
     * Returns a copy of this matrix
     */
    copy(){

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList.add( [] );

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = this.getValue(r, c)
            }
        }

        return new Matrix( matrixList );

    }

    // Variables

    /**
     * Returns the value at the index [ Row ][ Col ].
     * @param {Number} row Row for the matrix.
     * @param {Number} col Column for the matrix.
     * @returns {Number} Value at index.
     */
    getValue(row, col){

        return this.matrix[ row ][ col ];
    }

    /**
     * Returns the value at the index [ Row ][ Col ].
     * @param {Number} row Row for the matrix.
     * @param {Number} col Column for the matrix.
     * @param {Number} value Number for that index.
     */
    setValue(row, col, value){

        if (value.constructor != Number){

            throw new Error(`Value: ${value}, to set is type: ${typeof value}, not a ${Number}`);
        }

        this.matrix[ row ][ col ] = value;
    }

    // Calculations

    /**
     * Checks if this and the inputted matrix have the rows, and column count. 
     * @param {Matrix} otherMatrix 
     * @returns {boolean} 
     */
    isMatrixSameSize(otherMatrix ){

        if ( this.rows != otherMatrix.rows || this.columns != otherMatrix.columns ){

            throw new Error(`Matricies have differing sizes: thisRow: ${this.rows}, otherRows: ${otherMatrix.rows} | thisCols: ${this.columns}, otherCols: ${otherMatrix.columns}`)
        }

        return true;
    }

    /**
     * Adds this and the inputted matrices togethor.
     * Matricies need to be the same size.
     * * This = This + Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to add
     */
    add( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );
        
        for ( let r = 0; r < this.rows; r++ ){

            for (let c = 0; c < this.columns; c++){

                this.matrix[r][c] = this.getValue(r, c) + otherMatrix.getValue(r, c);
            }
        }

    }

    /**
     * Substracts this and the inputted matrices togethor.
     * Matricies need to be the same size.
     * * This = This - Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to sub
     */
    sub( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );
        
        for ( let r = 0; r < this.rows; r++ ){

            for (let c = 0; c < this.columns; c++){

                this.matrix[r][c] = this.getValue(r, c) - otherMatrix.getValue(r, c);
            }
        }

    }

    /**
     * Does a matrix multiplication on this and the other matrix; and sets it
     * to this matrix:
     * 
     * * This = A
     * * Other = B
     * * This = Matrix multiplication of A x B
     *  
     * 
     * A rows must equal B columns,
     * 
     * Multiply matrix size is A rows x B cols. 
     * 
     * @param {Matrix} otherMatrix 
     */
    multiply( otherMatrix ){

        // This = A
        // Other = B
        
        if ( this.columns != otherMatrix.rows ){

            throw new Error(`Cannot multiply matricies have differing sizes: thisRow: ${this.rows}, otherCols: ${otherMatrix.columns}`);
        }

        let multiplyMatrix = createEmptyMatrix( this.rows, otherMatrix.columns );
        multiplyMatrix.repr();

        // Repeats for each row in A
        for (let aRowIndex = 0; aRowIndex < this.rows; aRowIndex++ ){

            // Repeats for each column in B
            for (let bColIndex = 0; bColIndex < otherMatrix.columns; bColIndex++ ){

                let sum = 0;

                // Goes down B's rows, and across A's Columns
                // Finds the sum of: A Cols and B Rows multiplied
                for (let bRowIndex = 0; bRowIndex < otherMatrix.rows; bRowIndex++){

                    let A = this.getValue(aRowIndex, bRowIndex);
                    let B = otherMatrix.getValue(bRowIndex, bColIndex);

                    sum += A * B;
                }

                multiplyMatrix.setValue(aRowIndex, bColIndex, sum ); 
            }

        }

        this.matrix = multiplyMatrix.matrix;
        this.rows = multiplyMatrix.rows;
        this.columns = multiplyMatrix.columns;
    }

    // Return Calculations

    /**
     * Returns this and the inputted matrices added togethor.
     * Matricies need to be the same size.
     * * This = This + Inputted  
     * 
     * @param {Matrix} otherMatrix Matrix to add
     * @return {Matrix} Copy of added matrices
     */
    added( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList[r] = [];

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = (this.getValue(r, c) + otherMatrix.getValue(r, c));
            }
        }

        return new Matrix( matrixList );
    }

    /**
     * Returns this and the inputted matrices subtracted togethor.
     * Matricies need to be the same size.
     * * This = This - Inputted.  
     * 
     * @param {Matrix} otherMatrix Matrix to sub.
     * @return {Matrix} Copy of subtracted matrices.
     */
    subbed( otherMatrix ){

        this.isMatrixSameSize( otherMatrix );

        let matrixList = [];
        for ( let r = 0; r < this.rows; r++ ){

            matrixList[r] = [];

            for (let c = 0; c < this.columns; c++){

                matrixList[r][c] = (this.getValue(r, c) - otherMatrix.getValue(r, c));
            }
        }

        return new Matrix( matrixList );
    }

    /**
     * Returns the matrix multiplication of this and the other matrix:
     * * This = A,
     * * Other = B,
     * * This = Matrix multiplication of A x B.
     *  
     * 
     * A rows must equal B columns,
     * 
     * Multiply matrix size is A rows x B cols. 
     * 
     * @param {Matrix} otherMatrix 
     * @returns {Matrix} Return of A x B.
     */
    multiplied( otherMatrix ){

        // This = A
        // Other = B
        
        if ( this.columns != otherMatrix.rows ){

            throw new Error(`Cannot multiply matricies have differing sizes: thisRow: ${this.rows}, otherCols: ${otherMatrix.columns}`);
        }

        let multiplyMatrix = createEmptyMatrix( this.rows, otherMatrix.columns );
        multiplyMatrix.repr();

        // Repeats for each row in A
        for (let aRowIndex = 0; aRowIndex < this.rows; aRowIndex++ ){

            // Repeats for each column in B
            for (let bColIndex = 0; bColIndex < otherMatrix.columns; bColIndex++ ){

                let sum = 0;

                // Goes down B's rows
                // Find the sum of A Cols and B Rows multiplied
                for (let bRowIndex = 0; bRowIndex < otherMatrix.rows; bRowIndex++){

                    let A = this.getValue(aRowIndex, bRowIndex);
                    let B = otherMatrix.getValue(bRowIndex, bColIndex);

                    sum += A * B;
                }

                multiplyMatrix.setValue(aRowIndex, bColIndex, sum ); 
            }

        }

        return multiplyMatrix;
    }

}

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

// Base Vector, Ray, Point Class

/**
 * @template thisName
 */
class BaseTuple{

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
class Tuple2 extends BaseTuple{

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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y] ]);
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
class Tuple3 extends BaseTuple{

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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        let vectorMatrix = new Matrix([ [this.x], [this.y], [this.z] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
    }

}

/**
 * @template thisName
 */
class Tuple4 extends BaseTuple{

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
     * @param {Matrix} otherMatrix 
     */
    matrixMultiply( otherMatrix ){

        vectorMatrix = new Matrix([ [this.x], [this.y], [this.z], [this.w] ]);
        vectorMatrix.multiply(otherMatrix);

        this.x = vectorMatrix[0][0];
        this.y = vectorMatrix[1][0];
        this.z = vectorMatrix[2][0];
        this.w = vectorMatrix[3][0];
    }



}

// Vectors

/**
 * @template thisName
 */
class BaseVector extends BaseTuple{

    
    /**
     * Returns a normalised copy of this vector, with magnitude 1.
     * @returns {Vector3} Normalised copy of this vector.
     */
    normalised(){

        let magnitude = this.getMagnitude();

        return new this.constructor( 
            this.x / magnitude,
            this.y / magnitude,
            this.z / magnitude  );
    }

    /**
     * Returns a scaled copy this vector, scaled by the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector by.
     * @returns {thisName} Scaled copy of this vector.
     */
    scaled(scaleFactor ){

        let copyVector = this.copy();
        //console.log(`Is Tuple3: ${ copyVector instanceof Tuple3}`)
        copyVector.scale(scaleFactor);

        return copyVector;
    }

    /**
     * Returns a scaled copy this vector, scaled to the inputted factor.
     * 
     * @param {Number} scaleFactor Factor to scale the vector to.
     * @returns {thisName} Scaled copy of this vector.
     */
    scaledTo(scaleFactor ){

        let copyVector = this.copy();
        copyVector.scaleTo(scaleFactor);

        return copyVector;
    }
}

/**
 * @extends {Tuple2<Vector2>}
 */
export class Vector2 extends Tuple2{
    // A 2D vector class

    /**
     * Creates a 2d vector with X and y.
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     */
    constructor (x, y ){

        super(x, y);
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) );
    }

    /**
     * Returns the vector's angle in radians.
     * @returns {Number} Euler radian angle of the vector.
     */
    getAngle(){

        return Math.atan2( this.y, this.x);
    }

    /**
     * Return the slope/gradient of this vector.
     * @returns {Number} Gradient of the vector.
     */
    getSlope(){

        return (this.y / this.x)
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
    }

    // Return Calculation

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector2} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x + 
               this.y * otherVector.y 
        

    }

}

/**
 * @extends {Tuple3<Vector3>}
 */
export class Vector3 extends Tuple3{
    // A 3D vector class

    /**
     * Creates a 3d vector with x, y, z.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     */
    constructor (x, y, z ){
        super(x, y, z);
    }

    /**
     * Logs the Vector3 to the console.
     */
    repr(){

        super.repr();
    }

    /**
     * Returns a copy of this Vector.
     * @returns {Vector3} Copy of this Vector.
     */
    copy(){

        return super.copy();
    }

    // Variables

    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) );
    }

    /**
     * Gets the euler rotation for the X, Y, Z angles, measured in radians 
     * @returns {Array<Number>} [ X_Radian, Y_Radian, Z_Radian ]
     */
    getOrientation(){

        // Y and Z are swapped in the calculation, as it states Z as up & down
        // So Y is Gamma, and Z is Beta

        let denominator = this.getMagnitude();

        let alpha = Math.acos( this.x / denominator );
        let beta = Math.acos( this.z / denominator );
        let gamma = Math.acos( this.y / denominator );
      
        return [alpha, beta, gamma ];
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
        this.z = this.z / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
    }

    // Return Calculation

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector3} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x +
               this.y * otherVector.y +
               this.z * otherVector.z;
    }

    cross(otherVector ){

        return new Vector3(
            ( this.y + otherVector.z ) - ( this.z + otherVector.y ),
            ( this.z + otherVector.x ) - ( this.x + otherVector.z ),
            ( this.x + otherVector.y ) - ( this.y + otherVector.x )
        );

    }

    // Rotations

    /**
     * Rotates this vector about the x-axis by the inputted roation 
     * 
     * Changes only Y and Z, matrix of:
     * 
     * [ 1, 0, 0 ]
     * 
     * [ 0, cos, -sin ]
     * 
     * [ 0, sin, cos ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    xRotate(radianRotation ){

        let y = (this.y * Math.cos(radianRotation) ) - ( this.z * Math.sin(radianRotation ));
        let z = (this.y * Math.sin(radianRotation )) + ( this.z * Math.cos(radianRotation ));

        this.y = y;
        this.z = z;
    }

    /**
     * Rotates this vector about the y-axis by the inputted roation. 
     * 
     * Changes only X and Z, matrix of:
     * 
     * [ 0, cos, sin ]
     * 
     * [ 0, 1, 0 ]
     * 
     * [ 0, -sin, cos ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    yRotate(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) + ( this.z * Math.sin(radianRotation ));
        let z = ( this.z * Math.cos(radianRotation )) - (this.x * Math.sin(radianRotation ));

        this.x = x;
        this.z = z;
    }

    /**
     * Rotates this vector about the z-axis by the inputted roation 
     * 
     * Changes only X and Y, matrix of:
     * 
     * [ 0, cos, -sin ]
     * 
     * [ 0, sin, cos  ]
     * 
     * [ 0, 0, 1 ]
     * 
     * @param {Number} radianRotation Rotation of the vector in radians.
     */
    zRotate(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.y * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        this.x = x;
        this.y = y;
    
    }


    /**
     * Returns a copy of this vector rotated about the x-axis by the inputted roation. 
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    xRotated(radianRotation ){

        let y = (this.y * Math.cos(radianRotation) ) - ( this.z * Math.sin(radianRotation ));
        let z = (this.y * Math.sin(radianRotation )) + ( this.z * Math.cos(radianRotation ));

        return new Vector3(this.x, y, z);
    }

    /**
     * Returns a copy of this vector rotated about the y-axis by the inputted roation.
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    yRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) + ( this.z * Math.sin(radianRotation ));
        let z = ( this.z * Math.cos(radianRotation )) - (this.x * Math.sin(radianRotation ));

        return new Vector3(x, this.y, z);
    }


    /**
     * Returns a copy of this vector rotated about the z-axis by the inputted roation .
     * @param {Number} radianRotation Rotation of the vector in radians.
     * @returns {Vector3} Rotated copy of this vector.
     */
    zRotated(radianRotation ){

        let x = (this.x * Math.cos(radianRotation) ) - ( this.y * Math.sin(radianRotation ));
        let y = (this.y * Math.sin(radianRotation )) + ( this.y * Math.cos(radianRotation ));

        return new Vector3(x, y, this.z );
    }
}

/**
 * @extends {Tuple4<Vector4>}
 */
export class Vector4 extends Tuple4{
    // A 4D vector class

    /**
     * Creates a 4d vector with x, y, z, w.
     * 
     * @param {Number} x X value for the vector.
     * @param {Number} y Y value for the vector.
     * @param {Number} z Z value for the vector.
     * @param {Number} w W value for the vector.
     */
    
    constructor(x, y, z, w){

        super(x, y, z, w);

    }

    // Variables

    
    /**
     * Return the vector's magnitude.
     * @returns {Number} Magnitude of vector.
     */
    getMagnitude(){
        
        return Math.sqrt( ( this.x ** 2) + ( this. y ** 2) + ( this.z ** 2) + ( this.w ** 2) );
    }

    // Calculations

    /**
     * Normalises this vector to a unit vector, with magnitude 1.
     */
    normalise(){

        let magnitude = this.getMagnitude();
        this.x = this.x / magnitude;
        this.y = this.y / magnitude;
        this.z = this.z / magnitude;
        this.w = this.w / magnitude;
    }

    /**
     * Scales this vector by the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector by.
     */
    scale(scaleFactor ){

        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
        this.w = this.w * scaleFactor;
    }

    /**
     * Scales this vector to the inputted factor.
     * @param {Number} scaleFactor Factor to scale this vector to.
     */
    scaleTo(scaleFactor ){

        this.normalise();
        this.x = this.x * scaleFactor;
        this.y = this.y * scaleFactor;
        this.z = this.z * scaleFactor;
        this.w = this.w * scaleFactor;
    }

    // Return Calculations

    /**
     * Returns the dot product of this and the inputted vector
     * @param {Vector4} otherVector Other vector to dot product against.
     * @returns {Number} The dot product of this and otherVector.
     */
    dot(otherVector ){

        return this.x * otherVector.x +
               this.y * otherVector.y +
               this.z * otherVector.z +
               this.w * otherVector.w;
    }
    
}

// Vector2,3,4 inherting from BaseVector
 
Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector2.prototype[name] = BaseVector.prototype[name];
})

Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector3.prototype[name] = BaseVector.prototype[name];
})

Object.getOwnPropertyNames(BaseVector.prototype)
  .filter(name => name !== "constructor")
  .forEach(name => {
    Vector4.prototype[name] = BaseVector.prototype[name];
})



// Points

/**
 * @template thisName
 */
class BasePoint{

    
    /**
     * Returns a copy of this point translated 
     * @param {BaseVector} translationVector Vector to translate the point by
     * @returns {thisName} Translated point
     */
    translated(translationVector ){

        let newPoint = this.copy();
        newPoint.translate(translationVector );

        return newPoint;
    }

}

/**
 * @extends {Tuple2<Point2>}
 */
export class Point2 extends Tuple2{
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
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector2} Vector from this to otherPoint.
     */
    vectorToPoint(otherPoint ){
        
        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;

        return new Vector2(x, y);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector2} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;

        return new Vector2(x, y);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector2} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
    }

}

/**
 * @extends {Tuple3<Point3>}
 */
export class Point3 extends Tuple3{
    // A 3D point class

    constructor(x, y, z){

        super(x, y, z);
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector3} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        let x = otherPoint.x - this.x;
        let y = otherPoint.y - this.y;
        let z = otherPoint.z - this.z;

        return new Vector3(x, y, z);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector3} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        let x = this.x - otherPoint.x;
        let y = this.y - otherPoint.y;
        let z = this.z - otherPoint.z;

        return new Vector3(x, y, z);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector3} translationVector Vector to translate this point by
     */
    translate(translationVector ){

        this.x = this.x + translationVector.x;
        this.y = this.y + translationVector.y;
        this.z = this.z + translationVector.z;

    }

}

/**
 * @extends {Tuple4<Point4>}
 */
export class Point4 extends Tuple4{
        // A 4D point class

    constructor(x, y, z, w){

        super(x, y, z, w);
    }

    // Vector Calculations

    /**
     * Returns a Vector from this point to otherPoint.
     * @param {Point} otherPoint The point, to create a vector to.
     * @returns {Vector4} Vector from this to otherPoint.  
     */
    vectorToPoint(otherPoint ){

        const x = otherPoint.x - this.x;
        const y = otherPoint.y - this.y;
        const z = otherPoint.z - this.z;
        const w = otherPoint.w - this.w;

        return new Vector4(x, y, z, w);
    }

    /**
     * Returns a Vector from otherPoint to this point.
     * @param {Point} otherPoint The point, to create a vector from.
     * @returns {Vector4} Vector from otherPoint to this.
     */
    vectorFromPoint(otherPoint ){

        const x = this.x - otherPoint.x;
        const y = this.y - otherPoint.y;
        const z = this.z - otherPoint.z;
        const w = this.w - otherPoint.w;

        return new Vector4(x, y, z, w);
    }

    /**
     * Moves this point by the inputted vector
     * @param {Vector4} translationVector Vector to translate this point by
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

// Rays

export class Ray3{
    // A 3D Ray Class

    /**
     * Creates 3D ray from a start position and direction.
     * 
     * @param {Point3} startPos Start position / origin of the ray.
     * @param {Vector3} directionVector Vector for the direction of the vector.
     */
    constructor( startPos, directionVector ){

        this.start = startPos;
        this.direction = directionVector;
    }

    /**
     * Interpolates the start point upto t.
     * 
     * @param {Number} t 
     * @returns {Point3} Ray at point, when t 
     */
    at(t){

        return this.start.added( this.direction.scaled(t) );
    }

}

export class RayResult3{
    // Ray3 Hit Result class

    /**
     * Creates a hit result for a Ray3.
     * 
     * @param {Point3} position Position of the hit.
     * @param {Vector3} normalVector Normal vector for the hit.
     * @param {Number} time Scalar value (doesnt have to be time) for the hit.
     * @param {Number} sphereIndex Index of the colliding sphere.
     */
    constructor( position, normalVector, time, sphereIndex){

        this.pos = position;
        this.normal = normalVector;
        this.t = time; // Any scalar value for interpolating
        this.sphereIndex = sphereIndex;
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
     * @param {Point3} centre Centre of the sphere.
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
     * @param {Ray3} ray Ray to test.
     * @returns {Number} Roots of the intersection 
     */
    rayIntersect(ray ){

        let oc = ray.start.vectorToPoint( this.centre );

        let a = ray.direction.dot( ray.direction );
        let b = 2 * ray.direction.dot( oc );
        let c = oc.dot( oc ) - (this.radius * this.radius);

        let discriminant = ( b * b ) - (4 * a * c );

        if (discriminant > 0){
            return -1
        }

        let negativeRoot = ( (-b - Math.sqrt( discriminant ) ) / (2 * a) );
        let posotiveRoot = ( (-b + Math.sqrt( discriminant ) ) / (2 * a) );

        // Chooses root to display
        
        if (negativeRoot > 0 ){
            return negativeRoot
        }

        else if (posotiveRoot > 0){
            return posotiveRoot
        }

        return -1;
        
    }   

}
