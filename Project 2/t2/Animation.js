/**
 * Base class to apply animations to an object
 */
class Animation {

    /**
     * Constructor
     * @param {Total time of the animation} totalTime 
     */
    constructor(totalTime){
        this.totalTime = totalTime;
        this.lastT = null;
        this.deltaT = null;
    }

    update(currTime) {
        if(this.lastT != null) {
            this.deltaT = currTime - this.lastT;
        }

        this.lastT = currTime;
    }
    apply() {}
}