"use strict";
var ArmSegment = (function()
{

  var MODEL_POINT_NUMBER = 36;

  var vertexColl = [];
  var indexColl = [];
  var colorColl = [];


  //Origin lies in one of the corners (most likely index 0 or 1)
  //Scalars for the span of the cube
  var XVector;
  var YVector;
  var ZVector;
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


  //Use indexing to create the base points for the shape, and then create
  //triangles to form the shape
  function GenerateLinkPoints(x,y,z){
    XVector = x;
    YVector = y;
    ZVector = z;

    //All points are derived from origin, and the scalars of the spanning vector
    vertexColl =
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
    indexColl =
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

    colorColl  = [
      vec4( 0.0, 0.5, 1.0, 1.0 ),  // black
      vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
      vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
      vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
      vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
      vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
      vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
      vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
    ];
  }

  function GetVertexCount(){
    return MODEL_POINT_NUMBER;
  }

  function GetVertexColl(){
    return vertexColl;
  }

  function GetIndexColl(){
    return indexColl;
  }

  function GetColorColl(){
    return colorColl;
  }

  return{
    GenerateLinkPoints: GenerateLinkPoints,
    GetVertexCount: GetVertexCount,
    GetVertexColl: GetVertexColl,
    GetIndexColl: GetIndexColl,
    GetColorColl: GetColorColl
  }

}) ();
