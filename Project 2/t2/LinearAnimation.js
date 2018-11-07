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

        this.calcSegmentsDistance();
        this.setActiveSegmentDistance();
        this.calcDeltaDistance;
    }

    /**
     * Calculates vectors for each segment
     * Calculates the distance of each segment (vector between two control points) and stores it
     * Updates total distance of the animation (sum of each segment distance)
     */
    calcSegmentsDistance() {
        for(let i=1; i<this.controlPoints.length; i++) {
            let segmentDistance = vec3.distance(this.controlPoints[i-1], this.controlPoints[i]); 
            let vector;
            vec3.subtract(vector, this.controlPoints[i], this.controlpoints[i-1]);

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
     * Updates index of the active segment, if it reaches end of the segments, animation is done
     */
    updateActiveSegment() {
        if(++this.activeSegment == this.segments.length) {
            this.done = true;
        }
    }

    /**
     * Calculates delta distance
     */
    calcDeltaDistance(){
        this.deltaDistance = (this.deltaT * this.totalDistance) / this.totalTime;
    }

    rectifyDirection() {

    }

    /**
     * Updates values according to deltaT
     */
    animate(){
        if(this.deltaT == null || this.done) {
            return;
        }

        this.calcDeltaDistance();
        
        if(this.deltaDistance > this.activeSegmentDistance) {
            this.deltaDistance -= this.activeSegmentDistance;
            this.updateActiveSegment();
        }
    }
}