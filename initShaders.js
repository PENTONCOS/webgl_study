function createShader(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);

  gl.compileShader(shader);

  let compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS)
  if (compiled) {
    return shader;
  } else {
    let error = gl.getShaderInfoLog(shader);
    console.error("Couldn't compile shader" + error);
    gl.deleteShader(shader);
    return null;
  }
}

function createProgram(gl, vertexShader, fragmentSource) {
  let program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentSource);

  gl.linkProgram(program);

  let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (linked) {
    gl.useProgram(program);
    return program;
  } else {
    let error = gl.getProgramInfoLog(program);
    console.error("Couldn't compile shader" + error);

    gl.deleteProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }
}

export default function initShaders(gl, vertexSource, fragmentSource) {
  let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  let program = createProgram(gl, vertexShader, fragmentShader);

  if (program) {
    gl.useProgram(program);
    gl.program = program;
    return true;
  } else {
    return false;
  }
}