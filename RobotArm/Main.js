"use strict"

var glContext;

var Current_MAX;
var Current_IArr;
var Current_CArr;
var Current_VArr;

//var modelMatrix;
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

var keyboardState = [];

var vertexPosition;

var main = (function() {

  var browserCanvas;

  function init() {

    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 1100;
    browserCanvas.height = 1100;

    //Create the OpenGL context, to be used in the program
    glContext = WebGLUtils.setupWebGL(browserCanvas);
    if (!glContext) {
      alert("WebGl isn't available");
    }



    glContext.enable(glContext.DEPTH_TEST);

    //Set the viewport
    glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    glContext.clearColor(0.5, 0.5, 0.5, 1.0);

    //Load Shaders
    var program = initShaders(glContext,
      "Shaders/VertexShader.glsl",
      "Shaders/FragmentShader.glsl"
    );

    //Initialize atrribute buffers
    glContext.useProgram(program);


    robotBase = new RobotPart(new SquareClass(1, 0.2, 1));
    robotLowerArm = new RobotPart(new SquareClass(0.15, 0.9, 0.15));
    robotUpperArm = new RobotPart(new SquareClass(0.1, 0.6, 0.1));
    robotLeftFinger = new RobotPart(new SquareClass(0.05, 0.3, 0.05));
    robotRightFinger = new RobotPart(new SquareClass(0.05, 0.3, 0.05));

    robotOuterRFinger = new RobotPart(new SquareClass(0.05, 0.3, 0.05));
    robotOuterLFinger = new RobotPart(new SquareClass(0.05, 0.3, 0.05));

    vertexColor = glContext.getAttribLocation(program, "vColor");
    vertexPosition = glContext.getAttribLocation(program, "vPosition");

    modelMatrixUniform = glContext.getUniformLocation(program, "modelMatrix");
    viewMatrixUniform = glContext.getUniformLocation(program, "viewMatrix");
    solidColorUniform = glContext.getUniformLocation(program, "solidColor");

    projectionMatrix = ortho(-4, 4, -4, 4, -4, 4);
    projectionMatrixUniform = glContext.getUniformLocation(program, "projectionMatrix");
	  glContext.uniformMatrix4fv( projectionMatrixUniform,  false, flatten(projectionMatrix) );

    window.onkeydown = function(e){
    keyboardState[e.keyCode || e.which] = true;
    };
    window.onkeyup = function(e){
    keyboardState[e.keyCode || e.which] = false;
    };

    // robotBase.angles = [0,770,0];
    // robotLowerArm.angles = [0.0,0.0,0.0];
    // robotUpperArm.angles = [50,0,0];
    // robotLeftFinger.angles = [30,0,60];
    // robotRightFinger.angles = [30,0,-60];
    //
    // robotOuterRFinger.angles = [40, 0, -9];
    // robotOuterLFinger.angles = [40, 0, 9];

    //Innitial Rotation
    // robotBase.rotate([0,770,0]);
    // robotLowerArm.rotate([0,0,0]);
    // robotUpperArm.rotate([50,0,0]);
    // robotLeftFinger.rotate([30,0,60]);
    // robotRightFinger.rotate([30,0,-60]);
    // robotOuterRFinger.rotate([40,0,-9]);
    // robotOuterLFinger.rotate([40,0,9]);
    //
    // //Innitial Translation
    // robotLowerArm.translate(0, robotBase.height, 0);
    // robotUpperArm.translate(0, robotLowerArm.height, 0);
    //
    // robotLeftFinger.translate(0, robotUpperArm.height, 0);
    // robotOuterLFinger.translate(0, robotLeftFinger.height, 0);
    //
    // robotRightFinger.translate(0, robotUpperArm.height, 0);
    // robotOuterRFinger.translate(0, robotRightFinger.height, 0);
    //
    // //Innitial Chaining
    // robotLowerArm.addTransSet(robotBase.modelMatrix);
    // robotUpperArm.addTransSet(robotLowerArm.modelMatrix);
    //
    // robotLeftFinger.addTransSet(robotUpperArm.modelMatrix);
    // robotOuterLFinger.addTransSet(robotLeftFinger.modelMatrix);
    //
    //
    // robotOuterRFinger.addTransSet(robotRightFinger.modelMatrix);

    /////////////////////////////////////////////////////////////////////////
    robotBase.connect(robotLowerArm);
    robotLowerArm.connect(robotUpperArm);
    robotUpperArm.connect(robotLeftFinger);
    robotUpperArm.connect(robotRightFinger);
    robotLeftFinger.connect(robotOuterLFinger);
    robotRightFinger.connect(robotOuterRFinger);


    robotBase.rotate([0,0,0]);

    //robotLowerArm.addTransSet(robotBase.modelMatrix);
    robotLowerArm.translate(0, robotBase.partModel.height, 0);
    robotLowerArm.rotate([0,0,0]);

    //robotUpperArm.addTransSet(robotLowerArm.modelMatrix);
    robotUpperArm.translate(0, robotLowerArm.partModel.height, 0);
    robotUpperArm.rotate([50,0,0]);

    //robotLeftFinger.addTransSet(robotUpperArm.modelMatrix);
    robotLeftFinger.translate(0, robotUpperArm.partModel.height, 0);
    robotLeftFinger.rotate([30,0,60]);

    //robotOuterLFinger.addTransSet(robotLeftFinger.modelMatrix);
    robotOuterLFinger.translate(0, robotLeftFinger.partModel.height, 0);
    robotOuterLFinger.rotate([30,0,-60]);

    //robotRightFinger.addTransSet(robotUpperArm.modelMatrix);
    robotRightFinger.translate(0, robotUpperArm.partModel.height, 0);
    robotRightFinger.rotate([40,0,-9]);

    //robotOuterRFinger.addTransSet(robotRightFinger.modelMatrix);
    robotOuterRFinger.translate(0, robotRightFinger.partModel.height, 0);
    robotOuterRFinger.rotate([40,0,9]);
    render();
  }

  //Render the whole thing
  function render() {
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    solidColor = vec4(0.0, 1.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));


    // robotBase.rotate(robotBase.angles);
    // robotBase.draw(vertexColor, vertexPosition);


    ////////////********************\\\\\\\\\\\\\\\\\\
    //
    // modelMatrix = rotationMatrix(robotBase.angles);
    robotBase.draw(vertexColor, vertexPosition);
    //
    solidColor = vec4(1.0, 0.0, 0.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    //
    // modelMatrix = mult(modelMatrix, translate(0, robotBase.height, 0));
    // modelMatrix = mult(modelMatrix, rotationMatrix(robotLowerArm.angles));
    robotLowerArm.draw(vertexColor, vertexPosition);
    //
    solidColor = vec4(0.0, 0.0, 1.0, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    //
    // modelMatrix = mult(modelMatrix, translate(0, robotLowerArm.height,0));
    // modelMatrix = mult(modelMatrix, rotationMatrix(robotUpperArm.angles));
    robotUpperArm.draw(vertexColor, vertexPosition);
    //
    //
    // modelMatrix = mult(modelMatrix, translate(0, robotUpperArm.height,0));
    //
    solidColor = vec4(0.4, 0.0, 0.3, 1.0);
    glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    // var modelMatrix2 = mult(modelMatrix, rotationMatrix(robotLeftFinger.angles));
    robotLeftFinger.draw(vertexColor, vertexPosition);
    //
    // modelMatrix2 = mult(modelMatrix2, translate(0, robotRightFinger.height,0));
    // modelMatrix2 = mult(modelMatrix2, rotationMatrix(robotOuterRFinger.angles));
    robotOuterLFinger.draw(vertexColor, vertexPosition);
    //
    // glContext.uniform4fv(solidColorUniform, flatten(solidColor));
    // var modelMatrix = mult(modelMatrix, rotationMatrix(robotRightFinger.angles));
    robotRightFinger.draw(vertexColor, vertexPosition);
    //
    // modelMatrix = mult(modelMatrix, translate(0, robotLeftFinger.height,0));
    // modelMatrix = mult(modelMatrix, rotationMatrix(robotOuterLFinger.angles));
    robotOuterRFinger.draw(vertexColor, vertexPosition);


    HandleKeyboardState();
    requestAnimFrame(render);
  }

  function rotationMatrix(angles){
    var rx = rotate(angles[0], 1, 0, 0);
    var ry = rotate(angles[1], 0, 1, 0);
    var rz = rotate(angles[2], 0, 0, 1);
    return mult(rz, mult(ry, rx));
  }

  function HandleKeyboardState(){
    // W
    if(keyboardState[87]){
      if(robotLowerArm.angles[0]<50)
      {
        robotLowerArm.angles[0] += robotSpeed;
        robotLowerArm.rotate([1,0,0]);
      }
    }
    // S
    if(keyboardState[83]){
      if(robotLowerArm.angles[0]>0)
      {
        robotLowerArm.angles[0] -= robotSpeed;
        robotLowerArm.rotate([-1,0,0]);
      }
    }
    // UP
    if(keyboardState[38]){
      if(robotUpperArm.angles[0] < 90)
      {
        robotUpperArm.angles[0] += robotSpeed;
        robotUpperArm.rotate([1,0,0]);
      }
    }
    //DOWN
    if(keyboardState[40]){
      if(robotUpperArm.angles[0] > 0)
      {
        robotUpperArm.angles[0] -= robotSpeed;
        robotUpperArm.rotate([-1,0,0]);
      }
    }
    //A
    if(keyboardState[65]){
      robotBase.angles[1] += robotSpeed;
      robotBase.rotate([0,1,0]);
    }
    //D
    if(keyboardState[68]){
      robotBase.angles[1] -= robotSpeed;
      robotBase.rotate([0,-1,0]);
    }
    //Q
    if(keyboardState[81]){
      if(robotOuterRFinger.angles[2]<-10)
      {
        robotRightFinger.angles[2] -= robotSpeed/5;
        robotLeftFinger.angles[2] += robotSpeed/5;

        robotRightFinger.rotate[0,0,-1];
        robotLeftFinger.rotate[0,0,1];

        robotOuterRFinger.angles[2] += robotSpeed;
        robotOuterLFinger.angles[2] -= robotSpeed;

        robotOuterRFinger.rotate([0,0,1]);
        robotOuterLFinger.rotate([0,0,-1]);
      }
    }
    //E
    if(keyboardState[69]){
      if(robotOuterRFinger.angles[2]>-70)
      {
        robotRightFinger.angles[2] += robotSpeed/5;
        robotLeftFinger.angles[2] -= robotSpeed/5;

        robotRightFinger.rotate[0,0,1];
        robotLeftFinger.rotate[0,0,-1];


        robotOuterRFinger.angles[2] -= robotSpeed;
        robotOuterLFinger.angles[2] += robotSpeed;

        robotOuterRFinger.rotate([0,0,-1]);
        robotOuterLFinger.rotate([0,0,1]);
      }
    }
  }

  return {
    init: init
  }
})();
