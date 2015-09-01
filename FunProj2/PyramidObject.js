"use strict"

/**
 * Model for Pyramid
 *0
 * @type {{InitPyramid, GetPoints, GetIndexArray, GetColorArray, GetNumberOfPoints}}
 */
var PyramidObject = (function() {

  var NUMBEROF_POINTS = 18;

  var points = [];
  var indexArray = [];
  var colorArray = [];

  function InitPyramid() {
    InitTriangles();
  }

  function GetIndexArray() {
    return indexArray;
  }

  function GetPoints() {
    return points;
  }

  function GetColorArray() {
    return colorArray;
  }

  function GetNumberOfPoints() {
    return NUMBEROF_POINTS;
  }

  function InitTriangles() {

    // var vertices = [
    //   vec3(-0.5, -0.5, 0.5), //1
    //   vec3(0.5, -0.5, 0.5), //2
    //   vec3(0.5, -0.5, -0.5), //3
    //   vec3(-0.5, -0.5, -0.5), //4
    //   vec3(0, 0.5, 0), //5
    // ];

    points = [
      vec3(-0.5, -0.5, 0.5), //1
      vec3(0.5, -0.5, 0.5), //2
      vec3(0.5, -0.5, -0.5), //3
      vec3(-0.5, -0.5, -0.5), //4
      vec3(0, 0.5, 0), //5
    ];

    colorArray = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    ];

    //The Pyramid consists of 6 triangles
    indexArray = [
      0, 1, 4,
      1, 2, 4,
      2, 3, 4,
      0, 3, 4,
      0, 1, 2,
      0, 3, 2
    ];

    // var ci = 0; //color index
    // for (var i = 0; i < indexArray.length; ++i) {
    //
    //   points.push(vertices[indexArray[i]]);
    //   if(i%3 === 0){ci++};
    //   colorArray.push(vertexColors[ci]);
    //
    //   // for solid colored faces use
    //   //colorArray.push(vertexColors[a]);
    // }
  }

  return {
    InitPyramid: InitPyramid,
    GetPoints: GetPoints,
    GetIndexArray: GetIndexArray,
    GetColorArray: GetColorArray,
    GetNumberOfPoints: GetNumberOfPoints
  }

})();
