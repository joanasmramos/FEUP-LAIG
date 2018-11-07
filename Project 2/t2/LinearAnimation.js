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
        super.constructor(totalTime);
        
        this.activeSegment = 0;
        this.totalDistance = 0;
        this.deltaDistance = 0;
        this.controlPoints = controlPoints;
        this.segments = new Array(); // this.segments[0] = 2 ---> segment 0 has a total distance of 2 units
        
        this.translatex = 0;
        this.translatey = 0;
        this.translatez = 0;

        this.calcSegmentsDistance();
        this.calcDeltaDistance;
    }

    /**
     * Calculates the distance of each segment (vector between two control points) and stores it
     * Updates total distance of the animation (sum of each segment distance)
     */
    calcSegmentsDistance() {
        for(var i=1; i<this.controlPoints.length; i++) {
            var segmentDistance = vec3.distance(this.controlPoints[i-1], this.controlPoints[i]); 
            this.segments.push(segmentDistance);
            this.totalDistance += segmentDistance;
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
}