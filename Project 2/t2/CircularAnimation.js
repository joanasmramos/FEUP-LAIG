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
    constructor(id, center, radius, initialAngle, rotationalAngle, totalTime){
      super(id, totalTime);

      this.center = center;
      this.radius = radius;
      this.initialAngle = initialAngle;
      this.rotationalAngle = rotationalAngle;
      this.curranimation_time = 0;


      this.transformationMatrix = mat4.create();
  //    this.circular_length = (2 * Math.PI * this.radius) * this.rotationalAngle /360;
    }

    calcRotationalTransformations(transMatrix, currAngle){
      mat4.identity(transMatrix);
      mat4.translate(transMatrix, transMatrix, this.center);
      mat4.rotateY(transMatrix, transMatrix, currAngle);
      mat4.rotateY(transMatrix, transMatrix, this.initialAngle);
      mat4.translate(transMatrix, transMatrix, [this.radius, 0, 0]);

      if(this.rotationalAngle < 0){
      mat4.rotateY(transMatrix, transMatrix, 180);
      }

    return transMatrix;
  }


    animate() {
      let radToDegree = 180 / Math.PI; // convert the angle to degrees

      let currAngle = this.initialAngle + this.rotationalAngle*(this.deltaT/this.totalTime)*radToDegree;

      if(this.deltaT < this.totalTime){
        if(this.curranimation_time <= 0){
          this.curranimation_time = this.deltaT;
          return this.transformationMatrix;
        }
        if(this.totalTime < this.deltaT)
          this.deltaT = this.totalTime;
        //  console.log(transformationMatrix);
        //calcRotationalTransformations(transformationMatrix, currAngle);

        this.curranimation_time += this.deltaT;

        return this.transformationMatrix;
      }

    else return;
  }


    }
