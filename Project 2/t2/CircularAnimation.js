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
      this.curranimatione_time = 0;


      this.transformationMatrix = mat4.create();
      this.circular_length = (2 * Math.PI * this.radius) * this.rotationalAngle /360;
    }

    calcRotationalTransformations(transMatrix, currAngle){
      mat4.identity(transMatrix);
      mat4.translate(transMatrix, transMatrix, this.center);
      mat4.rotateY(transMatrix), transMatrix, currAngle);
      mat4.rotateY(transMatrix, transMatrix, this.initialAngle);
      mat4.translate(transMatrix, transMatrix, [this.radius, 0, 0]);

      if(this.rotationalAngle < 0){
      mat4.rotateY(transMatrix, transMatrix, 180);
      }

    return transMatrix;
  }
    }

    update(currTime) {
      let radToDegree = 180 / Math.PI; // convert the angle to degrees
      let deltaTime = currTime/this.totalTime - deltaT;

      let currAngle = this.initialAngle + this.rotationalAngle*(this.deltaTime/this.totalTime)*radToDegree;

      if(currTime < this.totalTime){
        if(this.curranimatione_time <= 0){
          this.curranimatione_time = currTime;
          return this.transformationMatrix;
        }
        if(this.totalTime < deltaT)
          deltaT = this.totalTime;

        calcRotationalTransformations(this.transformationMatrix, currAngle);

        this.curranimatione_time += currTime;

        return this.transformationMatrix;
    }else return;

  }


    }
