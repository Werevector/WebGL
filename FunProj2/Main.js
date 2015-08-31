"use strict"


var glContext;
//var colorArray = [0.0,0.0,0.0,1.0];
var theta;
var thetaLoc;

var scale;
var scaleLoc;

var time;


var main = (function() {

  var browserCanvas;

  function init() {

    //Set the Angle theta to 0
    theta = [0, 0, 0];
    time = 0;

    //Loading canvas from the HTML Element
    browserCanvas = document.getElementById("gl-canvas");
    browserCanvas.width = 600;
    browserCanvas.height = 600;

    //Create the OpenGL context, to be used in the program
    glContext = WebGLUtils.setupWebGL(browserCanvas);
    if (!glContext) {
      alert("WebGl isn't available");
    }

    //Initialize the pyramid object, that we are going to render
    PyramidObject.InitPyramid();

    glContext.enable(glContext.DEPTH_TEST);

    //Set the viewport
    glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
    glContext.clearColor(1.0, 1.0, 1.0, 1.0);

    //Load Shaders
    var program = initShaders(glContext,
      "Shaders/Vshader.glsl",
      "Shaders/Fshader.glsl"
    );

    //Initialize atrribute buffers
    glContext.useProgram(program);


    /*Load data into GPU*/
    /********************/

    // array element buffer
    var iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);

    glContext.bufferData(
      glContext.ELEMENT_ARRAY_BUFFER,
      new Uint8Array(PyramidObject.GetIndexArray()),
      glContext.STATIC_DRAW
    );

    var cBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, cBuffer);

    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      flatten(PyramidObject.GetColorArray()),
      glContext.STATIC_DRAW
    );

    var vColor = glContext.getAttribLocation(program, "vColor");
    glContext.vertexAttribPointer(vColor, 4, glContext.FLOAT, false, 0, 0);
    glContext.enableVertexAttribArray(vColor);


    // vertex array attribute buffer
    var vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(
      glContext.ARRAY_BUFFER,
      flatten(PyramidObject.GetPoints()),
      glContext.STATIC_DRAW
    );

    var vPosition = glContext.getAttribLocation(program, "vPosition");
    glContext.vertexAttribPointer(vPosition, 3, glContext.FLOAT, false, 0, 0);
    glContext.enableVertexAttribArray(vPosition);


    thetaLoc = glContext.getUniformLocation(program, "theta");
    scaleLoc = glContext.getUniformLocation(program, "scale");


    render();

  }

  //Render the whole thing
  function render() {

    glContext.clear(glContext.COLOR_BUFFER_BIT);

    glContext.drawArrays(
      glContext.TRIANGLES,
      0,
      PyramidObject.GetNumberOfPoints(),
      glContext.UNSIGNED_BYTE,
      0
    );

    theta[0] += 0.0;
    theta[1] += 0.1;
    theta[2] += 0.0;

    time += 0.01;
    scale = (Math.sin(time) + 1) / 2

    if (time >= 10000) {
      time = 0
    }


    glContext.uniform3fv(thetaLoc, theta);
    glContext.uniform1f(scaleLoc, scale);

    //Callback to animate the pyramids rotation
    requestAnimFrame(render);

  }

  return {
    init: init
  }

})();
