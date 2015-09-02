"use strict";
var CylinderIVers = (function()
{

  var MODEL_POINT_NUMBER;

  var vertexColl = [];
  var indexColl = [];
  var colorColl = [];
  var vertexCollt = [];

  //
  //          ┏────┓ *
  //          ┃||||┃ |
  //          ┃||||┃ |
  //          ┃||||┃ | -- Height
  //          ┃||||┃ |
  //          ┃||||┃ |
  //          ┃||||┃ |
  //          ┃||||┃ |
  //          ┗────┛ *
  //          *||||*
  //         Resolution (Number of rectangles on the sides)
  //

  function GeneratePoints(height, radius, resolution){

    MODEL_POINT_NUMBER = (resolution*2)+resolution;

    var theta = (2*Math.PI) / resolution;
    var c = Math.cos(theta);
    var s = Math.sin(theta);
    var t;

    var x = radius;
    var z = 0;

    vertexColl.push( vec3(0,0,0) );

    // for(var i = 0; i < resolution; i++)
    // {
    //
    //   vertexCollt.push( vec3(x, 0, z) );
    //
    //   t = x;
    //   x = c * x - s * z;
    //   z = s * t + c * z;
    // }

    // for(var i = 0; i < 12; i++){
    //   colorColl.push( vec4(1.0, 1.0, 1.0, 1.0) );
    // }
    // for(var i = 0; i < resolution-1; i++){
    //   indexColl.push([0,i+1,i+2]);
    // }
    //
    // for(var i = 0; i < resolution-1; i++){
    //   vertexColl.push(vertexCollt[indexColl[i]]);
    // }
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
    GeneratePoints: GeneratePoints,
    GetVertexCount: GetVertexCount,
    GetVertexColl: GetVertexColl,
    GetIndexColl: GetIndexColl,
    GetColorColl: GetColorColl
  }
}) ();
