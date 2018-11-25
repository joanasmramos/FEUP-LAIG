/**
 * Apply linear animations to an object
 */
class LinearAnimation extends Animation {
    /**
     * Constructor
     * @param {vec3 Array containing the coordinates of each control point} controlPoints
     * @param {Total time of the animation} totalTime
     */
    constructor(controlPoints, totalTime){
        super(totalTime);

        this.activeSegment = 0;
        this.totalDistance = 0;
        this.deltaDistance = 0;
        this.controlPoints = controlPoints;
        this.segmentsDistance = new Array(); // this.segmentsDistance[0] = 2 ---> segment 0 has a total distance of 2 units
        this.segments = new Array();
        this.oldPosition = this.controlPoints[0];
        this.translate = vec3.create();

        this.calcSegmentsDistance();
        this.setActiveSegmentDistance();
        this.setRotationAngle(this.segments[this.activeSegment], [0, 0, 1]);
    }

    /**
     * Returns a LinearAnimation object with the same properties as this
     */
    clone(){
        var copy = new LinearAnimation(this.controlPoints, this.totalTime);
        return copy;
    }

    /**
     * Calculates vectors for each segment
     * Calculates the distance of each segment (vector between two control points) and stores it
     * Updates total distance of the animation (sum of each segment distance)
     */
    calcSegmentsDistance() {
        for(let i=1; i<this.controlPoints.length; i++) {
            let segmentDistance = vec3.distance(this.controlPoints[i-1], this.controlPoints[i]);
            let vector = new Array(3);
            vec3.subtract(vector, this.controlPoints[i], this.controlPoints[i-1]);

            this.segmentsDistance.push(segmentDistance);
            this.segments.push(vector);
            this.totalDistance += segmentDistance;
        }
    }

    /**
     * Sets the maximum distance for the active segment (its own distance)
     */
    setActiveSegmentDistance() {
        this.activeSegmentDistance = this.segmentsDistance[this.activeSegment];
    }

    /**
     * Sets the current rotation angle, according to the current displacement vector
     * @param {Displacement vector} vec 
     */
    setRotationAngle(vec, oldvec) {
        let copy = vec3.clone(vec);
        let copy2 = vec3.clone(oldvec)

         //we only care about horizontal (xz) orientation
         copy[1] = 0;
         copy2[1] = 0; 

        if(copy[0] == 0 && copy[2] == 0){
            return;
        }
        this.rotationAngle = this.angle([0,0,1], copy);

        if(copy[0] < 0) { //x
            if(copy[2] > 0) { //z
                this.rotationAngle = -this.rotationAngle;
            }
            if(copy[2] < 0) { //z
                this.rotationAngle = -this.rotationAngle;
            }
        }
    }

    /**
     * Updates index of the active segment, if it reaches end of the segments, animation is done
     */
    updateActiveSegment() {
        if(++this.activeSegment == this.segments.length) {
            this.done = true;
        }
        else {
            this.setRotationAngle(this.segments[this.activeSegment], this.segments[this.activeSegment - 1]);
        }
    }

    /**
     * Calculates delta distance
     */
    calcDeltaDistance(){
        this.deltaDistance = (this.deltaT * this.totalDistance) / this.totalTime;
    }

    /**
     * Updates values according to deltaT
     */
    animate(){
        if(this.deltaT == null || this.done) {
            return;
        }
        
        let newPosition = vec3.create();

        this.calcDeltaDistance();

        if(this.deltaDistance > this.activeSegmentDistance) {
            this.deltaDistance -= this.activeSegmentDistance;

            for(let i=0; i<3; i++) {
                newPosition[i] = this.controlPoints[this.activeSegment + 1][i];
                this.translate[i] += (newPosition[i] - this.oldPosition[i]);
            }

            this.oldPosition = newPosition;

            this.updateActiveSegment();

            if (this.done) {
                return;
            }

            this.activeSegmentDistance = this.segmentsDistance[this.activeSegment];
        }
        else {
            this.activeSegmentDistance -= this.deltaDistance;
        }

        for(let i=0; i<3; i++) {
            newPosition[i] = this.oldPosition[i] + this.deltaDistance/this.segmentsDistance[this.activeSegment] * this.segments[this.activeSegment][i];
            this.translate[i] += (newPosition[i] - this.oldPosition[i]);
        }

        this.oldPosition = newPosition;
    }

    /**
     * Angle in radians between two vectors
     * @param {Vector 1} a 
     * @param {Vector 2} b 
     */
    angle(a, b) {
        let tempA = vec3.fromValues(a[0], a[1], a[2]);
        let tempB = vec3.fromValues(b[0], b[1], b[2]);
        vec3.normalize(tempA, tempA);
        vec3.normalize(tempB, tempB);
        let cosine = vec3.dot(tempA, tempB);
        if(cosine > 1.0) {
          return 0;
        }
        else if(cosine < -1.0) {
          return Math.PI;
        } else {
          return Math.acos(cosine);
        }
    }

    /**
     * Apply transformations to the matrix
     * @param {Current matrix} currentMat 
     */
    apply() {
        let result = mat4.create()
        mat4.identity(result);

        mat4.translate(result, result, this.translate);
        mat4.translate(result, result, this.controlPoints[0]); // translate inicial
        mat4.rotate(result, result, this.rotationAngle, [0,1,0]);

        return result;
    }
}
