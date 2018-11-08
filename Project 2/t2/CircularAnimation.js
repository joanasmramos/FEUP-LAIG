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
      super(totalTime, span);

      this.center = center;
      this.radius = radius;
      this.initialAngle = initialAngle;
      this.rotationalAngle = rotationalAngle;

      this.circular_length = (2 * Math.PI * this.radius) * this.rotationalAngle /360;
    }

    update(currTime) {
      if(currTime > this.totalTime)
        return;
      //        if(this.initialAngle > this.rotationalAngle)

      let deltaTime = currTime/this.totalTime - deltaT;

      let currAngle = this.rotationalAngle*this.deltaTime/span;

      mat4.identity(this.transformationMatrix);
      mat4.translate(this.transformationMatrix, this.transformationMatrix, this.center);
      mat4.rotateY(this.transformationMatrix, this.transformationMatrix, currAngle);
      mat4.rotateY(this.transformationMatrix, this.transformationMatrix, initialAngle);
      mat4.translate(this.transformationMatrix, this.matransformationMatrixtrix, [this.radius, 0, 0]);

      return;
    }


    }
