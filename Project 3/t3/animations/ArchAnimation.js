class ArchAnimation extends Animation {
    constructor(totalTime){
        super(totalTime);
    }

    apply(scene) {
        this.scene.translate(0, this.deltaT, 0);
    }
}