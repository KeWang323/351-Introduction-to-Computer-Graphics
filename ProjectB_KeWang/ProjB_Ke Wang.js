  var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec4 a_Normal;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'uniform vec3 u_LightDirection;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +
  '  vec4 normal = u_NormalMatrix * a_Normal;\n' +
  '  float nDotL = abs(dot(u_LightDirection, normalize(normal.xyz)));\n' +
  '  v_Color = vec4(a_Color.xyz * (nDotL*0.7+0.3), a_Color.a);\n' + 
  '}\n';

  var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = clamp(v_Color, 0.0, 1.0);\n' +
  '}\n';

  var floatsPerVertex = 3;
  var canvas;
  var viewMatrix = new Matrix4();
  var projMatrix = new Matrix4();
  var modelMatrix = new Matrix4();
  var normalMatrix = new Matrix4();
  var u_ProjMatrix, u_ViewMatrix, u_ModelMatrix, u_NormalMatrix;
  var ANGLE_STEP = 65.0;
  var currentAngle = 0.0;
  var EyeX = 0.0, EyeY = 0.0, EyeZ = 0.0; 
  var LookEyeX = 0.0, LookEyeY = 1.0, LookEyeZ = 0.0;
  var theta = 0.0;
  var sq2 = Math.sqrt(2.0);

  var isDrag=false;   // mouse-drag: true when user holds down mouse button
  var xMclik=0.0;     // last mouse button-down position (in CVV coords)
  var yMclik=0.0;   
  var xMdragTot=0.0;  // total (accumulated) mouse-drag amounts (in CVV coords).
  var yMdragTot=0.0;  
  var qNew = new Quaternion(0,0,0,1); // most-recent mouse drag's rotation
  var qTot = new Quaternion(0,0,0,1); // 'current' orientation (made from qNew)
  var quatMatrix = new Matrix4();       // rotation matrix, made from latest qTot
  var fly = 0;
  var vnormalx = 0;
  var vnormaly = 0;
  var v = 0;
  var temp = 0;
  var right = 0;
  var rightflag = 0;
  var left = 0;
  var leftflag = 0;
  var upflag = 0;
  var downflag = 0;
  var frufar = 54;
  var frunear = 1;
  var fruleft=-Math.tan(20*Math.PI/180);
  var fruright=Math.tan(20*Math.PI/180);
  var frutop=-Math.tan(20*Math.PI/180);
  var frubot=Math.tan(20*Math.PI/180);
  var setfrus = 0;
  var velocity = 1;


  console.log(EyeX,EyeY,EyeZ,LookEyeX,LookEyeY,LookEyeZ,theta);


  function main() {

  	canvas = document.getElementById('webgl');

  	var gl = getWebGLContext(canvas);
  	if (!gl) {
  		console.log('Failed to get the rendering context for WebGL');
  		return;
  	}

  	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  		console.log('Failed to intialize shaders.');
  		return;
  	}

  	gl.enable(gl.DEPTH_TEST); 

  	initVertexBuffers(gl);

  	winResize();

  	document.onkeydown = function(ev){ keydown(ev, gl, canvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix); };
  	canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) }; 
  	canvas.onmousemove =  function(ev){myMouseMove( ev, gl, canvas) };
  	canvas.onmouseup =    function(ev){myMouseUp(   ev, gl, canvas)};
  	gl.clearColor(0.0, 0.0, 0.0, 1.0);

  	u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  	u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  	u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  	u_LightDirection = gl.getUniformLocation(gl.program, 'u_LightDirection');
  	if (!u_ViewMatrix || !u_ProjMatrix|| !u_ModelMatrix || !u_NormalMatrix || !u_LightDirection) { 
  		console.log('Failed to get u_ViewMatrix or u_ProjMatrix or u_ModelMatrix');
  		return;
  	}

  	var lightDirection = new Vector3([0.0, 1.0, 1.0]);
  	lightDirection.normalize();
  	gl.uniform3fv(u_LightDirection, lightDirection.elements);

  	var tick = function() {

  		currentAngle = animate(currentAngle);

  		draw(gl, canvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix);

  		requestAnimationFrame(tick, canvas);   

  		if (fly%2) {

  			if(rightflag){
  				right += 1;
  				vnormalx = Math.cos((left - right) * 0.02)*0.2;
  				vnormaly = -Math.sin((right - left) * 0.02)*0.2;
  			}
  			if (leftflag) {
  				left += 1;
  				vnormalx = -Math.cos((left - right) * 0.02)*0.2;
  				vnormaly = Math.sin((right - left) * 0.02)*0.2;
  			};

  			if(upflag){
  				EyeZ += 0.05;
  				LookEyeZ = EyeZ + 0.05;

  			}
  			if(downflag) {
  				EyeZ -= 0.05;
  				LookEyeZ = EyeZ - 0.05;

  			};

  			EyeX = EyeX + velocity * Math.sin((right - left) * 0.02)*0.2;
  			EyeY = EyeY + velocity * Math.cos((left - right) * 0.02)*0.2;

  			LookEyeX = EyeX + Math.sin((right - left) * 0.02);
  			LookEyeY = EyeY + Math.cos((left - right) * 0.02);

  		};
  	};

  	tick();


  }

  function draw(gl, canvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix) {

  	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);





  	var vpAspect = (gl.drawingBufferWidth/2) / (gl.drawingBufferHeight);

  	modelMatrix.setScale(1,1,1);
  	if (setfrus%2) {
  		projMatrix.setFrustum(fruleft, fruright, frutop, frubot, frunear, frufar);
  		console.log("using Frumstum");
  	}
  	else{
  		projMatrix.setPerspective(40, vpAspect, 1, 54);
  		console.log("using perspective");

  	};

  	viewMatrix.setLookAt(EyeX, EyeY, EyeZ, LookEyeX, LookEyeY, LookEyeZ, vnormalx, vnormaly, 1);
  	if(v %2 )
  	{

  		modelMatrix.translate(-2.5, 15.0, 0.0);
  		modelMatrix.rotate(90, 1.0, 0.0, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 0, 1);
  		modelMatrix.translate(0.0, sq2, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
  		modelMatrix.translate(0.0, sq2, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
  		modelMatrix.translate(0.0, sq2, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
  		modelMatrix.translate(0.0, sq2, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
  		modelMatrix.translate(0.0, sq2, 0.0);
  		modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
  		viewMatrix.setInverseOf(modelMatrix);
  		modelMatrix.setIdentity();

  	}

  	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  	gl.viewport(0, 0, Math.min(innerHeight, innerWidth/2), Math.min(innerHeight, innerWidth/2));

  	drawMyScene(gl, u_ModelMatrix, modelMatrix,currentAngle, u_NormalMatrix, normalMatrix);



  	gl.viewport(Math.min(innerHeight, innerWidth/2), 0, Math.min(innerHeight, innerWidth/2), Math.min(innerHeight, innerWidth/2));

  	modelMatrix.setScale(1,1,1);
  	projMatrix.setOrtho(-10.0, 10.0, -10.0, 10.0, 0.0, 2000.0);
  	viewMatrix.setLookAt(EyeX, EyeY, EyeZ, LookEyeX, LookEyeY, LookEyeZ, vnormalx, vnormaly, 1);
  	gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  	drawMyScene(gl, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix);

  }


  function drawMyScene(gl, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix) {

    // modelMatrix.setFromQuat(0.0, 1.0, 0.0, 0.2-3.14);

    pushMatrix(modelMatrix);

    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);//四面体


    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, 0.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -6.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -12.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -18.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -24.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -30.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -36.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -42.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -48.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -54.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(5.0, 0.0, -60.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 12, 36);//正方体

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, 0.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -8.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -16.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -24.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -32.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -40.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -48.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -56.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -64.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -72.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(-5.0, 0.0, -80.0);
    modelMatrix.rotate(currentAngle, 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 48, 22);//六棱柱


    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    modelMatrix.scale(1.5, 1.5, 1.5);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.translate(1.0, 0.5, -18.0);
    quatMatrix.setFromQuat(qTot.x, qTot.y, qTot.z, qTot.w);
    modelMatrix.concat(quatMatrix);     
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//头
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 70, 14);
    modelMatrix.translate(0.08, 0.1, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//右眼
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 84, 4);
    modelMatrix.translate(-0.16, 0.0, 0.0);//-0.08 0.3
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//左眼
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawArrays(gl.TRIANGLE_STRIP, 88, 4);


    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    modelMatrix.translate(-2.5, 15.0, 0.0);
    modelMatrix.rotate(90, 1.0, 0.0, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    modelMatrix.translate(0.0, sq2, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    modelMatrix.translate(0.0, sq2, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    modelMatrix.translate(0.0, sq2, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    modelMatrix.rotate(-90, 1.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES,92,6);
    modelMatrix.rotate(+90, 1.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);
    modelMatrix.translate(0.0, sq2, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.1), 0, 0, 1);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    modelMatrix.rotate(-90, 1.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES,92,6);
    modelMatrix.rotate(+90, 1.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.TRIANGLES, 0, 12);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES,92,6);
    gl.drawArrays(gl.LINES, gndVertsstart/floatsPerVertex, gndVerts.length/floatsPerVertex);

}


function winResize() {

    var nuCanvas = document.getElementById('webgl');  // get current canvas
    var nuGL = getWebGLContext(nuCanvas);

    console.log('nuCanvas width,height=', nuCanvas.width, nuCanvas.height);   
    console.log('Browser window: innerWidth,innerHeight=', innerWidth, innerHeight);
    nuCanvas.width = 59*innerWidth/60;
    nuCanvas.height = 42*innerHeight/50;

    draw(nuGL, nuCanvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix); 

}


function makeGroundGrid() {

	var xcount = 100;
	var ycount = 100;
	var xymax = 50.0;
	var xColr = new Float32Array([1.0, 1.0, 0.3]);
	var yColr = new Float32Array([0.5, 1.0, 0.5]);

	gndVerts = new Float32Array(floatsPerVertex*2*(xcount+ycount));
	gndcolors = new Float32Array(floatsPerVertex*2*(xcount+ycount));

	var xgap = xymax/(xcount-1);
	var ygap = xymax/(ycount-1);

	for(v=0, j=0; v<2*xcount; v++, j+= floatsPerVertex) {

		if(v%2==0) {

			gndVerts[j  ] = -xymax + (v  )*xgap;
			gndVerts[j+1] = -xymax;
			gndVerts[j+2] = 0.0;

		}

		else {

			gndVerts[j  ] = -xymax + (v-1)*xgap;
			gndVerts[j+1] = xymax;
			gndVerts[j+2] = 0.0;

		}

		gndcolors[j  ] = xColr[0];
		gndcolors[j+1] = xColr[1];
		gndcolors[j+2] = xColr[2];

	}

	for(v=0; v<2*ycount; v++, j+= floatsPerVertex) {

		if(v%2==0) {

			gndVerts[j  ] = -xymax;
			gndVerts[j+1] = -xymax + (v  )*ygap;
			gndVerts[j+2] = 0.0;

		}

		else {

			gndVerts[j  ] = xymax;
			gndVerts[j+1] = -xymax + (v-1)*ygap;
			gndVerts[j+2] = 0.0;

		}

		gndcolors[j  ] = xColr[0];
		gndcolors[j+1] = xColr[1];
		gndcolors[j+2] = xColr[2];

	}
}


function initVertexBuffers(gl) {

	makeGroundGrid();


	var c30 = Math.sqrt(0.75);
	var sq6 = Math.sqrt(6.0);

	var vertices1 = new Float32Array([

      0.0,  0.5, sq2,    c30, 0.0, 0.0,   0.0,  1.5,0.0,//四面体 0 12
      0.0,  0.5, sq2,    0.0,  1.5, 0.0,  -c30, 0.0, 0.0,
      0.0,  0.5, sq2,   -c30, 0.0, 0.0,   c30, 0.0, 0.0,
      -c30, 0.0, 0.0,    0.0,  1.5, 0.0,   c30, 0.0, 0.0,

      1.0,  2.0,  1.0,    -1.0,  2.0,  1.0,    -1.0, 0.0,  1.0,//正方体 12 36
      1.0,  2.0,  1.0,    -1.0, 0.0,  1.0,    1.0, 0.0,  1.0,
      1.0,  2.0,  1.0,    1.0, 0.0,  1.0,    1.0, 0.0, -1.0,
      1.0,  2.0,  1.0,    1.0, 0.0, -1.0,    1.0,  2.0, -1.0,
      1.0,  2.0,  1.0,    1.0,  2.0, -1.0,    -1.0,  2.0, -1.0,
      1.0,  2.0,  1.0,    -1.0,  2.0, -1.0,    -1.0,  2.0,  1.0,
      -1.0,  2.0,  1.0,    -1.0,  2.0, -1.0,    -1.0, 0.0, -1.0,
      -1.0,  2.0,  1.0,    -1.0, 0.0, -1.0,    -1.0, 0.0,  1.0,
      -1.0, 0.0, -1.0,    1.0, 0.0, -1.0,    1.0, 0.0,  1.0,
      -1.0, 0.0, -1.0,    1.0, 0.0,  1.0,    -1.0, 0.0,  1.0,
      1.0, 0.0, -1.0,    -1.0, 0.0, -1.0,    -1.0, 2.0, -1.0,
      1.0, 0.0, -1.0,    -1.0, 2.0, -1.0,    1.0, 2.0, -1.0,


      -1.0, +2.5,  0.0,//六棱柱 48 22
      -0.5, +2.5, -c30,
      -0.5, +2.5,  c30,
      +0.5, +2.5, -c30,
      +0.5, +2.5,  c30,
      +1.0, +2.5,  0.0,
      +1.0,  0.0,  0.0,
      +0.5, +2.5, -c30,
      +0.5,  0.0, -c30,
      -0.5, +2.5, -c30,
      -0.5,  0.0, -c30,
      -1.0, +2.5,  0.0,
      -1.0,  0.0,  0.0,
      -0.5, +2.5,  c30,
      -0.5,  0.0,  c30,
      +0.5, +2.5,  c30,
      +0.5,  0.0,  c30,
      +1.0,  0.0,  0.0,
      -0.5,  0.0,  c30,
      +0.5,  0.0, -c30,
      -1.0,  0.0,  0.0,
      -0.5,  0.0, -c30,

      -0.50,   0.00,   0.05,//兔子脸 70 14
      -0.43,   0.25,  -0.05,
      -0.25,   0.43,   0.05,
      0.00,   0.50,  -0.05,
      0.25,   0.43,   0.05,
      0.43,   0.25,  -0.05,
      0.50,   0.00,   0.05,
      0.43,  -0.25,  -0.05,
      0.25,  -0.43,   0.05,
      0.00,  -0.50,  -0.05,
      -0.25,  -0.43,   0.05,
      -0.43,  -0.25,  -0.05,
      -0.50,   0.00,   0.05,
      -0.43,   0.25,  -0.05,

      0.30,  -0.025,   0.10,//兔子右眼 84 4
      0.00,  -0.025,  -0.10,
      0.30,   0.025,   0.10,
      0.00,   0.025,  -0.10,

      -0.30,  -0.025,   0.10,//兔子左眼 88 4
      0.00,   -0.025,  -0.10,
      -0.30,   0.025,   0.10,
      0.00,   0.025,  -0.10,

      0.0,  0.0,  0.0,//x轴 92 6
      20.0,  0.0,  0.0,
      0.0,  0.0,  0.0,//y轴
      0.0,  20.0,  0.0,
      0.0,  0.0,  0.0,//z轴
      0.0,  0.0,  20.0,


      ]);

  var vertices = new Float32Array (vertices1.length + gndVerts.length);

  vertices1start = 0;
  for(i=0,j=0; j< vertices1.length; i++,j++) {
  	vertices[i] = vertices1[j];
  }

  gndVertsstart = i;
  for(j=0; j< gndVerts.length; i++, j++) {
  	vertices[i] = gndVerts[j];
  }

  if (!initArrayBuffer(gl, 'a_Position', vertices, 3, gl.FLOAT)) return -1;


  var colors1 = new Float32Array([

  	0.0,  0.0,  1.0,   1.0,  0.0,  0.0,    0.0,  1.0,  0.0,
  	0.0,  0.0,  1.0,   0.0,  1.0,  0.0,    1.0,  1.0,  1.0,
  	0.0,  0.0,  1.0,   1.0,  1.0,  1.0,    1.0,  0.0,  0.0,
  	1.0,  1.0,  1.0,   0.0,  1.0,  0.0,    1.0,  0.0,  0.0,

  	1.0,  1.0,  1.0,   1.0,  0.0,  1.0,    1.0,  0.0,  0.0,
  	1.0,  1.0,  1.0,    1.0,  0.0,  0.0,    1.0,  1.0,  0.0,
  	1.0,  1.0,  1.0,    1.0,  1.0,  0.0,    0.0,  1.0,  0.0,
  	1.0,  1.0,  1.0,    0.0,  1.0,  0.0,    0.0,  1.0,  1.0,
  	1.0,  1.0,  1.0,    0.0,  1.0,  1.0,    0.0,  0.0,  1.0,
  	1.0,  1.0,  1.0,    0.0,  0.0,  1.0,    1.0,  0.0,  1.0,
  	1.0,  0.0,  1.0,    0.0,  0.0,  1.0,    0.0,  0.0,  0.0,
  	1.0,  0.0,  1.0,    0.0,  0.0,  0.0,    1.0,  0.0,  0.0,
  	0.0,  0.0,  0.0,    0.0,  1.0,  0.0,    1.0,  1.0,  0.0,
  	0.0,  0.0,  0.0,    1.0,  1.0,  0.0,    1.0,  0.0,  0.0,
  	0.0,  1.0,  0.0,    0.0,  0.0,  0.0,    0.0,  0.0,  1.0,
  	0.0,  1.0,  0.0,    0.0,  0.0,  1.0,    0.0,  1.0,  1.0,

  	0.2, 0.4, 0.2,
  	0.2, 0.3, 0.4,
  	0.2, 0.4, 0.5,
  	0.2, 0.5, 0.6,
  	0.2, 0.6, 0.7,
  	0.2, 0.7, 0.8,
  	1.0, 0.6, 0.3,
  	0.2, 0.5, 0.6,
  	0.2, 0.4, 0.8,
  	0.2, 0.3, 0.4,
  	1.0, 1.0, 1.0,
  	0.2, 0.4, 0.2,
  	0.2, 0.4, 0.5,
  	0.2, 0.4, 0.5,
  	0.2, 0.2, 0.2,
  	0.2, 0.6, 0.7,
  	0.5, 0.25,0.0,
  	1.0, 0.6, 0.3,
  	0.4, 0.2, 0.2,
  	0.2, 0.4, 0.8,
  	0.2, 0.4, 0.5,
  	1.0, 1.0, 1.0,

  	1.0,  1.0,  1.0,
  	0.0,  0.0,  1.0,
  	0.0,  1.0,  0.0,
  	0.0,  1.0,  0.0,
  	0.0,  1.0,  1.0,
  	1.0,  0.0,  0.0,
  	1.0,  0.0,  1.0,
  	1.0,  1.0,  0.0,
  	1.0,  1.0,  1.0,
  	0.0,  0.0,  1.0,
  	0.0,  1.0,  0.0,
  	0.0,  1.0,  1.0,
  	1.0,  1.0,  1.0,
  	0.0,  0.0,  1.0,

  	0.0,  1.0,  0.0,
  	0.0,  1.0,  1.0,
  	1.0,  0.0,  0.0,
  	1.0,  0.0,  1.0,

  	0.0,  1.0,  0.0,
  	0.0,  1.0,  1.0,
  	1.0,  0.0,  0.0,
  	1.0,  0.0,  1.0,

  	1.0,  0.0,  0.0,
  	1.0,  0.0,  0.0,
  	0.0,  1.0,  0.0,
  	0.0,  1.0,  0.0,
  	0.0,  0.0,  1.0,
  	0.0,  0.0,  1.0,


  	]);

  var colors = new Float32Array (colors1.length + gndcolors.length);
  colors1start = 0;
  for(i=0,j=0; j< colors1.length; i++,j++) {
  	colors[i] = colors1[j];
  }

  gndcolorsstart = i;
  for(j=0; j< gndcolors.length; i++, j++) {
  	colors[i] = gndcolors[j];
  }

  if (!initArrayBuffer(gl, 'a_Color', colors, 3, gl.FLOAT)) return -1;

  var normals1 = new Float32Array([

  	sq6, sq2, 1,  sq6, sq2, 1,  sq6, sq2, 1,
  	-sq6, sq2, 1,  -sq6, sq2, 1,  -sq6, sq2, 1,
  	0, -2*sq2, 1,  0, -2*sq2, 1,  0, -2*sq2, 1,
  	0, 0, -1,      0, 0, -1,      0, 0, -1, 

  	]);

  var normals = new  Float32Array(1494);

  for(i=0,j=0; j< normals1.length; i++, j++){
  	normals[i] = normals1[j];
  }
  for(j=0;j<498;i +=3,j++){
  	normals[i  ] =0;
  	normals[i+1] =1;
  	normals[i+2] =0;
  }


  if (!initArrayBuffer(gl, 'a_Normal', normals, 3, gl.FLOAT)) return -1;


  return vertices.length;

}

function initArrayBuffer(gl, attribute, data, num, type) {

	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log('Failed to create the buffer object');
		return false;
	}

	FSIZE = data.BYTES_PER_ELEMENT;

	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

	var a_attribute = gl.getAttribLocation(gl.program, attribute);
	if (a_attribute < 0) {
		console.log('Failed to get the storage location of ' + attribute);
		return false;
	}

	gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
	gl.enableVertexAttribArray(a_attribute);

	return true;
}

var g_last = Date.now();

function animate(angle) {

	var now = Date.now();
	var elapsed = now - g_last;
	g_last = now;

	var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
	if(newAngle > 180.0) newAngle = newAngle - 360.0;
	if(newAngle <-180.0) newAngle = newAngle + 360.0;
	return newAngle;
}

function keydown(ev, gl, canvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix) {


	switch(ev.keyCode) {


    case 37://左箭头

    theta -= 0.05;
    LookEyeX = EyeX + Math.sin(theta);
    LookEyeY = EyeY +  Math.cos(theta);
    break;

    case 39://右箭头

    theta += 0.05;
    LookEyeX = EyeX + Math.sin(theta);
    LookEyeY = EyeY + Math.cos(theta);

    break;

    case 38://上箭头

    if(upflag == 0 && downflag == 0 ){
    	upflag = 1;
    }
    if(downflag == 1 && upflag == 0 ){
    	downflag = 0;

    }
    break

    case 40://下箭头

    if(upflag == 0 && downflag == 0 ){
    	downflag = 1;
    }
    if(upflag == 1 && downflag == 0 ){
    	upflag = 0;

    }

    break;     

    case 65:

    EyeX -= 0.1;//A左移
    LookEyeX -= 0.1;

    break;

    case 68://D右移

    EyeX += 0.1;
    LookEyeX += 0.1;

    break;

    case 87://W前进

    EyeY += 0.1;
    LookEyeY += 0.1;

    break

    case 83://S退

    EyeY -= 0.1;
    LookEyeY -= 0.1;

    break;     

    case 81://Q上升

    EyeZ += 0.1;
    LookEyeZ += 0.1;

    break;    

    case 69://E下降

    EyeZ -= 0.1;
    LookEyeZ -= 0.1;


    break; 

    case 70://F

    fly += 1;

    break;

    case 75://K

    upflag = 0;
    downflag = 0;
    LookEyeZ = EyeZ;
    break;

    case 76://L

    vertical += 0.1;

    break;

    case 79://O

    if(rightflag == 0 && leftflag == 0 ){
    	leftflag = 1;
    }
    if(rightflag == 1 && leftflag == 0 ){
    	rightflag = 0;
    	vnormalx = 0;
    	vnormaly = 0;
    }
    break;

    case 80://P

    if(rightflag == 0 && leftflag == 0 ){
    	rightflag = 1;
    }
    if(rightflag == 0 && leftflag == 1 ){
    	leftflag = 0;
    	vnormalx = 0;
    	vnormaly = 0;
    }
    break;

    case 86://转换视角

    v += 1;

    break; 

    case 77://M 加速

    velocity += 0.1;

    break;

    case 78://N

    velocity -= 0.1;

    break; 
    default:

    console.log('myKeyDown()--keycode=', ev.keyCode, ', charCode=', ev.charCode);

    break;
}

draw(gl, canvas, u_ViewMatrix, viewMatrix, u_ProjMatrix, projMatrix, u_ModelMatrix, modelMatrix, currentAngle, u_NormalMatrix, normalMatrix); 

console.log(EyeX,EyeY,EyeZ,LookEyeX,LookEyeY,LookEyeZ,theta);

}


function myMouseDown(ev, gl, canvas) {

	var rect = ev.target.getBoundingClientRect();
	var xp = ev.clientX - rect.left;
	var yp = canvas.height - (ev.clientY - rect.top);
	var x = (xp - canvas.width/2)  /  (canvas.width/2);
	var y = (yp - canvas.height/2) /  (canvas.height/2);
	isDrag = true;
	xMclik = x;
	yMclik = y;

};


function myMouseMove(ev, gl, canvas) {

	if(isDrag==false) return;

	var rect = ev.target.getBoundingClientRect();
	var xp = ev.clientX - rect.left;
	var yp = canvas.height - (ev.clientY - rect.top);

	var x = (xp - canvas.width/2)  /   (canvas.width/2);
	var y = (yp - canvas.height/2) /   (canvas.height/2);

	xMdragTot += (x - xMclik);
	yMdragTot += (y - yMclik);

	dragQuat(x - xMclik, y - yMclik);

	xMclik = x;
	yMclik = y;

};

function myMouseUp(ev, gl, canvas) {

  var rect = ev.target.getBoundingClientRect(); // get canvas corners in pixels
  var xp = ev.clientX - rect.left;                  // x==0 at canvas left edge
  var yp = canvas.height - (ev.clientY - rect.top);
  var x = (xp - canvas.width/2)  /  (canvas.width/2);      // normalize canvas to -1 <= x < +1,
  var y = (yp - canvas.height/2) /  (canvas.height/2);

  isDrag = false;

  xMdragTot += (x - xMclik);
  yMdragTot += (y - yMclik);

  dragQuat(x - xMclik, y - yMclik);

};

function dragQuat(xdrag, ydrag) {

	var res = 5;
	var qTmp = new Quaternion(0,0,0,1);

	var dist = Math.sqrt(xdrag*xdrag + ydrag*ydrag);

	qNew.setFromAxisAngle(-ydrag + 0.0001, xdrag + 0.0001, 0.0, dist*150.0);

	qTmp.multiply(qNew,qTot);

	qTot.copy(qTmp);

};



function leftup(){

	fruleft += 0.1;
}
function leftdown(){

	fruleft -= 0.1;
}
function rightup(){

	fruright += 0.1;
}
function rightdown(){

	fruright -= 0.1;
}
function bottomup(){

	frubot += 0.1;
}
function bottomdown(){

	frubot -= 0.1;
}
function topup(){

	frutop += 0.1;
}
function topdown(){

	frutop -= 0.1;
}
function nearup(){

	frunear += 0.1;
}
function neardown(){

	frunear -= 0.1;
}
function farup(){

	frufar += 0.1;
}
function fardown(){

	frufar -= 0.1;
}
function change(){

	setfrus += 1;

}