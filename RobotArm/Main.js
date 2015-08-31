"use strict"


var glContext;

var main = (function() {

  var browserCanvas;

  //Initialize the program
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

    render();
  }

  //Update the state of the program
  function update(){


    requestAnimFrame(update);
  }

  //Render the whole thing
  function render() {

    glContext.clear(glContext.COLOR_BUFFER_BIT);
    requestAnimFrame(render);

  }

  return {
    init: init
  }

})();
