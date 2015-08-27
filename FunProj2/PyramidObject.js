"use strict"

/**
 * Model for Pyramid
 *
 * @type {{InitPyramid, GetPoints, GetIndexArray, GetColorArray, GetNumberOfPoints}}
 */
var PyramidObject = (function () {

  var NUMBEROF_POINTS = 17;

  var points = [];
  var indexArray = [];
  var colorArray = [];

  function InitPyramid(){
    InitTriangles();
  }

  function GetIndexArray(){
    return indexArray;
  }
  function GetPoints(){
    return points;
  }
  function GetColorArray(){
    return colorArray;
  }
  function GetNumberOfPoints(){
    return NUMBEROF_POINTS;
  }

  function InitTriangles(){

    var vertices = [
            vec3( -0.5, -0.5,  0.5 ), //1
            vec3(  0.5, -0.5,  0.5 ), //2
            vec3(  0.5, -0.5, -0.5 ), //3
            vec3( -0.5, -0.5, -0.5 ), //4
            vec3(    0,  0.5,    0 ), //5
        ];

    var vertexColors = [
            [0.0, 0.0, 0.0, 1.0],  // black
            [1.0, 0.0, 0.0, 1.0],  // red
            [1.0, 1.0, 0.0, 1.0],  // yellow
            [0.0, 1.0, 0.0, 1.0],  // green
            [0.0, 0.0, 1.0, 1.0],  // blue
        ];

    //The Pyramid consists of 6 triangles
    indexArray = [
          1,2,5,
          2,3,5,
          3,4,5,
          1,4,5,
          1,2,3,
          1,4,3
    ]

    for (var i = 0; i < indexArray.length; ++i) {

        points.push(vertices[indexArray[i]-1]);
        colorArray.push(vertexColors[indexArray[i]-1] );

        // for solid colored faces use
        //colorArray.push(vertexColors[a]);
    }
  }

  return{
    InitPyramid: InitPyramid,
    GetPoints: GetPoints,
    GetIndexArray: GetIndexArray,
    GetColorArray: GetColorArray,
    GetNumberOfPoints: GetNumberOfPoints
  }

})();
