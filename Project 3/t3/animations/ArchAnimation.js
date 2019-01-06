class ArchAnimation extends Animation {
    constructor(scene, totalTime, x, z, row, column){
        super(totalTime);
        this.scene = scene;
        this.translate = 0;
        this.heightMax = 3;
        this.halfTime = totalTime/2;
        this.firstSegment = true;
        this.x = x;
        this.z = z;
        this.row = row;
        this.column = column;
        this.calculateSegments();
    }

    calculateSegments(){
        this.ztotalDiference = this.row-this.z;
        this.xtotalDiference = this.column-this.x;
        this.zDiference = (this.row - this.z)/2;
        this.xDiference = (this.column - this.x)/2;
        this.yDiference = this.heightMax;
        this.zdeltaDiference = 0;
        this.ydeltaDiference = 0;
        this.xdeltaDiference = 0;
    }

    apply() {
        if(!(this.deltaT>0)){
            return;
        }

        this.xdeltaDiference += this.deltaT * this.xDiference / this.halfTime; 
        this.zdeltaDiference += this.deltaT * this.zDiference / this.halfTime;

        if(this.firstSegment) {
            
            this.ydeltaDiference += this.deltaT * this.yDiference / this.halfTime; 
             
            if(Math.abs(this.xdeltaDiference) >= Math.abs(this.xDiference)) {
                this.xdeltaDiference = this.xDiference;
                this.ydeltaDiference = this.yDiference;
                this.zdeltaDiference = this.zDiference;
                this.firstSegment = false;
            }
        }
        else {
            this.ydeltaDiference -= this.deltaT * this.yDiference / this.halfTime; 
            if(Math.abs(this.xdeltaDiference) >= Math.abs(this.xtotalDiference)) {
                this.xdeltaDiference = this.xtotalDiference;
                this.ydeltaDiference = 0;
                this.zdeltaDiference = this.ztotalDiference;
                this.done = true;
            }
        }

        if(this.done) {
            this.scene.translate(this.xtotalDiference - 0.5, 0, this.ztotalDiference - 0.5);
        }
        else {
            this.scene.translate(this.xdeltaDiference - 0.5, this.ydeltaDiference, this.zdeltaDiference - 0.5);
        }
    }
}