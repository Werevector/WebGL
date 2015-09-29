// Render a specific type of drawable. If anything changes from the "scenenode.addDrawable(...)" example in "scenegraphexample.js", this will have to be changed to reflect this.
// TODO: Create a more flexible solution for rendering drawables. JSON format for example?
var renderDrawable = function(drawable) {
  "use strict";

  var programInfo = drawable.drawInfo.programInfo;
  var attributeLocations = programInfo.attributeLocations;
  var uniformLocations = programInfo.uniformLocations;

  var bufferInfo = drawable.drawInfo.bufferInfo;
  var uniformInfo = drawable.drawInfo.uniformInfo;

  gl.useProgram(programInfo.program);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.vBuffer);

  var vPosition = gl.getAttribLocation(programInfo.program, "vPosition");
  gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.nBuffer);

  var vNormal = gl.getAttribLocation(programInfo.program, "vNormal");
  gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
 	gl.enableVertexAttribArray(vNormal);

  gl.bindBuffer(gl.ARRAY_BUFFER, bufferInfo.tBuffer);

  var vTexCoord = gl.getAttribLocation( programInfo.program, "vTexCoord" );
  gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vTexCoord );


  gl.uniformMatrix4fv(uniformLocations.worldMatrix, false, flatten(drawable._worldMatrix)); // Pass the world matrix of the current object to the shader.

  gl.uniform4fv(uniformLocations.ambientProdLocation,   flatten(uniformInfo.lm_Vars.ambientProduct));
  gl.uniform4fv(uniformLocations.diffuseProdLocation,   flatten(uniformInfo.lm_Vars.diffuseProduct));
  gl.uniform4fv(uniformLocations.specularProdLocation,  flatten(uniformInfo.lm_Vars.specularProduct));
  gl.uniform4fv(uniformLocations.light,                 flatten(uniformInfo.lm_Vars.lightPosition));
  gl.uniform1f(uniformLocations.shininess,    uniformInfo.lm_Vars.materialShininess);

  gl.uniform1i(uniformLocations.texture, uniformInfo.texture);


  gl.drawArrays(gl.TRIANGLES, 0, bufferInfo.numVertices);
};
