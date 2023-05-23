# 笔记


## 渲染管线
- vertexShader
- fragmentShader

## shader传值的三种方式

![shader传值方式](./imgs/shader传值方式.png)

### 1. Attribute (vertexShader): 将js中的数据传给vertexShader

```js
let a_position = gl.getAttribLocation(gl.program, "a_position");
gl.vertexAttrib2f(a_position, -0.5, 0.5)
```

### 2. Uniform (vertexShader/fragmentShader): 将js中的数据传给vertexShader/fragmentShader

```js
let u_color = gl.getUniformLocation(gl.program, "u_color");
gl.uniform3f(u_color, 0.0, 1.0, 0.0)

let u_size = gl.getUniformLocation(gl.program, 'u_size')
gl.uniform1f(u_size, 30.0)
```  

### 3. Varying: 将vertexShader中的数据传给fragmentShader

## buffer: 表示存储一组点位信息的数组

创建buffer信息数组，有5个步骤：

```js
let vertices = [
  // x    y      r    g   b
  -0.5, 0.0, 1.0, 0.0, 0.0,  // 第一个点的信息
  0.5, 0.0, 0.0, 1.0, 0.0,   // 第二个点的信息
  0.0, 0.8, 0.0, 0.0, 1.0,   // 第三个点的信息
]
vertices = new Float32Array(vertices)
let FSIZE = vertices.BYTES_PER_ELEMENT

// 1. 创建buffer对象
let buffer = gl.createBuffer()
// 2. 绑定buffer
gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
// 3. 将点位信息data注入buffer
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
// 4：把带有数据的buffer赋值给attribute
let a_position = gl.getAttribLocation(gl.program, 'a_position')
gl.vertexAttribPointer(
  a_position,  // location: vertex Shader里面attribute变量的location
  2,           // size: attribute变量的长度（vec2)
  gl.FLOAT,    // type: buffer里面数据的类型
  false,       // normalized: 正交化，true，false, [1, 2] => [1/根号5， 2/根号5]
  5 * FSIZE,   // stride：每个点的信息所占的BYTES
  0            // offset: 每个点的信息，从第几个BYTES开始数
)
// 5. 确认把带有数据的buffer赋值给attribute
gl.enableVertexAttribArray(a_position)
```

## webgl的7种基本形状

- 点 1种  
  - gl.POINTS
- 线 3种
  - gl.LINES
  - gl.LINE_STRIP
  - gl.LINE_LOOP
- 面（三角形） 3种
  - gl.TRIANGLES
  - gl.TRIANGLE_STRIP
  - gl.TRIANGLE_FAN

三角形可以构成任何一个图形，所有的三维图形也是由三角形构成的。

![webgl的7种基本形状](./imgs/webgl的7种基本形状.png)

## 三种变换动画（通过变换矩阵）

```js
/**
 * 变换：平移translate、旋转rotate、缩放scale
 */

// 以下是数学上的矩阵
// ***** 平移矩阵 ******
// [
//     1, 0, 0, Tx,
//     0, 1, 0, Ty,
//     0, 0, 1, Tz,
//     0, 0, 0, 1,
// ]

// ****** 旋转矩阵 ******
// [
//     cosB, -sinB, 0, 0,
//     sinB, cosB,  0, 0,
//     0,    0,     1, 0,
//     0,    0,     0, 1,
// ]

// ****** 缩放矩阵 ******
// [
//     Sx, 0,  0,  0,
//     0,  Sy, 0,  0,
//     0,  0,  Sz, 0,
//     0,  0,  0,  1,
// ]
```

![变换矩阵](./imgs/变换矩阵.png)

**传入webgl时，需要讲变换矩阵进行转置！！！**

```js
// 缩放
let Sx = 1, Sy = 1, Sz = 1
let scale_matrix = [
    Sx, 0, 0, 0,
    0, Sy, 0, 0,
    0, 0, Sz, 0,
    0, 0, 0, 1,
]

// 平移
let Tx = 0, Ty = 0, Tz = 0
let translate_matrix = [
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    Tx, Ty, Tz, 1
]

// 旋转
let deg = 0
let cos = Math.cos(deg / 180 * Math.PI), sin = Math.sin(deg / 180 * Math.PI)
let rotate_matrix = [
    cos, sin, 0, 0,
    -sin, cos, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1,
]
```

## glMatrix库的使用

官方网站：https://glmatrix.net/

### 引入

```js
import { mat4, glMatrix } from './gl_matrix/esm/index.js'
```

### 使用
- 方式一：对原有的（单位）矩阵进行修改

```js
// 创建一个新的单位矩阵
let matrix = mat4.create()

mat4.fromScaling(matrix, [Sx, Sy, Sz])
mat4.fromTranslation(matrix, [Tx, Ty, Tz])
mat4.fromRotation(matrix, deg, [X, Y, Z])
```

- 方式二：修改某个矩阵，生成另外一个新的矩阵

```js
// matrix1旧矩阵，matrix2新矩阵
let matrix1 = mat4.create()
let matrix2 = mat4.create()

mat4.scale(matrix2, matrix1, [Sx, Sy, Sz])
mat4.rotate(matrix2, matrix1, matrix, deg, [X, Y, Z])
mat4.translate(matrix2, matrix1, [Tx, Ty, Tz])
```

