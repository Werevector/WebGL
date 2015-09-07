attribute vec4 vPosition;
attribute  vec4 vColor;
varying vec4 fColor;

uniform mat4 modelMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

void main()
{
	//fColor = vec4(0.5 + vPosition.xyz, 1.0);
	fColor = vColor;
	gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;
}
