"use strict";
//Origin lies in one of the corners (most likely index 0 or 1)
//Scalars for the span of the cube
//                                               BOTTOM |  TOP
//              +------+   <<---- Link Shape    A,B,C,D | E,F,G,H
//              |\     |\
//              | +----+-+   +
//              | |    | |   |
//           +  +-+----+ |   | YVector
//    ZVector \  \|     \|   |
//             +  +------+   +
//                +------+
//                  XVector

function Cube(x,y,z)
{
  this.MODEL_POINT_NUMBER = 36;
  this.angles = [0,0,0];
  this.pos = [0,0,0];

  this.height = y;
  this.length = z;
  this.width = x;


  var XVector = x;
  var YVector = y;
  var ZVector = z;

  //All points are derived from origin, and the scalars of the spanning vector
  this.vertexColl =
  [                                   //              Index
    vec3(0,       0,       0),        //point A Origin  | 0
    vec3(XVector, 0,       0),        //point B         | 1
    vec3(XVector, 0, ZVector),        //point C         | 2
    vec3(0,       0, ZVector),        //point D         | 3

    vec3(0,       YVector,       0),  //point E         | 4
    vec3(XVector, YVector,       0),  //point F         | 5
    vec3(XVector, YVector, ZVector),  //point G         | 6
    vec3(0,       YVector, ZVector)   //point H         | 7
  ];

  //Create index array, for triangulizing the shape.
  this.indexColl =
  [
    1, 0, 3,
    3, 2, 1,
    2, 3, 7,
    7, 6, 2,
    3, 0, 4,
    4, 7, 3,
    6, 5, 1,
    1, 2, 6,
    4, 5, 6,
    6, 7, 4,
    5, 4, 0,
    0, 1, 5
  ];

  // this.colorColl = [];
  //
  // for(var i = 0; i < this.vertexColl.length; i++){
  //   this.colorColl.push(color);
  // }

  this.colorColl  = [
    vec4( 0.0, 0.5, 1.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
  ];

  for(var i = 0; i < this.vertexColl.length; i++){
    this.vertexColl[i][0] -= this.width/2;
    //this.vertexColl[i][1] -= this.height/2;
    this.vertexColl[i][2] -= this.length/2;
  }

  this.indexBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint8Array(this.indexColl), glContext.STATIC_DRAW);

  this.colorBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
  glContext.bufferData(glContext.ARRAY_BUFFER, flatten(this.colorColl), glContext.STATIC_DRAW);

  this.vertexBuffer = glContext.createBuffer();
  glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
  glContext.bufferData(glContext.ARRAY_BUFFER, flatten(this.vertexColl), glContext.STATIC_DRAW);

  this.draw = DrawCube
  this.modelMatrix = getModelMatrix;
}

function DrawCube(Vcolor, Vposition){
  glContext.enableVertexAttribArray(Vcolor);
  glContext.bindBuffer(glContext.ARRAY_BUFFER, this.colorBuffer);
  glContext.vertexAttribPointer(Vcolor, 3, glContext.FLOAT, false, 0, 0);

  glContext.enableVertexAttribArray(Vposition);
  glContext.bindBuffer(glContext.ARRAY_BUFFER, this.vertexBuffer);
  glContext.vertexAttribPointer(Vposition, 3, glContext.FLOAT, false, 0, 0);

  var ModelMatrix = this.modelMatrix();
  glContext.uniformMatrix4fv(modelMatrixUniform, false, flatten(ModelMatrix));

  glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  glContext.drawElements(glContext.TRIANGLES, this.MODEL_POINT_NUMBER, glContext.UNSIGNED_BYTE, 0);
}

function getModelMatrix(){
  return mult(mat4(), mult(rotationMatrix(this.angles), translate(this.pos[0], this.pos[1], this.pos[2]) ) );
}
function rotationMatrix(angles){
  var rx = rotate(angles[0], 1, 0, 0);
  var ry = rotate(angles[1], 0, 1, 0);
  var rz = rotate(angles[2], 0, 0, 1);
  return mult(rz, mult(ry, rx));
}
