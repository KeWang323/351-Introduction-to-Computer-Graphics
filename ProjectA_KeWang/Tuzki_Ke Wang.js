  var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'attribute vec4 a_Color;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_Position = u_ModelMatrix * a_Position;\n' +
  '  v_Color = a_Color;\n' +
  '}\n';

  var FSHADER_SOURCE =
  'precision mediump float;\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';

  var ANGLE_STEP = 65.0;
  var floatsPerVertex = 7;
  makeSphere();
  numy = 0;
  numx = 0;
  var isDrag=false;
  xMclik=0.4;
  yMclik=0.4;
  var xMdragTot=0.0;
  var yMdragTot=0.0;
  var currentAngle = 0.0;


  function main() {

    var canvas = document.getElementById('webgl');

    var gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to intialize shaders.');
      return;
    }

    var n = initVertexBuffers(gl);
    if (n < 0) {
      console.log('Failed to set the positions of the vertices');
      return;
    }

    canvas.onmousedown  = function(ev){myMouseDown( ev, gl, canvas) };
    canvas.onmousemove  = function(ev){myMouseMove( ev, gl, canvas) };
    canvas.onmouseup    = function(ev){myMouseUp(   ev, gl, canvas) };

    window.addEventListener("keydown", myKeyDown, false);
    window.addEventListener("keyup", myKeyUp, false);

    gl.clearColor(0, 0, 0, 1);
    gl.depthFunc(gl.LESS);
    gl.enable(gl.DEPTH_TEST);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) {
      console.log('Failed to get the storage location of u_ModelMatrix');
      return;
    }


    var modelMatrix = new Matrix4();

    var tick = function() {

      currentAngle = animate(currentAngle);

      var n = initVertexBuffers(gl);

      clock();
      draw(gl, currentAngle, modelMatrix, u_ModelMatrix);
      document.getElementById('CurAngleDisplay').innerHTML = 'CurrentAngle= '+currentAngle;
      document.getElementById('Mouse').innerHTML = 'Mouse Drag totals (CVV coords):\t'+xMdragTot+', \t'+yMdragTot;
      requestAnimationFrame(tick, canvas);
    };
    tick();
  }

  function initVertexBuffers(gl) {
    var nb = Math.abs(currentAngle)/25;
    var mypoints = new Float32Array([

    -0.50,   0.00,   0.05,  1.0,    1.0,  1.0,  1.0, //脸 14
    -0.43,   0.25,  -0.05,  1.0,    0.0,  0.0,  1.0,
    -0.25,   0.43,   0.05,  1.0,    0.0,  1.0,  0.0,
    0.00,   0.50,  -0.05,  1.0,    0.0,  1.0,  0.0,
    0.25,   0.43,   0.05,  1.0,    0.0,  1.0,  1.0,
    0.43,   0.25,  -0.05,  1.0,    1.0,  0.0,  0.0,
    0.50,   0.00,   0.05,  1.0,    1.0,  0.0,  1.0, 
    0.43,  -0.25,  -0.05,  1.0,    1.0,  1.0,  0.0,
    0.25,  -0.43,   0.05,  1.0,    1.0,  1.0,  1.0,
    0.00,  -0.50,  -0.05,  1.0,    0.0,  0.0,  1.0,
    -0.25,  -0.43,   0.05,  1.0,    0.0,  1.0,  0.0,
    -0.43,  -0.25,  -0.05,  1.0,    0.0,  1.0,  1.0,
    -0.50,   0.00,   0.05,  1.0,    1.0,  1.0,  1.0,
    -0.43,   0.25,  -0.05,  1.0,    0.0,  0.0,  1.0,

    0.30,  -0.025,   0.10,   1.0,    0.0,  1.0,  0.0,//右眼 14 4
    0.00,  -0.025,  -0.10,   1.0,    0.0,  1.0,  1.0,
    0.30,   0.025,   0.10,   1.0,    1.0,  0.0,  0.0,
    0.00,   0.025,  -0.10,   1.0,    1.0,  0.0,  1.0,

    -0.30,  -0.025,   0.10,   1.0,    0.0,  1.0,  0.0,//左眼 18 4
    0.00,   -0.025,  -0.10,   1.0,    0.0,  1.0,  1.0,
    -0.30,   0.025,   0.10,   1.0,    1.0,  0.0,  0.0,
    0.00,   0.025,  -0.10,   1.0,    1.0,  0.0,  1.0,

    0.00,   0.00,   0.00,   1.00,   1.0,  0.0,  0.0,//右胳膊 22 4
    0.00,   0.20,   0.00,   1.00,   1.0,  1.0,  0.0,
    0.50,   0.00,   0.00,   1.00,   1.0,  1.0,  1.0,
    0.50,   0.20,   0.00,   1.00,   1.0,  1.0,  0.0,

    0.00,    0.00,   0.00,   1.00,   1.0,  0.0,  0.0,//左胳膊 26 4
    0.00,    0.20,   0.00,   1.00,   1.0,  1.0,  0.0,
    -0.50,   0.00,   0.00,   1.00,   1.0,  1.0,  1.0,
    -0.50,   0.20,   0.00,   1.00,   1.0,  1.0,  0.0,

    -0.29,    0.00,   0.00,   1.00,   1.0,  0.0,  0.0,//正四面体 30 6
    0.29,   0.00,  -0.50,   1.00,   1.0,  0.0,  0.0,
    0.29,   0.00,   0.50,   1.00,   1.0,  0.0,  0.0,
    0.00,    2.00,   0.00,   1.00,   1.0,  0.0,  0.0,
    -0.29,    0.00,   0.00,   1.00,   1.0,  0.0,  0.0,
    0.29,    0.00,  -0.50,   1.00,   1.0,  0.0,  0.0,

    -0.10,  -0.10,   0.00,   1.00,   nb,  0.0,  0.0,//表针 36 4
    -0.10,   0.10,   0.00,   1.00,   nb,  0.0,  0.0,
    0.10,   -0.10,   0.00,   1.00,   nb,  0.0,  0.0,
    0.10,   0.10,    0.00,   1.00,   nb,  0.0,  0.0,

    ]);

  var vertices = new Float32Array (sphVerts.length + mypoints.length);

  sphStart = 0;
  for(i=0,j=0; j< sphVerts.length; i++,j++) {
    vertices[i] = sphVerts[j];
  }
  myStart = i;
  for(j=0; j< mypoints.length; i++, j++) {
    vertices[i] = mypoints[j];
  }

  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  FSIZE = vertices.BYTES_PER_ELEMENT;

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);
  gl.enableVertexAttribArray(a_Position);

  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if(a_Color < 0) {
    console.log('Failed to get the storage location of a_Color');
    return -1;
  }

  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
  gl.enableVertexAttribArray(a_Color);  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
}

  function draw(gl, currentAngle, modelMatrix, u_ModelMatrix) {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    modelMatrix.setScale( 0.6, 0.5, 0.5);
    // modelMatrix.translate(-0.7 + numx/3, -0.3 + numy/3, 0.0);
    modelMatrix.translate(0.0, currentAngle/200, 0.0);
    // var dist = Math.sqrt(xMdragTot*xMdragTot + yMdragTot*yMdragTot);
    // modelMatrix.rotate(dist*120.0, -yMdragTot+0.0001, xMdragTot+0.0001, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//头
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7, 14);

    modelMatrix.translate(0.08, 0.0, 0.0);// 0.08 0.3
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//右眼
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7+14, 4);

    modelMatrix.translate(-0.16, 0.0, 0.0);//-0.08 0.3
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//左眼
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7+18, 4);
    modelMatrix.translate(0.08, 0.0, 0.0);

    pushMatrix(modelMatrix);

    modelMatrix.translate(0.24, currentAngle/200-0.5, 0.0);
    modelMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.0, -0.1, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//右大臂
    gl.drawArrays(gl.TRIANGLE_STRIP,myStart/7+22, 4);

    modelMatrix.scale(0.60, 0.60, 0.60);
    modelMatrix.translate(0.70, 0.1, 0.0);
    modelMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.0, -0.05, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//右小臂
    gl.drawArrays(gl.TRIANGLE_STRIP,myStart/7+22, 4);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    modelMatrix.translate(-0.24, currentAngle/200-0.5, 0.0);
    modelMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.0, -0.1, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//左大臂
    gl.drawArrays(gl.TRIANGLE_STRIP,myStart/7+26, 4);

    modelMatrix.scale(0.60, 0.60, 0.60);
    modelMatrix.translate(-0.70, 0.1, 0.0);
    modelMatrix.rotate(currentAngle, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.0, -0.05, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//左小臂
    gl.drawArrays(gl.TRIANGLE_STRIP,myStart/7+26, 4);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    modelMatrix.translate(0.2, 0.30, 0.0);
    modelMatrix.rotate(-90, 1 , 0, 0);
    modelMatrix.scale( 0.10, 0.10, 0.22);
    modelMatrix.rotate(currentAngle*0.5, 0, 1, 0);
    modelMatrix.translate(0.0, 0.0, 1.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//右耳朵
    gl.drawArrays(gl.TRIANGLE_STRIP,sphStart/7,sphVerts.length/floatsPerVertex-27*7);

    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);

    modelMatrix.translate(-0.2, 0.30, 0.0);
    modelMatrix.rotate(-90, 1 , 0, 0);
    modelMatrix.scale( 0.10, 0.10, 0.22);
    modelMatrix.rotate(-currentAngle*0.5, 0, 1, 0);
    modelMatrix.translate(0.0, 0.0, 1.2);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//左耳朵
    gl.drawArrays(gl.TRIANGLE_STRIP,sphStart/7,sphVerts.length/floatsPerVertex-27*7);

    modelMatrix = popMatrix();

    modelMatrix.translate(0.0, -0.95, 0.0);
    modelMatrix.scale(0.36, 0.72, 0.36);
    modelMatrix.rotate(90, 1, 0, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//身子
    gl.drawArrays(gl.TRIANGLE_STRIP,sphStart/7,sphVerts.length/floatsPerVertex-27*7);

    modelMatrix.setScale( 1.0, 1.0, 1.0);
    modelMatrix.translate(xMclik, yMclik, 0.0);
    modelMatrix.translate(0.0, 0.0, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//表
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7, 14);

    pushMatrix(modelMatrix);

    modelMatrix.scale( 0.2, 0.2, 0.2);
    modelMatrix.rotate(-(m+s/60)*6, 0.0, 0.0, 1.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//分针
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7+30, 6);

    modelMatrix = popMatrix();

    pushMatrix(modelMatrix);
    modelMatrix.scale( 0.1, 0.1, 0.1);
    modelMatrix.rotate(-(h+m/60)*30, 0.0, 0.0, 1.0);
    modelMatrix.scale(Math.abs(currentAngle)/50+1,+Math.abs(currentAngle)/50+1,1)

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//时针
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7+30, 6);

    modelMatrix = popMatrix();

    modelMatrix.scale( 0.3, 0.3, 0.3);
    modelMatrix.rotate(-(s+ms/1000)*6, 0.0, 0.0, 1.0);
    modelMatrix.translate(0.0, 1.3, 0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);//秒针
    gl.drawArrays(gl.TRIANGLE_STRIP, myStart/7+36, 4);

  }

  var g_last = Date.now();

  function animate(angle) {

    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

    if(angle >   25.0 && ANGLE_STEP > 0) ANGLE_STEP = -ANGLE_STEP;
    if(angle <  -25.0 && ANGLE_STEP < 0) ANGLE_STEP = -ANGLE_STEP;

    var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
    return newAngle %= 360;
  }

  function clock(){

    myDate = new Date();
    h = myDate.getHours();
    m = myDate.getMinutes();
    ms = myDate.getMilliseconds();
    s = myDate.getSeconds();

  }

  function moreCCW() {

    ANGLE_STEP += 5; 

  }

  function lessCCW() {

    ANGLE_STEP -= 5; 

  }

  function Clear() {

    numx = 0;
    numy = 0;
    xMclik = 0.4;
    yMclik = 0.4;
    dist = 0;
    xMdragTot = 0;
    yMdragTot = 0;

	}

  function makeSphere() {

    var slices = 13;
    var sliceVerts  = 27;
    var topColr = new Float32Array([0.7, 0.7, 0.7]);
    var equColr = new Float32Array([0.3, 0.7, 0.3]);
    var botColr = new Float32Array([0.9, 0.9, 0.9]);
    var sliceAngle = Math.PI/slices;

    sphVerts = new Float32Array(  ((slices * 2* sliceVerts) -2) * floatsPerVertex);

    var cos0 = 0.0;
    var sin0 = 0.0;
    var cos1 = 0.0;
    var sin1 = 0.0;
    var j = 0;
    var isLast = 0;
    var isFirst = 1;

    for(s=0; s<slices; s++) {
      if(s==0) {
        isFirst = 1;
        cos0 = 1.0;
        sin0 = 0.0;
      }
      else {
        isFirst = 0;  
        cos0 = cos1;
        sin0 = sin1;
      }

      cos1 = Math.cos((s+1)*sliceAngle);
      sin1 = Math.sin((s+1)*sliceAngle);

      if(s==slices-1) isLast=1;
      for(v=isFirst; v< 2*sliceVerts-isLast; v++, j+=floatsPerVertex) { 
        if(v%2==0)
        {

          sphVerts[j  ] = sin0 * Math.cos(Math.PI*(v)/sliceVerts);  
          sphVerts[j+1] = sin0 * Math.sin(Math.PI*(v)/sliceVerts);  
          sphVerts[j+2] = cos0;   
          sphVerts[j+3] = 1.0;      
        }
        else {

          sphVerts[j  ] = sin1 * Math.cos(Math.PI*(v-1)/sliceVerts);
          sphVerts[j+1] = sin1 * Math.sin(Math.PI*(v-1)/sliceVerts);
          sphVerts[j+2] = cos1;
          sphVerts[j+3] = 1.0;
        }

        if(s==0) {

          sphVerts[j+4]=topColr[0]; 
          sphVerts[j+5]=topColr[1]; 
          sphVerts[j+6]=topColr[2];

        }

        else if(s%2) {

          sphVerts[j+4]=0; 
          sphVerts[j+5]=0; 
          sphVerts[j+6]=0; 
        }

        else {

          sphVerts[j+4]=Math.random();
          sphVerts[j+5]=equColr[1]; 
          sphVerts[j+6]=botColr[2]; 
        }
      }
    }
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

  }


  function myMouseMove(ev, gl, canvas) {


    if(isDrag==false) return;

    var rect = ev.target.getBoundingClientRect();
    var xp = ev.clientX - rect.left;
    var yp = canvas.height - (ev.clientY - rect.top);

    var x = (xp - canvas.width/2)  /  (canvas.width/2);
    var y = (yp - canvas.height/2) /  (canvas.height/2);

    xMdragTot += (x - xMclik);
    yMdragTot += (y - yMclik);
    xMclik = x;
    yMclik = y;

  }

  function myMouseUp(ev, gl, canvas) {

    var rect = ev.target.getBoundingClientRect();
    var xp = ev.clientX - rect.left;
    var yp = canvas.height - (ev.clientY - rect.top);
    var x = (xp - canvas.width/2)  /  (canvas.width/2);
    var y = (yp - canvas.height/2) /  (canvas.height/2);
    console.log('myMouseUp  (CVV coords  ):  x, y=\t',x,',\t',y);

    isDrag = false;

    xMdragTot += (x - xMclik);
    yMdragTot += (y - yMclik);
    console.log('myMouseUp: xMdragTot,yMdragTot =',xMdragTot,',\t',yMdragTot);

  }


  function myKeyDown(ev) {


    switch(ev.keyCode) {


      case 37:

      numx = numx - 1;
      console.log(' left-arrow.');
      document.getElementById('Result').innerHTML = ' Left Arrow:keyCode=' + ev.keyCode;

      break;

      case 38:

      numy = numy + 1;
      console.log('   up-arrow.');
      document.getElementById('Result').innerHTML = ' Up Arrow:keyCode='+ev.keyCode;

      break;

      case 39:

      numx = numx + 1;
      console.log('right-arrow.');
      document.getElementById('Result').innerHTML = ' Right Arrow:keyCode='+ev.keyCode;

      break;

      case 40:

      numy = numy - 1;
      console.log(' down-arrow.');
      document.getElementById('Result').innerHTML = ' Down Arrow:keyCode='+ev.keyCode;

      break;

      case 82:

      Clear();

      break;

      default:

      console.log('myKeyDown()--keycode=', ev.keyCode, ', charCode=', ev.charCode);
      document.getElementById('Result').innerHTML = 'myKeyDown()--keyCode='+ev.keyCode;

      break;
    }
  }

  function myKeyUp(ev) {

    console.log('myKeyUp()--keyCode='+ev.keyCode+' released.');

  }
