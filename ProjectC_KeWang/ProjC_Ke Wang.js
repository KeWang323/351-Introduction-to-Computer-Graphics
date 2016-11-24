  var VSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  'precision mediump int;\n' +

  '#endif\n' +
  'attribute vec4 a_Position; \n' +
  'attribute vec4 a_Normal; \n' +
  'uniform vec3 u_Kd; \n' +
  'uniform vec3 u_Ke;\n' +
  'uniform vec3 u_Ka;\n' +
  'varying vec3 v_Kd; \n' +
  'uniform vec3 u_Ks;\n' +
  'uniform int u_Kshiny;\n' +
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n' +
  'uniform mat4 u_ModelMatrix; \n' +
  'uniform mat4 u_NormalMatrix; \n' +
  'varying vec4 v_Position; \n' +       
  'varying vec3 v_Normal; \n' +


  'uniform int u_S;\n' +
  'uniform int u_L;\n' +
  'uniform int u_A;\n' +

  'float specTmp1; \n' +
  'float specTmp2; \n' +
  'float att1; \n' +
  'float att2; \n' +

  'uniform vec4 u_eyePosWorld; \n' +
  'varying vec4 v_Color; \n' +
  'struct Lamp{ \n'+
  'vec3 u_LampPos;\n' +
  'vec3 u_LampAmb;\n' +
  'vec3 u_LampDiff;\n' +
  'vec3 u_LampSpec;\n' +
  '};\n'+
  'uniform Lamp Lamp1;\n'+
  'uniform Lamp Lamp2;\n'+

  'void main() { \n' +

  'if (u_S == 1) {\n' +
  'gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +//
  'v_Position = u_ModelMatrix * a_Position;\n' +
  'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  'vec3 normal = normalize(v_Normal);\n' +
  'vec3 lightDirection1 = normalize(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 lightDirection2 = normalize(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
  'float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
  'float nDotL2 = max(dot(lightDirection2, normal), 0.0); \n' +

  'float distance1 = length(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'float distance2 = length(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +


  'if (u_A == 0) {\n' + 
  ' att1 = 1.0;\n' + 
  ' att2 = 1.0;\n' + 
  '};\n' + 
  'if (u_A == 1) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2)));\n' + 
  '};\n' + 
  'if (u_A == 2) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1) * (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2) * (0.08 * distance2)));\n' + 
  '};\n' + 

  'vec3 diffuse = (Lamp1.u_LampDiff * nDotL1 * att1 + Lamp2.u_LampDiff * nDotL2 * att2) * u_Kd;\n' +
  'vec3 emissive = u_Ke;\n' +
  'vec3 ambient = (Lamp1.u_LampAmb * att1 + Lamp2.u_LampAmb * att2) * u_Ka;\n' +

  'if (u_L == 0) { \n' +
  'vec3 reflectionVector1 = reflect(-lightDirection1, normal);\n' +
  'vec3 reflectionVector2 = reflect(-lightDirection2, normal);\n' +
  'specTmp1 = max(dot(reflectionVector1, eyeDirection), 0.0);\n' +
  'specTmp2 = max(dot(reflectionVector2, eyeDirection), 0.0);\n' +
  '}\n' +
  'else{\n' +
  'vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +
  'vec3 H2 = normalize(lightDirection2 + eyeDirection); \n' +
  'specTmp1 = max(dot(H1, normal), 0.0); \n' +
  'specTmp2 = max(dot(H2, normal), 0.0); \n' +
  '}\n' +

  'float nDotH1pK = pow(specTmp1, float(u_Kshiny));\n' +
  'float nDotH2pK = pow(specTmp2, float(u_Kshiny));\n' +


  'vec3 speculr = (Lamp1.u_LampSpec * nDotH1pK * att1 + Lamp2.u_LampSpec * nDotH2pK * att2) * u_Ks;\n' +

  'v_Color =  vec4(emissive + ambient + diffuse + speculr,1.0);\n'+
  '} \n' +

  'else{\n' +
  'gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;\n' +//
  'v_Position = u_ModelMatrix * a_Position; \n' +
  'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  'v_Kd = u_Kd; \n' +
  '};\n' +


  '}\n';

  var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  'precision mediump int;\n' +

  '#endif\n' +

  'struct Lamp{ \n'+
  'vec3 u_LampPos;\n' +
  'vec3 u_LampAmb;\n' +
  'vec3 u_LampDiff;\n' +
  'vec3 u_LampSpec;\n' +

  '};\n'+
  'uniform Lamp Lamp1;\n'+
  'uniform Lamp Lamp2;\n'+

  'uniform vec3 u_Ke;\n' +
  'uniform vec3 u_Ka;\n' +
  'uniform vec3 u_Ks;\n' +
  'uniform vec3 u_Kd;\n' +

  'uniform int u_Kshiny;\n' +
  'uniform int u_L;\n' +
  'uniform int u_S;\n' +
  'uniform int u_A;\n' +
  'float specTmp1; \n' +
  'float specTmp2; \n' +
  'float att1; \n' +
  'float att2; \n' +

  'uniform vec4 u_eyePosWorld; \n' +
  
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_Position;\n' +

  'varying vec4 v_Color;\n'+



  'void main() { \n' +

  'if (u_S == 1) {\n' +
  'gl_FragColor = v_Color;\n' +

  '} \n' +




  'if (u_S == 0) {\n' +
  'vec3 normal = normalize(v_Normal); \n' +
  'vec3 lightDirection1 = normalize(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 lightDirection2 = normalize(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +

  'float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
  'float nDotL2 = max(dot(lightDirection2, normal), 0.0); \n' +

  'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +

  'if (u_L == 0) { \n' +
  'vec3 reflectionVector1 = reflect(-lightDirection1, normal);\n' +
  'vec3 reflectionVector2 = reflect(-lightDirection2, normal);\n' +
  'specTmp1 = max(dot(reflectionVector1, eyeDirection), 0.0);\n' +
  'specTmp2 = max(dot(reflectionVector2, eyeDirection), 0.0);\n' +
  '}\n' +
  'else{\n' +
  'vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +
  'vec3 H2 = normalize(lightDirection2 + eyeDirection); \n' +
  'specTmp1 = max(dot(H1, normal), 0.0); \n' +
  'specTmp2 = max(dot(H2, normal), 0.0); \n' +
  '}\n' +

  'float nDotH1pK = pow(specTmp1, float(u_Kshiny));\n' +
  'float nDotH2pK = pow(specTmp2, float(u_Kshiny));\n' +

  'float distance1 = length(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'float distance2 = length(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +

  'if (u_A == 0) {\n' + 
  ' att1 = 1.0;\n' + 
  ' att2 = 1.0;\n' + 
  '};\n' + 
  'if (u_A == 1) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2)));\n' + 
  '};\n' + 
  'if (u_A == 2) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1) * (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2) * (0.08 * distance2)));\n' + 
  '};\n' + 

  'vec3 emissive = u_Ke;\n' +
  'vec3 ambient = (Lamp1.u_LampAmb * att1 + Lamp2.u_LampAmb * att2) * u_Ka;\n' +
  'vec3 diffuse = (Lamp1.u_LampDiff * nDotL1 * att1+ Lamp2.u_LampDiff * nDotL2 * att2) * u_Kd;\n' +
  'vec3 speculr = (Lamp1.u_LampSpec * nDotH1pK * att1+ Lamp2.u_LampSpec * nDotH2pK * att2) * u_Ks;\n' +
  'gl_FragColor = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +

  '};\n' +




  'if (u_S == 2) {\n' +
  'vec3 normal = normalize(v_Normal); \n' +
  'float distance1 = length(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'float distance2 = length(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +
  'if (u_A == 0) {\n' + 
  ' att1 = 1.0;\n' + 
  ' att2 = 1.0;\n' + 
  '};\n' + 
  'if (u_A == 1) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2)));\n' + 
  '};\n' + 
  'if (u_A == 2) {\n' + 
  ' att1 = (1.0 / (1.0 + (0.08 * distance1) * (0.08 * distance1)));\n' + 
  ' att2 = (1.0 / (1.0 + (0.08 * distance2) * (0.08 * distance2)));\n' + 
  '};\n' + 



  'vec3 objDiffuse1 = Lamp1.u_LampDiff * u_Kd;\n' +
  'vec3 objDiffuse2 = Lamp2.u_LampDiff * u_Kd;\n' +

  'vec3 objSpec1 = Lamp1.u_LampSpec * u_Ks;\n' +
  'vec3 objSpec2 = Lamp2.u_LampSpec * u_Ks;\n' +

  'float roughnessValue = 0.5;\n' + // 0 : smooth, 1: rough
  'float F0 = 0.8;\n' + // fresnel reflectance at normal incidence
  'float k = 0.5;\n' + // fraction of diffuse reflection (specular reflection = 1 - k)

  'float specular1 = 0.0;\n' +
  'float specular2 = 0.0;\n' +

  'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +

  'vec3 lightDirection1 = normalize(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 lightDirection2 = normalize(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +

  'vec3 H1 = normalize(lightDirection1 + eyeDirection); \n' +
  'vec3 H2 = normalize(lightDirection2 + eyeDirection); \n' +
/////////////////////////////////////////////////////////////////
'float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
'float nDotL2 = max(dot(lightDirection2, normal), 0.0); \n' +

'float nDotE = max(dot(normal, eyeDirection), 0.0);\n' +

'float nDotH1 = max(dot(normal, H1), 0.0000001);\n' +
'float nDotH2 = max(dot(normal, H2), 0.0000001);\n' +

'float EDotH1 = max(dot(eyeDirection, H1), 0.0);\n' +
'float EDotH2 = max(dot(eyeDirection, H2), 0.0);\n' +
/////////////////////////////////////////////////////////////////
'float geometric1 = 2.0 * nDotH1 / EDotH1;\n' +
'      geometric1 = min(1.0, geometric1 * min(nDotE, nDotL1));\n' +

'float geometric2 = 2.0 * nDotH2 / EDotH2;\n' +
'      geometric2 = min(1.0, geometric2 * min(nDotE, nDotL2));\n' +
/////////////////////////////////////////////////////////////////
'float mSquared = roughnessValue * roughnessValue;\n' +
/////////////////////////////////////////////////////////////////
'float nDotH1_sq = nDotH1 * nDotH1;\n' +
'float nDotH2_sq = nDotH2 * nDotH2;\n' +
/////////////////////////////////////////////////////////////////
'float nDotH1_sq_r = 1.0 / (nDotH1_sq * mSquared);\n' +
'float nDotH2_sq_r = 1.0 / (nDotH2_sq * mSquared);\n' +
/////////////////////////////////////////////////////////////////
'float roughness1_exp = (nDotH1_sq - 1.0) * nDotH1_sq_r;\n' +
'float roughness2_exp = (nDotH2_sq - 1.0) * nDotH2_sq_r;\n' +
/////////////////////////////////////////////////////////////////
'float roughness1 = exp(roughness1_exp) * nDotH1_sq_r / (4.0 * nDotH1_sq);\n' +
'float roughness2 = exp(roughness2_exp) * nDotH2_sq_r / (4.0 * nDotH2_sq);\n' +
/////////////////////////////////////////////////////////////////
'float fresnel1 = 1.0 / (1.0 + nDotE);\n' +
'float fresnel2 = 1.0 / (1.0 + nDotE);\n' +
/////////////////////////////////////////////////////////////////
'float Rs1 = min(1.0, (fresnel1 * geometric1 * roughness1) / (nDotE * nDotL1 + 0.0000001));\n' +
'float Rs2 = min(1.0, (fresnel2 * geometric2 * roughness2) / (nDotE * nDotL2 + 0.0000001));\n' +
/////////////////////////////////////////////////////////////////

'vec3 ambient = (Lamp1.u_LampAmb * att1 + Lamp2.u_LampAmb * att2) * u_Ka;\n' +



'vec3 finalValue1 = nDotL1 * (objDiffuse1 + objSpec1 * Rs1) * att1;\n' +
'vec3 finalValue2 = nDotL2 * (objDiffuse2 + objSpec2 * Rs2) * att2;\n' +

'gl_FragColor = vec4((ambient + finalValue1 + finalValue2), 1.0);\n' +

'};\n' +

'}\n';

var n;
var s = 0;
var h = 0;
var L = 0;
var K = 0;
var a = 0;
var gl;
var theta = 0;
var omega = 0;
var Beta = 0.0;
var floatsPerVertex = 3;
var ANGLE_STEP =65.0;
var currentAngle = 0.0;
var EyeX = 0.0, EyeY = -4.0, EyeZ = 2.0; 
var LookEyeX = EyeX + Math.sin(theta);
var LookEyeY = LookEyeY = EyeY +  Math.cos(theta);
var LookEyeZ = 2.0;
  var u_ModelMatrix, u_NormalMatrix, u_eyePosWorld, u_ProjMatrix, u_ViewMatrix;//u_MvpMatrix
  var modelMatrix, mvpMatrix, normalMatrix;
  var u_L;
  var u_S;
  var u_A;
  function Lamp(){
  	this.u_LampPos;
  	this.u_LampAmbi;
  	this.u_LampDiff;
  	this.u_LampSpec;
  	this.lampPos  = new Float32Array(3);
  	this.lampAmbi = new Float32Array(3);
  	this.lampDiff = new Float32Array(3);
  	this.lampSpec = new Float32Array(3);
  };
  var Lamp1 = new Lamp;
  var Lamp2 = new Lamp;


  var L2x = -2;
  var L2y = 15;
  var L2z = 4;



  var parameters ={
  	L2AR : 1.0,
  	L2AG : 1.0,
  	L2AB : 1.0,
  	L2DR : 1.0,
  	L2DG : 1.0,
  	L2DB : 1.0,
  	L2SR : 1.0,
  	L2SG : 1.0,
  	L2SB : 1.0
  };



  var u_Ke, u_Ka, u_Kd, u_Ks;
  var myMatter;
  var MATL_RED_PLASTIC = 1;
  var MATL_GRN_PLASTIC = 2;
  var MATL_BLU_PLASTIC = 3;
  var MATL_BLACK_PLASTIC = 4;
  var MATL_BLACK_RUBBER = 5;
  var MATL_BRASS = 6;
  var MATL_BRONZE_DULL = 7;
  var MATL_BRONZE_SHINY = 8;
  var MATL_CHROME = 9;
  var MATL_COPPER_DULL = 10;
  var MATL_COPPER_SHINY = 11;
  var MATL_GOLD_DULL = 12;
  var MATL_GOLD_SHINY = 13;
  var MATL_PEWTER = 14;
  var MATL_SILVER_DULL = 15;
  var MATL_SILVER_SHINY = 16;
  var MATL_EMERALD = 17;
  var MATL_JADE = 18;
  var MATL_OBSIDIAN = 19;
  var MATL_PEARL = 20;
  var MATL_RUBY = 21;
  var MATL_TURQUOISE = 22;
  var DEFAULT = 23;

  function main() {
  var gui = new dat.GUI();
  gui.add(parameters,'L2AR',0.0,1.0);
  gui.add(parameters,'L2AG',0.0,1.0);
  gui.add(parameters,'L2AB',0.0,1.0);
  gui.add(parameters,'L2DR',0.0,1.0);
  gui.add(parameters,'L2DG',0.0,1.0);
  gui.add(parameters,'L2DB',0.0,1.0);
  gui.add(parameters,'L2SR',0.0,1.0);
  gui.add(parameters,'L2SG',0.0,1.0);
  gui.add(parameters,'L2SB',0.0,1.0);
  	var canvas = document.getElementById('webgl');

  	gl = getWebGLContext(canvas);
  	if (!gl) {
  		console.log('Failed to get the rendering context for WebGL');
  		return;
  	}

  	if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
  		console.log('Failed to intialize shaders.');
  		return;
  	}

  	n = initVertexBuffers(gl);
  	if (n < 0) {
  		console.log('Failed to set the vertex information');
  		return;
  	}
  	document.onkeydown = function(ev){ keydown(ev); };


  	gl.clearColor(0.0, 0.0, 0.0, 1.0);
  	gl.enable(gl.DEPTH_TEST);

  	u_eyePosWorld = gl.getUniformLocation(gl.program, 'u_eyePosWorld');
  	u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  	u_NormalMatrix = gl.getUniformLocation(gl.program,'u_NormalMatrix');
  	u_ProjMatrix = gl.getUniformLocation(gl.program,   'u_ProjMatrix');
  	u_ViewMatrix = gl.getUniformLocation(gl.program,   'u_ViewMatrix');
  	if (!u_ModelMatrix  || !u_ProjMatrix || !u_NormalMatrix || !u_eyePosWorld || !u_ViewMatrix) {
  		console.log('Failed to get matrix storage locations');
  		return;
  	}

  	getUniLoc(Lamp1,'Lamp1.u_LampPos','Lamp1.u_LampAmb','Lamp1.u_LampDiff','Lamp1.u_LampSpec');
  	getUniLoc(Lamp2,'Lamp2.u_LampPos','Lamp2.u_LampAmb','Lamp2.u_LampDiff','Lamp2.u_LampSpec');


  	u_Ke = gl.getUniformLocation(gl.program, 'u_Ke');
  	u_Ka = gl.getUniformLocation(gl.program, 'u_Ka');
  	u_Kd = gl.getUniformLocation(gl.program, 'u_Kd');
  	u_Ks = gl.getUniformLocation(gl.program, 'u_Ks');
  	u_Kshiny = gl.getUniformLocation(gl.program, 'u_Kshiny');
  	u_L = gl.getUniformLocation(gl.program, 'u_L');
  	u_S = gl.getUniformLocation(gl.program, 'u_S');
  	u_A = gl.getUniformLocation(gl.program, 'u_A');
  	if(!u_Ke || !u_Ka || !u_Kd || !u_Ks || !u_Kshiny || !u_L || !u_S || !u_A) {
  		console.log('Failed to get the Phong Reflectance storage locations');
  		return;
  	}

  	Lamp1.lampPos.set([EyeX, EyeY, EyeZ]);
  	Lamp1.lampAmbi.set([1.0, 1.0, 1.0]);
  	Lamp1.lampDiff.set([1.0, 1.0, 1.0]);
  	Lamp1.lampSpec.set([1.0, 1.0, 1.0]);
  	setLamp(Lamp1);

  	Lamp2.lampPos.set([L2x, L2y, L2z]);
  	Lamp2.lampAmbi.set([parameters.L2AR, parameters.L2AG, parameters.L2AB]);
  	Lamp2.lampDiff.set([parameters.L2DR, parameters.L2DG, parameters.L2DB]);
  	Lamp2.lampSpec.set([parameters.L2SR, parameters.L2SG, parameters.L2SB]);
  	setLamp(Lamp2);

  	modelMatrix = new Matrix4();
  	viewMatrix = new Matrix4();
  	normalMatrix = new Matrix4();
  	projMatrix = new Matrix4();

  	winResize();

  	var tick = function() {

  		if (h %2 ) {
  			Lamp1.lampAmbi.set([0.0, 0.0, 0.0]);//眼灯
  			Lamp1.lampDiff.set([0.0, 0.0, 0.0]);
  			Lamp1.lampSpec.set([0.0, 0.0, 0.0]);
  			setLamp(Lamp1);
  		} 
  		else{
  			Lamp1.lampAmbi.set([1.0, 1.0, 1.0]);
  			Lamp1.lampDiff.set([1.0, 1.0, 1.0]);
  			Lamp1.lampSpec.set([1.0, 1.0, 1.0]);
  			setLamp(Lamp1);
  		}

  		if (s %2 ) {
  			Lamp2.lampAmbi.set([0.0, 0.0, 0.0]);//顶灯
  			Lamp2.lampDiff.set([0.0, 0.0, 0.0]);
  			Lamp2.lampSpec.set([0.0, 0.0, 0.0]);
  			setLamp(Lamp2);
  		} 
  		else{
  			Lamp2.lampPos.set([L2x, L2y, L2z]);
  			Lamp2.lampAmbi.set([parameters.L2AR, parameters.L2AG, parameters.L2AB]);
  			Lamp2.lampDiff.set([parameters.L2DR, parameters.L2DG, parameters.L2DB]);
  			Lamp2.lampSpec.set([parameters.L2SR, parameters.L2SG, parameters.L2SB]);
  			setLamp(Lamp2);
  		}

  		n = initVertexBuffers(gl);

  		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  		currentAngle = animate(currentAngle);

  		draw(gl, canvas);

  		requestAnimationFrame(tick, canvas);   

  	};

  	tick();
  }

  function draw(gl, canvas){


  	gl.uniform4f(u_eyePosWorld, EyeX, EyeY,EyeZ, 1);

  	Lamp1.lampPos.set([EyeX, EyeY, EyeZ]);
  	setLamp(Lamp1);
  	Lamp2.lampPos.set([L2x, L2y, L2z]);
  	setLamp(Lamp2);

  	gl.viewport(0 , 0, innerWidth, innerHeight);

  	var vpAspect = innerWidth / innerHeight;
  	projMatrix.setPerspective(40, vpAspect, 1, 100);
  	viewMatrix.setLookAt(EyeX,  EyeY, EyeZ, LookEyeX, LookEyeY, LookEyeZ, 0,  0, 1);
  	gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
  	gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);



  	modelMatrix.setScale(0.5,0.5,0.5);


    //-------------------------------------红球-------------------------------------//
    pushMatrix(modelMatrix);
    myMatter =  Material(1);
    setMaterial(myMatter);
    modelMatrix.translate( 0, 15, 3);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);


    //-------------------------------------绿球-------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter =  Material(2);
    setMaterial(myMatter);
    modelMatrix.translate( 5, 5, 4.7553);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);


    //-------------------------------------蓝球-------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(3);
    setMaterial(myMatter);
    modelMatrix.translate( -10, 10, 0);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);


    //-------------------------------------灰球-------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(9);
    setMaterial(myMatter);
    modelMatrix.translate( -12, 20, 0);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);


    //-------------------------------------灯球-------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(15);
    setMaterial(myMatter);
    modelMatrix.translate( 2*L2x, 2*L2y, 2*L2z);
    modelMatrix.scale(0.5, 0.5, 0.5);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawElements(gl.TRIANGLES, n, gl.UNSIGNED_SHORT, 0);


    //-------------------------------------正面地面 -------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(22);
    setMaterial(myMatter);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();


    //-------------------------------------背面地面 -------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(22);
    setMaterial(myMatter);

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();

    modelMatrix.translate(0.0,-10.0,0.0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    drawplane();


    //-------------------------------------第一个尾巴 -------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(7);
    setMaterial(myMatter);

    modelMatrix.translate(-10.0, 10.0, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);


    //-------------------------------------第二个尾巴 -------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter = new Material(7);
    setMaterial(myMatter);

    modelMatrix.translate(5.0, 5.0, 4.7553);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);


    //-------------------------------------第三个尾巴 -------------------------------------//
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    myMatter =  Material(7);
    setMaterial(myMatter);

    modelMatrix.translate(-15.0, 30.0, 0.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);

    modelMatrix.translate(0.0, 0.0, 1.0);
    modelMatrix.rotate(Math.abs(currentAngle * 0.2), 0, 1, 0);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    setNorm();
    gl.drawArrays(gl.TRIANGLES, mypointsstart/floatsPerVertex, mypoints.length/floatsPerVertex);   
}


