"use strict"

var glContext;

var modelMatrix;
var modelMatrixUniform;

var viewMatrix;
var viewMatrixUniform;

var projectionMatrix;
var projectionMatrixUniform;

var vertexColor;
var vertexPosition;

var keyboardState = [];

var keyboardStateX = new THREEx.KeyboardState();

var time = 0;
var tDelta;

var objectColl = [];

// var cPos = vec3(0,0,5);
// var lookDir = vec3(0,0,-1);
// var cLook = add(cPos, lookDir);
// var cUp = vec3(0,1,0);

var camera;
var cameraSpeed = 10;

var floatingCube;

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

    for(var i = 0; i < 10; i++){
      objectColl.push(new Cube(2,20,2));
      objectColl[i].pos = [Math.floor(i/5)*10, 0, (i%5)*10]
    }
    //floatingCube = new Cube(1,1,1)

    camera = new Camera();
    camera.position[2] = -5;
    glContext.enable(glContext.DEPTH_TEST);

    //Set the viewport
    glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    glContext.clearColor(0.0, 0.0, 0.0, 1.0);

    //Load Shaders
    var program = initShaders(glContext,
      "vertex-shader",
      "fragment-shader"
    );

    //Initialize atrribute buffers
    glContext.useProgram(program);

    var ntime = Date.now() / 1000;
	  tDelta = ntime - time;
	  time = ntime;

    vertexColor = glContext.getAttribLocation(program, "vColor");
    vertexPosition = glContext.getAttribLocation(program, "vPosition");

    modelMatrixUniform = glContext.getUniformLocation(program, "modelMatrix");
    viewMatrixUniform = glContext.getUniformLocation(program, "viewMatrix");
    projectionMatrixUniform = glContext.getUniformLocation(program, "projectionMatrix");

    projectionMatrix = perspective(70, 1, 0.1, 1000);
	  glContext.uniformMatrix4fv( projectionMatrixUniform,  false, flatten(projectionMatrix) );

    viewMatrix = camera.getCameraView(tDelta);
    glContext.uniformMatrix4fv(viewMatrixUniform, false, flatten(viewMatrix));

    window.onkeydown = function(e){
    keyboardState[e.keyCode || e.which] = true;
    };
    window.onkeyup = function(e){
    keyboardState[e.keyCode || e.which] = false;
    };


    render();
  }

  //Render the whole thing
  function render() {
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);

    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

    HandleKeyboardState();


    viewMatrix = camera.getCameraView(tDelta);
    glContext.uniformMatrix4fv(viewMatrixUniform, false, flatten(viewMatrix));


    //floatingCube.angles[0]++;
    //floatingCube.angles[2]++;

    for(var i = 0; i < objectColl.length; i++){
      //objectColl[i].angles[0]++;
      objectColl[i].draw(vertexColor, vertexPosition);
    }
    //floatingCube.draw(vertexColor, vertexPosition);

    requestAnimFrame(render);
  }

  function HandleKeyboardState(){
    // W
    if(keyboardState[87]){
      if(true)
      {
        camera.position = add(camera.position, scale(cameraSpeed*tDelta, camera.viewVector));

      }
    }
    // S
    if(keyboardState[83]){
      if(true)
      {
      camera.position = subtract(camera.position, scale(cameraSpeed*tDelta, camera.viewVector));

      }
    }

    // UP
    // if(keyboardState[38]){
    //   if(robotUpperArm.angles[0] < 90)
    //   {
    //     robotUpperArm.angles[0] += robotSpeed;
    //   }
    // }

    //DOWN
    // if(keyboardState[40]){
    //   if(robotUpperArm.angles[0] > 0)
    //   {
    //     robotUpperArm.angles[0] -= robotSpeed;
    //   }
    // }

    //A
    if(keyboardState[65]){
      camera.position = add(camera.position, scale(cameraSpeed*tDelta, camera.right));

    }
    //D
    if(keyboardState[68]){
      camera.position = subtract(camera.position, scale(cameraSpeed*tDelta, camera.right));
    }

    //Q
    if(keyboardState[81]){
      if(true)
      {
        camera.viewAngle[2] += camera.mouse.mouseSensitivity * camera.mouse.deltaX * tDelta;
      }
    }
    //E
    if(keyboardState[69]){
      if(true)
      {
        camera.viewAngle[2] -= camera.mouse.mouseSensitivity * camera.mouse.deltaX * tDelta ;
      }
    }
  }

  return {
    init: init
  }
})();
