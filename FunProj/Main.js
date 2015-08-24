"use strict"


var glContext;


var main = (function() {

    var browserCanvas;

    function init() {

        //Loading canvas from the HTML Element
        browserCanvas = document.getElementById("gl-canvas");

        glContext = WebGLUtils.setupWebGL(browserCanvas);
        if (!glContext) {
            alert("WebGl isn't available");
        }


        var vertexPoints = [

            vec2(-1, -1),
            vec2(0, 1),
            vec2(1, -1)

        ];

        glContext.viewport(0, 0, browserCanvas.width, browserCanvas.height);
        glContext.clearColor(0.0, 0.0, 0.0, 1.0);

        //Load Shaders
        var program = initShaders(glContext, "Shaders/Vshader.glsl", "Shader/Fshader.glsl");

        //Initialize atrribute buffers
        glContext.useProgram(program);


        //Load data into GPU
        var bufferID = glContext.createBuffer();
        glContext.bindBuffer(glContext.ARRAY_BUFFER, bufferId);
        glContext.bufferData(glContext.ARRAY_BUFFER, flatten(vertexPoints), glContext.STATIC_DRAW);

        var vPosition = glContext.getAttribLocation(program, "vPosition");
        glContext.vertexAttribPointer(vPosition, 2, glContext.FLOAT, false, 0, 0);
        glContext.enableVertexAttribArray(vPosition);

        render();

    }


    function render() {
        glContext.clear(gl.COLOR_BUFFER_BIT);
        glContext.drawArrays(gl.TRIANGLES, 0, 3);
    }

    return {
        init : init
    }

}) ();