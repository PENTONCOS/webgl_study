import initShaders from "./initShaders.js";

let canvas = document.getElementById("webgl");
let gl = canvas.getContext("webgl");

let vertexSource = `
  void main() {
    gl_Position = vec4(0.0, 0.0, 0.0, 1.0);
    gl_PointSize = 10.0;
  }
`;
let fragmentSource = `
  void main() {
    gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);
  }
`;

initShaders(gl, vertexSource, fragmentSource);


// 清空canvas画布
gl.clearColor(0.5, 0.5, 0.5, 1.0)
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER)


gl.drawArrays(gl.POINTS, 0, 1);