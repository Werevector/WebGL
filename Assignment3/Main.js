"use strict"

var gl;

var keyboardState = [];

var keyboardStateX = new THREEx.KeyboardState();

var time = 0;
var tDelta;

var camera;
var cameraSpeed = 30;

var shCube

var projectionMat;
var projectionMatLoc;

var viewMat;
var viewMatLoc;

var modelMat = mat4();
var modelMatLoc;

var main = (function() {

  var browserCanvas;

  function init() {

    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 600;
    browserCanvas.height = 600;

    //Create the OpenGL context, to be used in the program
    gl = WebGLUtils.setupWebGL(browserCanvas);
    if (!gl) {
      alert("WebGl isn't available");
    }

    gl.enable(gl.DEPTH_TEST);

    //Set the viewport
    gl.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    gl.clearColor(0.3, 0.3, 0.3, 1.0);



    camera = new Camera();
    camera.position[2] = -5;
    camera.position[1] = 0;

    shCube = new ShadedCube();

    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;

    projectionMat = perspective(70, browserCanvas.width / browserCanvas.height, 0.01, 1000);
    viewMat = camera.getCameraView(tDelta);

    window.onkeydown = function(e) {
      keyboardState[e.keyCode || e.which] = true;
    };
    window.onkeyup = function(e) {
      keyboardState[e.keyCode || e.which] = false;
    };

    //Load Shaders
    var program = initShaders(gl,
      "vertex-shader",
      "fragment-shader"
    );
    //Initialize atribute buffers
    gl.useProgram(program);

    // Create and load the buffers for the single object
    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shCube.surfaceNormals), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(shCube.points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);
    //-------------------------------------------------

    // Load Uniforms into shader program
    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"),
       flatten(shCube.ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"),
       flatten(shCube.diffuseProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"),
       flatten(shCube.specularProduct) );
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"),
       flatten(shCube.lm_Vars.lightPosition) );

    gl.uniform1f(gl.getUniformLocation(program,
       "shininess"),shCube.lm_Vars.materialShininess);

    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMat"),
       false, flatten(projectionMat));

    modelMatLoc = gl.getUniformLocation(program, "modelMat");
    viewMatLoc = gl.getUniformLocation(program, "viewMat");
    projectionMatLoc = gl.getUniformLocation(program, "projectionMat");

    gl.uniformMatrix4fv(projectionMatLoc,  false, flatten(projectionMat));
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));
    //-------------------------------------------------------------------------

    render();
  }

  //Render the whole thing
  function render() {
    resize();
    HandleKeyboardState();
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Update the clock
    var ntime = Date.now() / 1000;
    tDelta = ntime - time;
    time = ntime;
    //---------------


    viewMat = camera.getCameraView(tDelta);
    gl.uniformMatrix4fv( viewMatLoc,  false, flatten(viewMat));

    gl.drawArrays(gl.TRIANGLES, 0, length(shCube.points));

    requestAnimFrame(render);
  }

  function HandleKeyboardState() {
    // W
    if (keyboardState[87]) {
      if (true) {
        camera.position = add(camera.position, scale(cameraSpeed * tDelta, camera.viewVector));

      }
    }
    // S
    if (keyboardState[83]) {
      if (true) {
        camera.position = subtract(camera.position, scale(cameraSpeed * tDelta, camera.viewVector));

      }
    }

    //A
    if (keyboardState[65]) {
      camera.position = subtract(camera.position, scale(cameraSpeed * tDelta, camera.right));

    }
    //D
    if (keyboardState[68]) {
      camera.position = add(camera.position, scale(cameraSpeed * tDelta, camera.right));
    }

    //Q
    if (keyboardState[81]) {
      if (true) {
        camera.viewAngle[2] -= camera.mouse.mouseSensitivity * tDelta;
      }
    }
    //E
    if (keyboardState[69]) {
      if (true) {
        camera.viewAngle[2] += camera.mouse.mouseSensitivity * tDelta;
      }
    }
  }

  function resize() {
    // Get the canvas from the WebGL context
    var canvas = gl.canvas;

    // Lookup the size the browser is displaying the canvas.
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;

    // Check if the canvas is not the same size.
    if (canvas.width != displayWidth || canvas.height != displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      var ratio = displayWidth / displayHeight;
      projectionMat = perspective(45, ratio, 0.1, 1000);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  return {
    init: init
  }
})();
