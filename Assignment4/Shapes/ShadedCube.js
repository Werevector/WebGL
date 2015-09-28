/**
 * Created by endre on 10.09.15.
 */

function ShadedCube() {

  this.points = [];
  this.colors = [];
  this.surfaceNormals = [];
  this.numVertices = 36;
  this.texCoords = [];

  var tcoords = [
    vec2(0, 0),
    vec2(0, 2),
    vec2(2, 2),
    vec2(2, 0)
  ];


  // this.lm_Vars = {
  //   lightPosition: vec4(0.0, 0.0, 0.0, 0.0 ),
  //   lightAmbient: vec4(0.2, 0.2, 0.2, 1.0 ),
  //   lightDiffuse: vec4( 1.0, 1.0, 1.0, 1.0 ),
  //   lightSpecular: vec4( 1.0, 1.0, 1.0, 1.0 ),
  //
  //   materialAmbient: vec4( 1.0, 0.0, 1.0, 1.0 ),
  //   materialDiffuse: vec4( 1.0, 0.8, 0.0, 1.0),
  //   materialSpecular: vec4( 1.0, 0.8, 0.0, 1.0 ),
  //   materialShininess: 100.0
  // };


  // this.ambientProduct = mult(this.lm_Vars.lightAmbient, this.lm_Vars.materialAmbient);
  // this.diffuseProduct = mult(this.lm_Vars.lightDiffuse, this.lm_Vars.materialDiffuse);
  // this.specularProduct = mult(this.lm_Vars.lightSpecular, this.lm_Vars.materialSpecular);


  //
  // var lightPosition = vec4(1.0, 1.0, 1.0, 0.0 );
  // var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0 );
  // var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
  // var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
  //
  // var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
  // var materialDiffuse = vec4( 1.0, 0.8, 0.0, 1.0);
  // var materialSpecular = vec4( 1.0, 0.8, 0.0, 1.0 );
  // var materialShininess = 100.0;
  //
  // var ambientColor, diffuseColor, specularColor;


  var vertices = [
    vec4(-0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, 0.5, 0.5, 1.0),
    vec4(0.5, 0.5, 0.5, 1.0),
    vec4(0.5, -0.5, 0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5, 0.5, -0.5, 1.0),
    vec4(0.5, 0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
  ];

  var vertexColors = [
    [0.0, 0.0, 0.0, 1.0], // black
    [1.0, 0.0, 0.0, 1.0], // red
    [1.0, 1.0, 0.0, 1.0], // yellow
    [0.0, 1.0, 0.0, 1.0], // green
    [0.0, 0.0, 1.0, 1.0], // blue
    [1.0, 0.0, 1.0, 1.0], // magenta
    [0.0, 1.0, 1.0, 1.0], // cyan
    [1.0, 1.0, 1.0, 1.0] // white
  ];

  var faces = [
    [1, 0, 3, 2],
    [2, 3, 7, 6],
    [3, 0, 4, 7],
    [6, 5, 1, 2],
    [4, 5, 6, 7],
    [5, 4, 0, 1]
  ];

  // We need to partition the quad into two triangles in order for
  // WebGL to be able to render it.  In this case, we create two
  // triangles from the quad indices

  //vertex color assigned by the index of the vertex

  // for (var f = 0; f < faces.length; ++f) {
  //   var a = faces[f][0];
  //   var b = faces[f][1];
  //   var c = faces[f][2];
  //   var d = faces[f][3];
  //
  //   var indices = [a, b, c, a, c, d];
  //
  //   for (var i = 0; i < indices.length; ++i) {
  //     this.points.push(vertices[indices[i]]);
  //     //colors.push( vertexColors[indices[i]] );
  //
  //     // for solid colored faces use
  //     this.colors.push(vertexColors[a]);
  //   }
  // }


  this.quad = function(a, b, c, d){

     var t1 = subtract(vertices[b], vertices[a]);
     var t2 = subtract(vertices[c], vertices[b]);
     var normal = cross(t1, t2);
     var normal = vec3(normal);


     this.points.push(vertices[a]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[0]);

     this.points.push(vertices[b]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[1]);

     this.points.push(vertices[c]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[2]);

     this.points.push(vertices[a]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[0]);

     this.points.push(vertices[c]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[2]);

     this.points.push(vertices[d]);
     this.surfaceNormals.push(normal);
     this.texCoords.push(tcoords[3]);
  }

  this.quad( 1, 0, 3, 2 );
  this.quad( 2, 3, 7, 6 );
  this.quad( 3, 0, 4, 7 );
  this.quad( 6, 5, 1, 2 );
  this.quad( 4, 5, 6, 7 );
  this.quad( 5, 4, 0, 1 );




  //this.surfaceNormals = generateSurfaceNormals(this.points);

}
