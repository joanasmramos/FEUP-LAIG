/**
 * Apply linear animations to an object
 */
class LinearAnimation extends Animation {
    /**
     * Constructor
     * @param {vec3 Array containing the coordinates of each control point} controlPoints
     * @param {Total time of the animation} totalTime
     */
    constructor(id, controlPoints, totalTime){
        super(id, totalTime);

        this.activeSegment = 0;
        this.totalDistance = 0;
        this.deltaDistance = 0;
        this.controlPoints = controlPoints;
        this.segmentsDistance = new Array(); // this.segmentsDistance[0] = 2 ---> segment 0 has a total distance of 2 units
        this.segments = new Array();
        this.oldPosition = this.controlPoints[0];
        this.translate = [0,0,0];
        this.first = true;

        this.calcSegmentsDistance();
        this.setActiveSegmentDistance();
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
        
        let newPosition = new Array(3);

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

    apply(currentMat) {
        if(this.first) {
            let previousTranslation = new Array(), initialTranslation = new Array();
            mat4.getTranslation(previousTranslation, currentMat);
            vec3.subtract(initialTranslation, this.translate, previousTranslation);
            mat4.translate(currentMat, currentMat, initialTranslation);
        }

        let result = mat4.create();
        mat4.translate(result, currentMat, this.translate);

        for(let i=0;i<3;i++) {
            this.translate[i] = 0;
        }

        return result;
    }
}