function initVertexBuffers(gl) {
	var c30 = Math.sqrt(0.75);
	var sq2 = Math.sqrt(2.0);
	var sq6 = Math.sqrt(6.0);

	makeGroundGrid();
	var SPHERE_DIV = 13;
	var i, ai, si, ci;
	var j, aj, sj, cj;
	var p1, p2;
	var balls = [];
	var indices = [];
	for (j = 0; j <= SPHERE_DIV; j++) {
		aj = j * Math.PI / SPHERE_DIV;
		sj = Math.sin(aj);
		cj = Math.cos(aj);
		for (i = 0; i <= SPHERE_DIV; i++) {
			ai = i * 2 * Math.PI / SPHERE_DIV;
			si = Math.sin(ai);
			ci = Math.cos(ai);
			balls.push(si * sj);
			balls.push(cj);
			balls.push(ci * sj);
		}  
	}

	ballspositions = new Float32Array(balls);mypoints = new Float32Array([
		0.0,  -sq2,0.5,     -c30, 0.0,0.0,    0.0,  0.0,1.5,
		0.0,  -sq2,0.5,     0.0,  0.0,1.5,   c30, 0.0,0.0, 
		0.0,  -sq2,0.5,    c30, 0.0,0.0,    -c30, 0.0,0.0, 
		c30, 0.0,0.0,     0.0,  0.0,1.5,    -c30, 0.0,0.0, 
		]);

 // mypoints = new Float32Array([
 //  0.0 * Math.cos(Beta * 0.5) + sq2 * Math.sin(Beta * 0.5),//1
 //  0.0 * Math.sin(Beta * 0.5) - sq2 * Math.cos(Beta * 0.5),
 //  0.5,    
 //  -c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//2
 //  -c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0,   
 //  0.0 * Math.cos(Beta * 1.5) - 0.0 * Math.sin(Beta * 1.5),
 //  0.0 * Math.sin(Beta * 1.5) + 0.0 * Math.cos(Beta * 1.5),
 //  1.5,
 //  0.0 * Math.cos(Beta * 0.5) + sq2 * Math.sin(Beta * 0.5),//1
 //  0.0 * Math.sin(Beta * 0.5) - sq2 * Math.cos(Beta * 0.5),
 //  0.5,      
 //  0.0 * Math.cos(Beta * 1.5) - 0.0 * Math.sin(Beta * 1.5),
 //  0.0 * Math.sin(Beta * 1.5) + 0.0 * Math.cos(Beta * 1.5),
 //  1.5,  
 //  c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//6
 //  c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0,
 //  0.0 * Math.cos(Beta * 0.5) + sq2 * Math.sin(Beta * 0.5),//1
 //  0.0 * Math.sin(Beta * 0.5) - sq2 * Math.cos(Beta * 0.5),
 //  0.5,     
 //  c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//6
 //  c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0,
 //  -c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//2
 //  -c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0, 
 //  c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//6
 //  c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0,
 //  0.0 * Math.cos(Beta * 1.5) - 0.0 * Math.sin(Beta * 1.5),
 //  0.0 * Math.sin(Beta * 1.5) + 0.0 * Math.cos(Beta * 1.5),
 //  1.5,   
 //  -c30 * Math.cos(Beta * 0.0) - 0.0 * Math.sin(Beta * 0.0),//2
 //  -c30 * Math.sin(Beta * 0.0) + 0.0 * Math.cos(Beta * 0.0),
 //  0.0,  
 //  ]);

  positions = new Float32Array (ballspositions.length + gndVerts1.length + gndVerts2.length + mypoints.length);
  ballsstart = 0;
  for(i=0,j=0; j< ballspositions.length; i++,j++) {
  	positions[i] = ballspositions[j];
  }
  gndVertsstart1 = i;
  for(j=0; j< gndVerts1.length; i++, j++) {
  	positions[i] = gndVerts1[j];
  }
  gndVertsstart2 = i;
  for(j=0; j< gndVerts2.length; i++, j++) {
  	positions[i] = gndVerts2[j];
  }
  mypointsstart = i;
  for (j=0; j< mypoints.length; i++, j++) {
  	positions[i] = mypoints[j];
  };
  for (j = 0; j < SPHERE_DIV; j++) {
  	for (i = 0; i < SPHERE_DIV; i++) {
  		p1 = j * (SPHERE_DIV+1) + i;
  		p2 = p1 + (SPHERE_DIV+1);
  		indices.push(p1);
  		indices.push(p2);
  		indices.push(p1 + 1);
  		indices.push(p1 + 1);
  		indices.push(p2);
  		indices.push(p2 + 1);
  	}
  }
  var normals1 = new Float32Array([

  	-sq6, -1,sq2,   -sq6,-1,sq2,   -sq6, -1,sq2, 
  	sq6, -1,sq2,   sq6, -1,sq2,   sq6, -1,sq2, 
  	0, -1,-2*sq2,   0, -1,-2*sq2,   0, -1,-2*sq2, 
  	0, 1,0,       0, 1,0,       0, -1,0,  
  	]);

  var normals2 = new Float32Array([
  	// 0,-14.6946,25,
  	// 0,-14.6946,25,
  	// 0,-14.6946,25,
  	// -9.081781600067007,-23.776412907378838,25,
  	// 0,-23.776412907378838,25,
  	// 0,-23.776412907378840,25,
  	// 0,-23.776412907378840,25,
  	// 9.081781600067009,-14.694631307311832,25,
  	// 0,-14.694631307311832,25,
  	// 14.694631307311830,0,25,
  	// 0,0,25,
  	// 14.694631307311827,14.694631307311825,25,
  	// 0,14.694631307311825,25,
  	// 9.081781600067010,23.776412907378838,25,
  	// 0,23.776412907378838,25,
  	// 0,23.776412907378840,25,
  	// 0,23.776412907378840,25,
  	// -9.081781600067007,14.694631307311834,25,
  	// 0,14.694631307311834,25,
  	// -14.694631307311827,0,25,
  	// 0,-14.6946,25,
  	// 0,-14.6946,25,
  	// 0,-14.6946,25,
  	// -9.081781600067007,-23.776412907378838,25,
  	// 0,-23.776412907378838,25,
  	// 0,-23.776412907378840,25,
  	// 0,-23.776412907378840,25,
  	// 9.081781600067009,-14.694631307311832,25,
  	// 0,-14.694631307311832,25,
  	// 14.694631307311830,0,25,
  	// 0,0,25,
  	// 14.694631307311827,14.694631307311825,25,
  	// 0,14.694631307311825,25,
  	// 9.081781600067010,23.776412907378838,25,
  	// 0,23.776412907378838,25,
  	// 0,23.776412907378840,25,
  	// 0,23.776412907378840,25,
  	// -9.081781600067007,14.694631307311834,25,
  	// 0,14.694631307311834,25,
  	// -14.694631307311827,0,25,
  	// 0,-14.6946,25,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1
  	]);

  var normals3 = new Float32Array([
  	// 0, 14.6946,25,
  	// 0, 14.6946,25,
  	// 0, 14.6946,25,
  	// -9.081781600067007,23.776412907378838,25,
  	// 0, 23.776412907378838,25,
  	// 0, 23.776412907378840,25,
  	// 0, 23.776412907378840,25,
  	// 9.081781600067009,14.694631307311832,25,
  	// 0, 14.694631307311832,25,
  	// 14.694631307311830,0,25,
  	// 0,0,25,
  	// 14.694631307311827,-14.694631307311825,25,
  	// 0,-14.694631307311825,25,
  	// 9.081781600067010,-23.776412907378838,25,
  	// 0,-23.776412907378838,25,
  	// 0,-23.776412907378840,25,
  	// 0,-23.776412907378840,25,
  	// -9.081781600067007,-14.694631307311834,25,
  	// 0,-14.694631307311834,25,
  	// -14.694631307311827,0,25,
  	// 0, 14.6946,25,
  	// 0, 14.6946,25,
  	// 0, 14.6946,25,
  	// -9.081781600067007,23.776412907378838,25,
  	// 0, 23.776412907378838,25,
  	// 0, 23.776412907378840,25,
  	// 0, 23.776412907378840,25,
  	// 9.081781600067009,14.694631307311832,25,
  	// 0,14.694631307311832,25,
  	// 14.694631307311830,0,25,
  	// 0,0,25,
  	// 14.694631307311827,-14.694631307311825,25,
  	// 0,-14.694631307311825,25,
  	// 9.081781600067010,-23.776412907378838,25,
  	// 0,-23.776412907378838,25,
  	// 0,-23.776412907378840,25,
  	// 0,-23.776412907378840,25,
  	// -9.081781600067007,-14.694631307311834,25,
  	// 0,-14.694631307311834,25,
  	// -14.694631307311827,0,25,
  	// 0,14.6946,25,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1, 0,0,1,
0,0,1

  	]);

  var normals = new Float32Array(ballspositions.length + gndVerts1.length + gndVerts2.length + mypoints.length);
  for(i=0,j=0; j< ballspositions.length; i++,j++) {
  	normals[i] = ballspositions[j];
  }
  for(j=0; j< gndVerts1.length; i++, j++) {
  	normals[i] = normals2[j];

  }
  for(j=0; j< gndVerts2.length; i++, j++) {
  	normals[i] = normals3[j];

  }
  for(j=0; j< mypoints.length; i++, j++) {
  	normals[i] = normals1[j];
  }

  if (!initArrayBuffer(gl, 'a_Position', positions, gl.FLOAT, 3)) return -1;
  if (!initArrayBuffer(gl, 'a_Normal', normals, gl.FLOAT, 3))  return -1;
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) {
  	console.log('Failed to create the buffer object');
  	return -1;
  }
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  return indices.length;
}

