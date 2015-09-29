

function mySphere(longitudes, latitudes)
{

  this.points = [];
  this.normals = [];
  this.texturePoints = [];
  this.indexData = [];
  this.NUMBER_OF_POINTS = 0;

  this.init = function() {
    for (var latNumber = 0; latNumber <= latitudes; latNumber++) {
      var theta = latNumber * Math.PI / latitudes;
      var sinTheta = Math.sin(theta);
      var cosTheta = Math.cos(theta);

      for (var longNumber = 0; longNumber <= longitudes; longNumber++) {
        var phi = longNumber * 2 * Math.PI / longitudes;
        var sinPhi = Math.sin(phi);
        var cosPhi = Math.cos(phi);

        var x = cosPhi * sinTheta;
        var y = cosTheta;
        var z = sinPhi * sinTheta;
        var u = 1 - (longNumber / longitudes);
        var v = 1 - (latNumber / longitudes);

        this.normals.push(vec3(x,y,z));
        // this.normals.push(x);
        // this.normals.push(y);
        // this.normals.push(z);
        this.texturePoints.push(vec2(u,v));
        // this.texturePoints.push(u);
        // this.texturePoints.push(v);
        // this.points.push(1 * x);
        // this.points.push(1 * y);
        // this.points.push(1 * z);
        this.points.push(vec4(x,y,z,1.0));
      }
    }

    for (var latNumber = 0; latNumber < latitudes; latNumber++) {
      for (var longNumber = 0; longNumber < longitudes; longNumber++) {
        var first = (latNumber * (longitudes + 1)) + longNumber;
        var second = first + longitudes + 1;
        this.indexData.push(first);
        this.indexData.push(second);
        this.indexData.push(first + 1);

        this.indexData.push(second);
        this.indexData.push(second + 1);
        this.indexData.push(first + 1);
      }
    }

    for(var i = 0; i < this.indexData.length; i++){
      if(this.indexData[i] > 288){
        console.log("outside");
      }
    }

  }

  this.init();
  this.NUMBER_OF_POINTS = this.indexData.length / 3;

};
