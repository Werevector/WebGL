"use strict"

/**
 * Model for Pyramid
 *
 * @type {{InitPyramid, GetPoints, GetIndexArray, GetColorArray, GetNumberOfPoints}}
 */
var PyramidObject = (function() {

  var NUMBEROF_POINTS = 17;

  var points = [];
  var indexArray = [];
  var colorArray = [];

  function InitPyramid(a, b, c, d, h) {
    InitTriangles(a, b, c, d, h);
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

  function InitTriangles(a, b, c, d, h) {

    var vertices = [
      vec3(-0.5, -0.5, 0.5), //1
      vec3(0.5, -0.5, 0.5), //2
      vec3(0.5, -0.5, -0.5), //3
      vec3(-0.5, -0.5, -0.5), //4
      vec3(0, 0.5, 0), //5
    ];

    var vertexColors = [
      [0.0, 0.0, 1.0, 1.0], // black
      [1.0, 0.0, 0.0, 1.0], // red
      [1.0, 1.0, 0.0, 1.0], // yellow
      [0.0, 1.0, 0.0, 1.0], // green
      [0.0, 0.0, 0.0, 1.0], // blue
      [0.0, 0.0, 1.0, 1.0]  // white
    ];

    //The Pyramid consists of 6 triangles
    indexArray = [
      1, 2, 5,
      2, 3, 5,
      3, 4, 5,
      1, 4, 5,
      1, 2, 3,
      1, 4, 3
    ]

    var ci = 0; //color index
    for (var i = 0; i < indexArray.length; ++i) {

      points.push(vertices[indexArray[i] - 1]);
      if(i%3 === 0){ci++};
      colorArray.push(vertexColors[ci - 1]);

      // for solid colored faces use
      //colorArray.push(vertexColors[a]);
    }
  }

  return {
    InitPyramid: InitPyramid,
    GetPoints: GetPoints,
    GetIndexArray: GetIndexArray,
    GetColorArray: GetColorArray,
    GetNumberOfPoints: GetNumberOfPoints
  }

})();
