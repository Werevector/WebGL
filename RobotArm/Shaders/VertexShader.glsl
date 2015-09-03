attribute vec4 vPosition;
	attribute  vec4 vColor;
	varying vec4 fColor;

	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
  uniform vec4 solidColor;
	void main()
	{
		fColor = vec4(0.5 + vPosition.xyz, 1.0);
		//fColor = solidColor;
		gl_Position = projectionMatrix * modelMatrix * vPosition;
	}
