

// Render a specific type of drawable. If anything changes from the "scenenode.addDrawable(...)" example in "scenegraphexample.js", this will have to be changed to reflect this.
// TODO: Create a more flexible solution for rendering drawables. JSON format for example?
var renderDrawable = function(drawable) {
    gl.useProgram(drawable.drawInfo.programInfo.program);
	  gl.bindBuffer(gl.ARRAY_BUFFER, drawable.drawInfo.bufferInfo.vBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, drawable.drawInfo.bufferInfo.nBuffer);



	  var vPosition = gl.getAttribLocation(drawable.drawInfo.programInfo.program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
   	gl.enableVertexAttribArray(vPosition);

    var vNormal = gl.getAttribLocation(drawable.drawInfo.programInfo.program, "vNormal");
    gl.vertexAttribPointer(vNormal, 4, gl.FLOAT, false, 0, 0);
   	gl.enableVertexAttribArray(vNormal);

    gl.uniformMatrix4fv(drawable.drawInfo.programInfo.worldMatLocation, false, flatten(drawable.worldMatrix));      // Pass the world matrix of the current object to the shader.
    gl.uniform4fv(drawable.drawInfo.programInfo.colorLocation, new Float32Array(drawable.drawInfo.uniformInfo.color));

    gl.uniform4fv(drawable.drawInfo.programInfo.ambientProduct,   flatten(drawable.uniformInfo.lm_Vars.ambientProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.diffuseProduct,   flatten(drawable.uniformInfo.lm_Vars.diffuseProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.specularProduct,  flatten(drawable.uniformInfo.lm_Vars.specularProduct));
    gl.uniform4fv(drawable.drawInfo.programInfo.lightPosition,    flatten(drawable.uniformInfo.lm_Vars.lightPosition));
    gl.uniform4fv(drawable.drawInfo.programInfo.shininess,        flatten(drawable.uniformInfo.lm_Vars.materialShininess));

    gl.drawArrays(gl.TRIANGLES, 0, drawable.drawInfo.bufferInfo.numVertices);
}
