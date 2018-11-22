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
      this.initialAngle = initialAngle;
      this.rotationalAngle = rotationalAngle;
      this.curranimation_time = 0;
    }

     /**
     * Returns a LinearAnimation object with the same properties as this
     */
    clone(){
      var copy = new CircularAnimation(this.center, this.radius, this.initialAngle, this.rotationalAngle, this.totalTime);
      return copy;
    }

    animate() {
      if((this.curranimation_time < this.totalTime) || (this.currAngle < this.rotationalAngle)){

        if(this.curranimation_time <= 0){
          this.curranimation_time = this.deltaT;
          return;
        }

        if(this.totalTime < this.deltaT)
          this.deltaT = this.totalTime;

        this.curranimation_time += this.deltaT;

        return;
      }

    else return;
  }


      apply(){
        let degreetoRad = 0.0174532925;
        let currAngle = ((this.initialAngle + this.rotationalAngle/this.totalTime) * this.curranimation_time) * degreetoRad;

        let transformationMatrix = mat4.create();
        mat4.identity(transformationMatrix);
        mat4.translate(transformationMatrix, transformationMatrix, this.center);
        mat4.rotate(transformationMatrix, transformationMatrix, this.initialAngle, [0,1,0]);
        mat4.rotate(transformationMatrix, transformationMatrix, currAngle, [0,1,0]);

      return transformationMatrix;
      }

    }
