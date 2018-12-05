/**
 * Apply circular animations to an object
 * @augments Animation
 */

class CircularAnimation extends Animation {
    /**
     * Constructor
     * @param {Center of the circular animation} center
     * @param {Radius of the circular animation} radius
     * @param {Starting angle for the animation} initialAngle
     * @param {Total rotation angle for the animation} rotationalAngle
     * @param {Total duration of the circular animation} totalTime
     */
    constructor(center, radius, initialAngle, rotationalAngle, totalTime){
      super(totalTime);

      this.center = center;
      this.radius = radius;
      this.initialAngle = (Math.PI * initialAngle) / 180; //degrees to radians
      this.rotationalAngle = (Math.PI * rotationalAngle) / 180; //degrees to radians
      this.rotate = 0;
      this.deltaAngle = 0;

    }

     /**
     * Returns a LinearAnimation object with the same properties as this
     */
    clone(){
      let initialAngle = (this.initialAngle * 180) / Math.PI; //radians to degrees
      let rotationalAngle = (this.rotationalAngle * 180) / Math.PI //radians to degrees 
      var copy = new CircularAnimation(this.center, this.radius, initialAngle, rotationalAngle, this.totalTime);
      return copy;
    }

    /**
     * Calculates delta angle
     */
    calcDeltaAngle() {
      if(this.deltaT != null) {
        this.deltaAngle = (this.rotationalAngle * this.deltaT) / this.totalTime;
      }
    }

    animate() {
    }

    apply(){
      if(!this.done) {
        this.calcDeltaAngle();
        this.rotate += this.deltaAngle;
        if(Math.abs(this.rotate) > Math.abs(this.rotationalAngle)) {
          this.rotate = this.rotationalAngle;
          this.done = true;
          this.rotationAngle = this.rotationalAngle;
        }
      }

      let result = mat4.create();
      mat4.identity(result);

      mat4.translate(result, result, this.center);
      mat4.rotate(result, result, this.rotate, [0, 1, 0]);
      mat4.rotate(result, result, this.initialAngle, [0, 1, 0]);
      mat4.translate(result, result, [this.radius, 0, 0]);

      return result;
    }

}