### 多个变换矩阵的组合

```js
let vertexShader = `
attribute vec3 a_position;
uniform mat4 u_tMatrix;
uniform mat4 u_rMatrix;

void main() {
  mat4 modelMatrix =  u_tMatrix * u_rMatrix; // 从右到左执行变换矩阵
  gl_Position = modelMatrix * vec4(a_position, 1.0);
}
`
```


## webgl贴图

```js
let texture = gl.createTexture()

let u_sampler = gl.getUniformLocation(gl.program, 'u_sampler')

let image = new Image()
image.src = './imgs/keyboard_1024x512.jpg'

image.onload = function () {
  // 翻转图片的Y轴，默认是不翻转
  // 因为canvas的坐标系和图片坐标系y轴是相反的 
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

  gl.activeTexture(gl.TEXTURE0)  //激活贴图，放在第0个单元上（最少可以支持8个单元）
  gl.bindTexture(gl.TEXTURE_2D, texture) //绑定贴图：哪种贴图和哪个贴图

  // 对贴图的参数进行设置gl.texParameteri(贴图的种类，参数的名称，具体值)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR) // 大的图片贴到小的形状上去
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST) // 大的图片贴到小的形状上去
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR) // 小的图片贴到大的形状上去
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST) // 小的图片贴到大的形状上去

  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.MIRRORED_REPEAT)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  // 贴图用哪张图片，即用image作为texture
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)

  gl.uniform1i(u_sampler, 0)
}
```

### 多张图片

```js
let fragmentShader = `
precision mediump float;
varying vec2 v_uv;
uniform sampler2D u_sampler1;
uniform sampler2D u_sampler2;

void main() {
    vec4 color1 = texture2D(u_sampler1, v_uv);
    vec4 color2 = texture2D(u_sampler2, v_uv);
    gl_FragColor = color1 * (vec4(1.0, 1.0, 1.0, 2.0) - color2); // 其实就是颜色的相乘
    // gl_FragColor = color1 * color2;
}
`
```
## glsl, WebGL Shader Language

- 区分大小写，以分号结尾，注释与js一致
- 数据类型
  - 简单类型
    - 数字：int/float
    - 布尔：bool
  - 复杂类型
    - 向量 Vevtor：vec2, vec3, vec4
      * 例如：vec4 color = vec4(1.0, 1.0, 1.0, 1.0);
        ```js
        // 获取这个变量的部分值
        color.x, color.y, color.z， color.w
        color.r, color.g, color.b， color.a
        color.s, color.t, color.p，color.q
        ```
    - 矩阵 Matrix：mat2, mat3, mat4
      ```js
      mat4 translateMatirx = mat4(
      1.0, 0.0, 0.0, 0.0,
      0.0, 1.0, 0.0, 0.0,
      0.0, 0.0, 1.0, 0.0,
      0.5, 0.0, 0.0, 1.0,
      );
      ```
- 类型转换
  - float(int), float(bool)
  - int(float), init(bool)
  - bool(int), bool(float)

- 变量
  - `gl_*`为内置属性，不允许设置自定义的值
  - 声明：`数据类型 变量名  = 值;`
- 计算
  -  `+ - * /` 前后的类型一致
  -  `++ -- += -= *= /=`
- 循环语句
- 条件语句
- 函数
  - 自定义函数
  - 内置函数

## MVP矩阵
- Model矩阵
  - 代表物体本身发生变化：平移、旋转、缩放
- View矩阵 (范围在1内)
  - 相机位置
  - 相机看向中心
  - 相机在x，y, z轴方向上的位置
  ```js
  let viewMatrix = mat4.create()
  let eye = [0, 0, 1]
  let center = [0, 0, 0]
  let up = [0, 1, 0]
  mat4.lookAt(viewMatrix, eye, center, up)
  ```
- Projection矩阵
  - 正交投影（Orthography）：为了解决视野超出1范围看不见的问题
    - 类比成所能看到的内容是在一个立方体内，有六个值约束：left/right/bottom/top/近处距离/远处距离
      - ortho(out, left, right, bottom, top, near, far)
    - 问题：没有近大远小，景深的概念。
    ![正交投影](./imgs/正交投影.png)
  - 透视投影（Perspective）
    - 类比成所看到的内容是在一个锥体内，有四个值约束：角度/长宽比/近处距离/远处距离
      - perspective(out, fovy, aspect, near, far)
    ![透视投影](./imgs/透视投影.png)

- 深度测试

gl.enable(gl.DEPTH_TEST)

会引发`z-fighting`问题：当多个图形再同一平面上时，层级就无法区别。

可以把两个图形分开画，相当于两种状态，然后给状态加上层级。

```js
gl.enable(gl.DEPTH_TEST)
// Z-fighting
gl.enable(gl.POLYGON_OFFSET_FILL)

gl.polygonOffset(0.0, 0.0);
gl.drawArrays(gl.TRIANGLES, 0, 3) // 蓝色的三角形
gl.polygonOffset(1.0, 1.0);
gl.drawArrays(gl.TRIANGLES, 3, 3) // 红色的三角形
```

