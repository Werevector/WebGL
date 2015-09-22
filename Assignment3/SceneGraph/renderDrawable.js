

// Render a specific type of drawable. If anything changes from the "scenenode.addDrawable(...)" example in "scenegraphexample.js", this will have to be changed to reflect this.
// TODO: Create a more flexible solution for rendering drawables. JSON format for example?
var renderDrawable = function(drawable) {
    gl.useProgram(drawable.drawInfo.programInfo.program);

    gl.bindBuffer(gl.ARRAY_BUFFER, drawable.drawInfo.bufferInfo.nBuffer);

    var vNormal = gl.getAttribLocation(drawable.drawInfo.programInfo.program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
   	gl.enableVertexAttribArray(vNormal);

	  gl.bindBuffer(gl.ARRAY_BUFFER, drawable.drawInfo.bufferInfo.vBuffer);

	  var vPosition = gl.getAttribLocation(drawable.drawInfo.programInfo.program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
   	gl.enableVertexAttribArray(vPosition);

    gl.uniformMatrix4fv(drawable.drawInfo.programInfo.worldMatLocation, false, flatten(drawable.worldMatrix));      // Pass the world matrix of the current object to the shader.
    gl.uniform4fv(drawable.drawInfo.programInfo.colorLocation, new Float32Array(drawable.drawInfo.uniformInfo.color));

    //console.log(drawable.drawInfo.uniformInfo.lm_Vars.lightPosition);

    gl.uniform4fv(drawable.drawInfo.programInfo.ambientProduct,   flatten(drawable.drawInfo.uniformInfo.lm_Vars.ambientProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.diffuseProduct,   flatten(drawable.drawInfo.uniformInfo.lm_Vars.diffuseProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.specularProduct,  flatten(drawable.drawInfo.uniformInfo.lm_Vars.specularProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.lightPosition,    flatten(drawable.drawInfo.uniformInfo.lm_Vars.lightPosition));
    gl.uniform1f(drawable.drawInfo.programInfo.shininess,        flatten(drawable.drawInfo.uniformInfo.lm_Vars.materialShininess));

    gl.drawArrays(gl.TRIANGLES, 0, drawable.drawInfo.bufferInfo.numVertices);
}