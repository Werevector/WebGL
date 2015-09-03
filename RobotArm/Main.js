"use strict"

var glContext;

var Current_MAX;
var Current_IArr;
var Current_CArr;
var Current_VArr;

var modelMatrix;
var modelMatrixUniform;

var viewMatrix;
var viewMatrixUniform;

var projectionMatrix;
var projectionMatrixUniform;

var solidColor;
var solidColorUniform;

var robotSpeed = 5;

var robotBase;
var robotLowerArm;
var robotUpperArm;
var robotLeftFinger;
var robotRightFinger;
var robotOuterRFinger;
var robotOuterLFinger;

var time = 0;

var vertexColor ;

var vertexPosition;

var main = (function() {

  var browserCanvas;

  function init() {

    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 600;
    browserCanvas.height = 600;

    //Create the OpenGL context, to be used in the program
    glContext = WebGLUtils.setupWebGL(browserCanvas);
    if (!glContext) {
      alert("WebGl isn't available");
    }



    glContext.enable(glContext.DEPTH_TEST);

    //Set the viewport
    glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    glContext.clearColor(1.0, 1.0, 1.0, 1.0);

    //Load Shaders
    var program = initShaders(glContext,
      "Shaders/VertexShader.glsl",
      "Shaders/FragmentShader.glsl"
    );

    //Initialize atrribute buffers
    glContext.useProgram(program);


    robotBase = new SquareClass(1, 0.1, 1);
    robotLowerArm = new SquareClass(0.1, 0.9, 0.1);
    robotUpperArm = new SquareClass(0.1, 0.6, 0.1);
    robotLeftFinger = new SquareClass(0.05, 0.3, 0.05);
    robotRightFinger = new SquareClass(0.05, 0.3, 0.05);

    robotOuterRFinger = new SquareClass(0.05, 0.3, 0.05);
    robotOuterLFinger = new SquareClass(0.05, 0.3, 0.05);

    vertexColor = glContext.getAttribLocation(program, "vColor");
    vertexPosition = glContext.getAttribLocation(program, "vPosition");

    modelMatrixUniform = glContext.getUniformLocation(program, "modelMatrix");
    viewMatrixUniform = glContext.getUniformLocation(program, "viewMatrix");
    solidColorUniform = glContext.getUniformLocation(program, "solidColor");

    projectionMatrix = ortho(-2, 2, -2, 2, -2, 2);
    projectionMatrixUniform = glContext.getUniformLocation(program, "projectionMatrix");
	  glContext.uniformMatrix4fv( projectionMatrixUniform,  false, flatten(projectionMatrix) );


    window.onkeydown = function(event)
    {
      var key = String.fromCharCode(event.keyCode);

      switch(key)
      {
        case 'W':
          if(robotLowerArm.angles[0]<50)
          {
            robotLowerArm.angles[0] += robotSpeed;
          }
          break;
        case 'S':

          if(robotLowerArm.angles[0]>0)
          {
            robotLowerArm.angles[0] -= robotSpeed;
          }
          break;
        case '&':
          if(robotUpperArm.angles[0] < 90)
          {
            robotUpperArm.angles[0] += robotSpeed;
          }
          break;
        case '(':
          if(robotUpperArm.angles[0] > 0)
          {
            robotUpperArm.angles[0] -= robotSpeed;
          }
          break;
        case 'A':
          robotBase.angles[1] += robotSpeed;
          break;
        case 'D':
          robotBase.angles[1] -= robotSpeed;
          break;
        case 'Q':
          if(robotOuterRFinger.angles[2]<-10)
          {
            robotRightFinger.angles[2] -= robotSpeed/5;
            robotLeftFinger.angles[2] += robotSpeed/5;

            robotOuterRFinger.angles[2] += robotSpeed;
            robotOuterLFinger.angles[2] -= robotSpeed;
          }
          break;
        case 'E':
          if(robotOuterRFinger.angles[2]>-70)
          {
            robotRightFinger.angles[2] += robotSpeed/5;
            robotLeftFinger.angles[2] -= robotSpeed/5;

            robotOuterRFinger.angles[2] -= robotSpeed;
            robotOuterLFinger.angles[2] += robotSpeed;
          }
          break;

      }
    };


    robotBase.angles = [0,770,0];
    robotLowerArm.angles = [0.0,0.0,0.0];
    robotUpperArm.angles = [50,0,0];
    robotLeftFinger.angles = [30,0,60];
    robotRightFinger.angles = [30,0,-60];

    robotOuterRFinger.angles = [40, 0, -9];
    robotOuterLFinger.angles = [40, 0, 9];

    render();
  }

  //Render the whole thing
  function render() {
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    solidColor = vec4(0.0, 1.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = rotationMatrix(robotBase.angles);
    robotBase.draw(modelMatrix, vertexColor, vertexPosition);

    solidColor = vec4(1.0, 0.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = mult(modelMatrix, translate(0, robotBase.height, 0));
    modelMatrix = mult(modelMatrix, rotationMatrix(robotLowerArm.angles));
    robotLowerArm.draw(modelMatrix, vertexColor, vertexPosition);

    solidColor = vec4(0.0, 0.0, 1.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = mult(modelMatrix, translate(0, robotLowerArm.height,0));
    modelMatrix = mult(modelMatrix, rotationMatrix(robotUpperArm.angles));
    robotUpperArm.draw(modelMatrix, vertexColor, vertexPosition);


    modelMatrix = mult(modelMatrix, translate(0, robotUpperArm.height,0));
    //modelMatrix = mult(modelMatrix, translate(0, robotUpperArm.height,robotUpperArm.width));
    solidColor = vec4(0.4, 0.0, 0.3, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    var modelMatrix2 = mult(modelMatrix, rotationMatrix(robotLeftFinger.angles));
    robotLeftFinger.draw(modelMatrix2, vertexColor, vertexPosition);

    modelMatrix2 = mult(modelMatrix2, translate(0, robotRightFinger.height,0));
    modelMatrix2 = mult(modelMatrix2, rotationMatrix(robotOuterRFinger.angles));
    robotOuterRFinger.draw(modelMatrix2, vertexColor, vertexPosition);

    //solidColor = vec4(1.0, 0.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    var modelMatrix = mult(modelMatrix, rotationMatrix(robotRightFinger.angles));
    robotRightFinger.draw(modelMatrix, vertexColor, vertexPosition);

    modelMatrix = mult(modelMatrix, translate(0, robotLeftFinger.height,0));
    modelMatrix = mult(modelMatrix, rotationMatrix(robotOuterLFinger.angles));
    robotOuterRFinger.draw(modelMatrix, vertexColor, vertexPosition);


    time += 0.1;
    // robotBase.angles[0] += 0.5;
    // robotBase.angles[1] += 0.5;
    // robotBase.angles[2] += 0.5;






    robotLowerArm.angles[0] += 0;

    //robotUpperArm.angles[0] += Math.sin(time)*1;
    // robotUpperArm.angles[1] += Math.sin(time)*time/2;
    // robotUpperArm.angles[2] += Math.sin(time)*time/2;

  //  robotLowerArm.angles[0] += Math.cos(time)*5;

    // robotRightFinger.angles[2] += Math.sin(time);
    // robotLeftFinger.angles[2] -= Math.sin(time);
    //
    // robotOuterRFinger.angles[2] += Math.cos(time);
    // robotOuterLFinger.angles[2] -= Math.cos(time);

    requestAnimFrame(render);
  }

  function rotationMatrix(angles){
    var rx = rotate(angles[0], 1, 0, 0);
    var ry = rotate(angles[1], 0, 1, 0);
    var rz = rotate(angles[2], 0, 0, 1);
    return mult(rz, mult(ry, rx));
  }

  return {
    init: init
  }
})();
