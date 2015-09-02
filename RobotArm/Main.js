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

var robotBase;
var robotLowerArm;
var robotUpperArm;

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
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);

    //Load Shaders
    var program = initShaders(glContext,
      "Shaders/VertexShader.glsl",
      "Shaders/FragmentShader.glsl"
    );

    //Initialize atrribute buffers
    glContext.useProgram(program);


    robotBase = new SquareClass(1, 0.2, 1);
    robotLowerArm = new SquareClass(0.2, 1, 0.2);
    robotUpperArm = new SquareClass(0.1, 1, 0.1);

    vertexColor = glContext.getAttribLocation(program, "vColor");
    vertexPosition = glContext.getAttribLocation(program, "vPosition");

    modelMatrixUniform = glContext.getUniformLocation(program, "modelMatrix");
    viewMatrixUniform = glContext.getUniformLocation(program, "viewMatrix");
    solidColorUniform = glContext.getUniformLocation(program, "solidColor");

    projectionMatrix = ortho(-2, 2, -2, 2, -2, 2);
    projectionMatrixUniform = glContext.getUniformLocation(program, "projectionMatrix");
	  glContext.uniformMatrix4fv( projectionMatrixUniform,  false, flatten(projectionMatrix) );



    robotBase.angles = [0,0,0];
    robotLowerArm.angles = [0.0,0.0,0.0];
    robotUpperArm.angles = [0,0,0];

    render();
  }

  //Render the whole thing
  function render() {
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    solidColor = vec4(0.0, 0.0, 1.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = rotationMatrix(robotBase.angles);
    robotBase.draw(modelMatrix, vertexColor, vertexPosition);

    solidColor = vec4(0.0, 1.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = mult(modelMatrix, translate(0, robotBase.height, 0));
    modelMatrix = mult(modelMatrix, rotationMatrix(robotLowerArm.angles));
    robotLowerArm.draw(modelMatrix, vertexColor, vertexPosition);

    solidColor = vec4(1.0, 0.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));

    modelMatrix = mult(modelMatrix, translate(0, robotLowerArm.height,0));
    modelMatrix = mult(modelMatrix, rotationMatrix(robotUpperArm.angles));
    robotUpperArm.draw(modelMatrix, vertexColor, vertexPosition);

    time += 0.1;
    robotBase.angles[0] += 0.2;
    robotBase.angles[1] += 0.2;
    robotBase.angles[2] += 0.2;
    robotLowerArm.angles[0] += 0;
    robotUpperArm.angles[0] += Math.sin(time)*time/2;
    robotUpperArm.angles[1] += Math.sin(time)*time/2;
    robotUpperArm.angles[2] += Math.sin(time)*time/2;

      robotLowerArm.angles[0] += Math.cos(time)*time;

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
