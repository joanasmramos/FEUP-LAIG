/**
 * Base class to apply animations to an object
 */
class Animation {

    /**
     * Constructor
     * @param {ID for animiation} id
     * @param {Total time of the animation} totalTime
     */
    constructor(totalTime){
        this.totalTime = totalTime;
        this.lastT = null;
        this.deltaT = null;
        this.done = false;
    }

    /**
     * Update deltaT and lastT
     * @param {Current time in miliseconds} currTime 
     */
    update(currTime) {
        if(this.lastT != null) {
            this.deltaT = currTime - this.lastT;
            this.deltaT *= Math.pow(10, -3); // to seconds 
        }

        this.lastT = currTime;
    }
    
    /**
     * Apply transformations
     * To be defined in child classes
     */
    apply() {}
}
