  var VSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  'precision mediump int;\n' +

  '#endif\n' +
  'attribute vec4 a_Position; \n' +
  'attribute vec4 a_Normal; \n' +
  'uniform vec3 u_Kd; \n' +
  'varying vec3 v_Kd; \n' +
  'uniform vec3 u_Ks;\n' +
  'uniform int u_Kshiny;\n' +
  'uniform mat4 u_MvpMatrix; \n' +
  'uniform mat4 u_ModelMatrix; \n' +
  'uniform mat4 u_NormalMatrix; \n' +
  'varying vec4 v_Position; \n' +       
  'varying vec3 v_Normal; \n' +


  'uniform int u_S;\n' +
  'uniform int u_L;\n' +

  'float specTmp1; \n' +
  'float specTmp2; \n' +

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
  'gl_Position = u_MvpMatrix * a_Position;\n' +
  'v_Position = u_ModelMatrix * a_Position;\n' +
  'v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  'vec3 normal = normalize(v_Normal);\n' +
  'vec3 lightDirection1 = normalize(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 lightDirection2 = normalize(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +
  'float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
  'float nDotL2 = max(dot(lightDirection2, normal), 0.0); \n' +
  'vec3 diffuse = (Lamp1.u_LampDiff * nDotL1 + Lamp2.u_LampDiff * nDotL2) * u_Kd;\n' +


  'if (u_L == 1) { \n' +
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

  'vec3 speculr = (Lamp1.u_LampSpec * nDotH1pK + Lamp2.u_LampSpec * nDotH2pK) * u_Ks;\n' +

  'v_Color =  vec4(diffuse + speculr,1.0);\n'+
  '} \n' +

  'else{\n' +
  'gl_Position = u_MvpMatrix * a_Position;\n' +
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
  'uniform int u_Kshiny;\n' +
  'uniform int u_L;\n' +
  'uniform int u_S;\n' +
  'float specTmp1; \n' +
  'float specTmp2; \n' +

  'uniform vec4 u_eyePosWorld; \n' +
  
  'varying vec3 v_Normal;\n' +
  'varying vec4 v_Position;\n' +
  'varying vec3 v_Kd; \n' +

  'varying vec4 v_Color;\n'+



  'void main() { \n' +

  'if (u_S == 1) {\n' +
  'gl_FragColor = v_Color;\n' +

  '} \n' +
  'else{\n' +
  'vec3 normal = normalize(v_Normal); \n' +
  'vec3 lightDirection1 = normalize(Lamp1.u_LampPos.xyz - v_Position.xyz);\n' +
  'vec3 lightDirection2 = normalize(Lamp2.u_LampPos.xyz - v_Position.xyz);\n' +

  'float nDotL1 = max(dot(lightDirection1, normal), 0.0); \n' +
  'float nDotL2 = max(dot(lightDirection2, normal), 0.0); \n' +

  'vec3 eyeDirection = normalize(u_eyePosWorld.xyz - v_Position.xyz); \n' +

  'if (u_L == 1) { \n' +
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

  'vec3 emissive = u_Ke;\n' +
  'vec3 ambient = (Lamp1.u_LampAmb + Lamp2.u_LampAmb) * u_Ka;\n' +
  'vec3 diffuse = (Lamp1.u_LampDiff * nDotL1 + Lamp2.u_LampDiff * nDotL2) * v_Kd;\n' +
  'vec3 speculr = (Lamp1.u_LampSpec * nDotH1pK + Lamp2.u_LampSpec * nDotH2pK) * u_Ks;\n' +
  'gl_FragColor = vec4(emissive + ambient + diffuse + speculr, 1.0);\n' +

  '};\n' +


  '}\n';