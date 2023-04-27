import initShaders from "./initShaders.js";

let canvas = document.getElementById("webgl");
let gl = canvas.getContext("webgl");

let vertexSource = `
  attribute vec2 a_position;
  uniform float u_size;
  varying vec2 v_xx;

  void main() {
    v_xx = a_position;
    gl_Position = vec4(a_position, 0.0, 1.0);
    gl_PointSize = u_size;
  }
`;
let fragmentSource = `
  precision mediump float;
  uniform vec3 u_color;
  varying vec2 v_xx;

  void main() {
    gl_FragColor = vec4(v_xx, 0.0, 1.0);
  }
`;

initShaders(gl, vertexSource, fragmentSource);

// 清空canvas画布
gl.clearColor(0.9, 0.5, 0.5, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER)

// (1). Attribute (vertexShader): 将js中的数据传给vertexShader
let a_position = gl.getAttribLocation(gl.program, "a_position");
gl.vertexAttrib2f(a_position, -0.5, 0.5)

// (2). Uniform (vertexShader/fragmentShader): 将js中的数据传给vertexShader/fragmentShader
let u_color = gl.getUniformLocation(gl.program, "u_color");
gl.uniform3f(u_color, 0.0, 1.0, 0.0)

let u_size = gl.getUniformLocation(gl.program, 'u_size')
gl.uniform1f(u_size, 30.0)

// (3). Varying: 将vertexShader中的数据传给fragmentShader


// 画一个点
gl.drawArrays(gl.POINTS, 0, 1);