function initArrayBuffer(gl, attribute, data, type, num) {
	var buffer = gl.createBuffer();
	if (!buffer) {
		console.log('Failed to create the buffer object');
		return false;
	}
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

function keydown(ev) {
	switch(ev.keyCode) {
  		 case 37://左箭头
  		 theta -= 0.05;
  		 LookEyeX = EyeX + Math.sin(theta);
  		 LookEyeY = EyeY +  Math.cos(theta);
  		 break
  		 case 39://右箭头
  		 theta += 0.05;
  		 LookEyeX = EyeX + Math.sin(theta);
  		 LookEyeY = EyeY +  Math.cos(theta);
  		 break
  		 case 38://上箭头
  		 omega += 0.05;
  		 LookEyeZ = EyeZ + Math.sin(omega);
  		 break
  		 case 40://下箭头
  		 omega -= 0.05;
  		 LookEyeZ = EyeZ + Math.sin(omega);
  		 break
  		 case 65://A左移
  		 EyeX -= 0.2 * Math.cos(theta) * Math.cos(omega);
  		 EyeY += 0.2 * Math.sin(theta) * Math.cos(omega);
  		 LookEyeX -= 0.2 * Math.cos(theta) * Math.cos(omega);
  		 LookEyeY += 0.2 * Math.sin(theta) * Math.cos(omega);
  		 break;
  		 case 68://D右移
  		 EyeX += 0.2 * Math.cos(theta) * Math.cos(omega);
  		 EyeY -= 0.2 * Math.sin(theta) * Math.cos(omega);
  		 LookEyeX += 0.2 * Math.cos(theta) * Math.cos(omega);
  		 LookEyeY -= 0.2 * Math.sin(theta) * Math.cos(omega);
  		 break
       case 87://W进
       EyeX += 0.2 * Math.sin(theta) * Math.cos(omega);
       EyeY += 0.2 * Math.cos(theta) * Math.cos(omega);
       EyeZ += 0.2 * Math.sin(omega);
       LookEyeX += 0.2 * Math.sin(theta) * Math.cos(omega);
       LookEyeY += 0.2 * Math.cos(theta) * Math.cos(omega);
       LookEyeZ += 0.2 * Math.sin(omega);
       break
       case 83://S退
       EyeX -= 0.2 * Math.sin(theta) * Math.cos(omega);
       EyeY -= 0.2 * Math.cos(theta) * Math.cos(omega);
       EyeZ -= 0.2 * Math.sin(omega);
       LookEyeX -= 0.2 * Math.sin(theta) * Math.cos(omega);
       LookEyeY -= 0.2 * Math.cos(theta) * Math.cos(omega);
       LookEyeZ -= 0.2 * Math.sin(omega);
       break
  		 case 81://Q上升
  		 EyeZ += 0.1;
  		 LookEyeZ += 0.1;
  		 break
  		 case 69://E下降
  		 EyeZ -= 0.1;
  		 LookEyeZ -= 0.1;
  		 break; 
  		 case 84://T
  		 L2y += 0.1;
  		 break
  		 case 71://G
  		 L2y -= 0.1;
  		 break
  		 case 70://F
  		 L2x -= 0.1;
  		 break
  		 case 72://H
  		 L2x += 0.1;
  		 break
  		 case 71://G
  		 L2y -= 0.1;
  		 break
  		 case 82://R 
  		 L2z += 0.1;
  		 break
  		 case 89://Y
  		 L2z -= 0.1;
  		 break
       case 77://R 
       Beta += 0.1;
       break
       case 78://Y
       Beta -= 0.1;
       break
   }
}

function  makeGroundGrid() {

	gndVerts1 = new Float32Array(3*41);

	gndVerts1[0] = -50;
	gndVerts1[1] =   0;
	gndVerts1[2] =   0;
	for (var j=1; j < 20; j++) {
      gndVerts1[6*(j-1)+3    ] = -50 + (j-1) * 5;//2468
      gndVerts1[6*(j-1)+3  +1] = 5;
      gndVerts1[6*(j-1)+3  +2] = 0;//5* Math.sin(j/10 * 2 * Math.PI);        

      gndVerts1[6*j    ] = -50 + j * 5;
      gndVerts1[6*j  +1] = 0;
      gndVerts1[6*j  +2] = 0;      
  };

  gndVerts2 = new Float32Array(3*41);

  gndVerts2[0] = -50;
  gndVerts2[1] =  10;
  gndVerts2[2] =   0;
  for (var j=1; j < 20; j++) {
      gndVerts2[6*(j-1)+3    ] = -50 + (j-1) * 5;//2468
      gndVerts2[6*(j-1)+3  +1] = 5;
      gndVerts2[6*(j-1)+3  +2] = 0;//5* Math.sin(j/10 * 2 * Math.PI);        

      gndVerts2[6*j    ] = -50 + j * 5;
      gndVerts2[6*j  +1] = 10;
      gndVerts2[6*j  +2] = 0;      
  };

}

function winResize() {
	var nuCanvas = document.getElementById('webgl');
	var nuGL = getWebGLContext(nuCanvas);
	nuCanvas.width = 49 * innerWidth/50;
	nuCanvas.height = 42 * innerHeight/52;
	draw(nuGL, nuCanvas); 
}

function Material(materialType)
{
	K_emit = [];
	K_ambi = [];
	K_spec = [];
	K_diff = [];
	K_shiny = 0.0;
	switch(materialType){
  			case MATL_RED_PLASTIC: // 1
  			K_emit.push(0.0,     0.0,    0.0,    1.0);
  			K_ambi.push(0.1,     0.1,    0.1,    1.0);
  			K_diff.push(0.6,     0.0,    0.0,    1.0);
  			K_spec.push(0.6,     0.6,    0.6,    1.0);   
  			K_shiny = 100.0;
  			break;
  			case MATL_GRN_PLASTIC: // 2
  			K_emit.push(0.0,     0.0,    0.0,    1.0);
  			K_ambi.push(0.05,    0.05,   0.05,   1.0);
  			K_diff.push(0.0,     0.6,    0.0,    1.0);
  			K_spec.push(0.2,     0.2,    0.2,    1.0);   
  			K_shiny = 60.0;
  			break;
  			case MATL_BLU_PLASTIC: // 3
  			K_emit.push(0.0,     0.0,    0.0,    1.0);
  			K_ambi.push(0.05,    0.05,   0.05,   1.0);
  			K_diff.push(0.0,     0.2,    0.6,    1.0);
  			K_spec.push(0.1,     0.2,    0.3,    1.0);   
  			K_shiny = 5.0;
  			break;
  			case MATL_BLACK_PLASTIC:
  			K_emit.push(0.0,     0.0,    0.0,    1.0);
  			K_ambi.push(0.0,     0.0,    0.0,    1.0);
  			K_diff.push(0.01,    0.01,   0.01,   1.0);
  			K_spec.push(0.5,     0.5,    0.5,    1.0);   
  			K_shiny = 32.0;
  			break;
  			case MATL_BLACK_RUBBER:
  			K_emit.push(0.0,     0.0,    0.0,    1.0);
  			K_ambi.push(0.02,    0.02,   0.02,   1.0);
  			K_diff.push(0.01,    0.01,   0.01,   1.0);
  			K_spec.push(0.4,     0.4,    0.4,    1.0);   
  			K_shiny = 10.0;
  			break;
  			case MATL_BRASS:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.329412, 0.223529, 0.027451, 1.0);
  			K_diff.push(0.780392, 0.568627, 0.113725, 1.0);
  			K_spec.push(0.992157, 0.941176, 0.807843, 1.0);   
  			K_shiny = 27.8974;
  			break;
  			case MATL_BRONZE_DULL:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.2125,   0.1275,   0.054,    1.0);
  			K_diff.push(0.714,    0.4284,   0.18144,  1.0);
  			K_spec.push(0.393548, 0.271906, 0.166721, 1.0);  
  			K_shiny = 25.6;
  			break;
  			case MATL_BRONZE_SHINY:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.25,     0.148,    0.06475,  1.0);
  			K_diff.push(0.4,      0.2368,   0.1036,   1.0);
  			K_spec.push(0.774597, 0.458561, 0.200621, 1.0);  
  			K_shiny = 76.8;
  			break;
  			case MATL_CHROME:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.25,     0.25,     0.25,     1.0);
  			K_diff.push(0.4,      0.4,      0.4,      1.0);
  			K_spec.push(0.774597, 0.774597, 0.774597, 1.0);  
  			K_shiny = 76.8;
  			break;
  			case MATL_COPPER_DULL:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.19125,  0.0735,   0.0225,   1.0);
  			K_diff.push(0.7038,   0.27048,  0.0828,   1.0);
  			K_spec.push(0.256777, 0.137622, 0.086014, 1.0);  
  			K_shiny = 12.8;
  			break;
  			case MATL_COPPER_SHINY:
  			K_emit.push(0.0,      0.0,      0.0,       1.0);
  			K_ambi.push(0.2295,   0.08825,  0.0275,    1.0);
  			K_diff.push(0.5508,   0.2118,   0.066,     1.0);
  			K_spec.push(0.580594, 0.223257, 0.0695701, 1.0);  
  			K_shiny = 51.2;
  			break;
  			case MATL_GOLD_DULL:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.24725,  0.1995,   0.0745,   1.0);
  			K_diff.push(0.75164,  0.60648,  0.22648,  1.0);
  			K_spec.push(0.628281, 0.555802, 0.366065, 1.0);  
  			K_shiny = 51.2;
  			break;
  			case MATL_GOLD_SHINY:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.24725,  0.2245,   0.0645,   1.0);
  			K_diff.push(0.34615,  0.3143,   0.0903,   1.0);
  			K_spec.push(0.797357, 0.723991, 0.208006, 1.0);  
  			K_shiny = 83.2;
  			break;
  			case MATL_PEWTER:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.105882, 0.058824, 0.113725, 1.0);
  			K_diff.push(0.427451, 0.470588, 0.541176, 1.0);
  			K_spec.push(0.333333, 0.333333, 0.521569, 1.0);  
  			K_shiny = 9.84615;
  			break;
  			case MATL_SILVER_DULL:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.19225,  0.19225,  0.19225,  1.0);
  			K_diff.push(0.50754,  0.50754,  0.50754,  1.0);
  			K_spec.push(0.508273, 0.508273, 0.508273, 1.0);  
  			K_shiny = 51.2;
  			break;
  			case MATL_SILVER_SHINY:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.23125,  0.23125,  0.23125,  1.0);
  			K_diff.push(0.2775,   0.2775,   0.2775,   1.0);
  			K_spec.push(0.773911, 0.773911, 0.773911, 1.0);  
  			K_shiny = 89.6;
  			break;
  			case MATL_EMERALD:
  			K_emit.push(0.0,     0.0,      0.0,     1.0);
  			K_ambi.push(0.0215,  0.1745,   0.0215,  0.55);
  			K_diff.push(0.07568, 0.61424,  0.07568, 0.55);
  			K_spec.push(0.633,   0.727811, 0.633,   0.55);   
  			K_shiny = 76.8;
  			break;
  			case MATL_JADE:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.135,    0.2225,   0.1575,   0.95);
  			K_diff.push(0.54,     0.89,     0.63,     0.95);
  			K_spec.push(0.316228, 0.316228, 0.316228, 0.95);   
  			K_shiny = 12.8;
  			break;
  			case MATL_OBSIDIAN:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.05375,  0.05,     0.06625,  0.82);
  			K_diff.push(0.18275,  0.17,     0.22525,  0.82);
  			K_spec.push(0.332741, 0.328634, 0.346435, 0.82);   
  			K_shiny = 38.4;
  			break;
  			case MATL_PEARL:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.25,     0.20725,  0.20725,  0.922);
  			K_diff.push(1.0,      0.829,    0.829,    0.922);
  			K_spec.push(0.296648, 0.296648, 0.296648, 0.922);   
  			K_shiny = 11.264;
  			break;
  			case MATL_RUBY:
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.1745,   0.01175,  0.01175,  0.55);
  			K_diff.push(0.61424,  0.04136,  0.04136,  0.55);
  			K_spec.push(0.727811, 0.626959, 0.626959, 0.55);   
  			K_shiny = 76.8;
  			break;
  			case MATL_TURQUOISE: // 22
  			K_emit.push(0.0,      0.0,      0.0,      1.0);
  			K_ambi.push(0.1,      0.18725,  0.1745,   0.8);
  			K_diff.push(0.396,    0.74151,  0.69102,  0.8);
  			K_spec.push(0.297254, 0.30829,  0.306678, 0.8);   
  			K_shiny = 12.8;
  			break;

  			default:
  			K_emit.push(0.5, 0.0, 0.0, 1.0);
  			K_ambi.push(0.0, 0.0, 0.0, 1.0);
  			K_diff.push(0.0, 0.0, 0.0, 1.0);
  			K_spec.push(0.0, 0.0, 0.0, 1.0);
  			K_shiny = 1.0;
  			break;
  		}
  		return {emissive: K_emit, ambient: K_ambi, diffuse: K_diff, specular: K_spec, shiny: K_shiny};
  	}

  	function getUniLoc(Light, u_Pos, u_Amb, u_Diff, u_Spec){
  		Light.u_LampPos  = gl.getUniformLocation(gl.program,u_Pos);
  		Light.u_LampAmb  = gl.getUniformLocation(gl.program,u_Amb);
  		Light.u_LampDiff = gl.getUniformLocation(gl.program,u_Diff);
  		Light.u_LampSpec = gl.getUniformLocation(gl.program,u_Spec);
  		if( !Light.u_LampPos || !Light.u_LampAmb || !Light.u_LampDiff || !Light.u_LampSpec) {
  			console.log('Failed to get the Lamp0 storage locations');
  			return;
  		}
  	}

  	function setLamp(Lamp){
  		gl.uniform3fv(Lamp.u_LampPos,  Lamp.lampPos); 
  		gl.uniform3fv(Lamp.u_LampAmbi, Lamp.lampAmbi);
  		gl.uniform3fv(Lamp.u_LampDiff, Lamp.lampDiff);
  		gl.uniform3fv(Lamp.u_LampSpec, Lamp.lampSpec);
  	}

  	function setMaterial(material){
  		gl.uniform3f(u_Ke, material.emissive[0], material.emissive[1], material.emissive[2]);
  		gl.uniform3f(u_Ka, material.ambient[0], material.ambient[1], material.ambient[2]);
  		gl.uniform3f(u_Kd, material.diffuse[0], material.diffuse[1], material.diffuse[2]);
  		gl.uniform3f(u_Ks, material.specular[0], material.specular[1], material.specular[2]);
  		gl.uniform1i(u_Kshiny, material.shiny);
  	}

  	function shadering(){
  		K += 1;
  		gl.uniform1i(u_S, K%3);
  		if (K%3 == 1) {
  			document.getElementById('shadering').innerHTML = 'Gouraud';
  			if (L%2 == 0) {
  				document.getElementById('lighting').innerHTML = 'Phong';
  			}
  			else{
  				document.getElementById('lighting').innerHTML = 'Blinn-Phong'; 
  			};  
  		}
  		if (K%3 == 0) {
  			document.getElementById('shadering').innerHTML = 'Phong';
  			if (L%2 == 0) {
  				document.getElementById('lighting').innerHTML = 'Phong';
  			}
  			else{
  				document.getElementById('lighting').innerHTML = 'Blinn-Phong'; 
  			};  
  		};
  		if (K%3 == 2) {
  			document.getElementById('shadering').innerHTML = 'Cook-Torrance'; 
  			document.getElementById('lighting').innerHTML = 'Invalid';
  		};
  	}

  	function lighting(){
  		L += 1;
  		gl.uniform1i(u_L, L%2);
  		if (K%3 != 2) {
  			if (L%2 == 0) {
  				document.getElementById('lighting').innerHTML = 'Phong';
  			}
  			else{
  				document.getElementById('lighting').innerHTML = 'Blinn-Phong'; 
  			};      	
  		};

  	}

  	function WorldLight(){
  		s += 1;
  		if (s%2) {
  			document.getElementById('world').innerHTML = 'Off';
  		}
  		else{
  			document.getElementById('world').innerHTML = 'On'; 
  		};
  	}

  	function HeadLight(){
  		h += 1;
  		if (h%2) {
  			document.getElementById('head').innerHTML = 'Off';
  		}
  		else{
  			document.getElementById('head').innerHTML = 'On'; 
  		};
  	}

  	function att(){
  		a += 1;
  		gl.uniform1i(u_A, a%3);
  		switch(a%3){
  			case 0:
  			document.getElementById('atten').innerHTML = 'None';
  			break
  			case 1:
  			document.getElementById('atten').innerHTML = '1/dist';
  			break
  			case 2:
  			document.getElementById('atten').innerHTML = '1/dist^2';
  			break        
  		}
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

  	function setNorm(){
  		normalMatrix.setInverseOf(modelMatrix);
  		normalMatrix.transpose();
  		gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
  	}

  	function drawplane(){
  		gl.drawArrays(gl.TRIANGLE_STRIP, gndVertsstart1/floatsPerVertex, gndVerts1.length/floatsPerVertex);
  		gl.drawArrays(gl.TRIANGLE_STRIP, gndVertsstart2/floatsPerVertex, gndVerts2.length/floatsPerVertex);
  	}




