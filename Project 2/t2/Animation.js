/**
 * Base class to apply animations to an object
 */
class Animation {

    /**
     * Constructor
     * @param {ID for animiation} id
     * @param {Total time of the animation} totalTime
     */
    constructor(id, totalTime){
        this.id = id;
        this.totalTime = totalTime;
        this.lastT = null;
        this.deltaT = null;
        this.done = false;
    }

    update(currTime) {
        if(this.lastT != null) {
            this.deltaT = currTime - this.lastT;
            this.deltaT *= Math.pow(10, -3); // segundos 
        }

        this.lastT = currTime;
    }
    apply() {}
}
