/* eslint-disable */

let shader;

const spiralSkSL = `
uniform float rad_scale;
uniform float2 in_center;
uniform float4 in_colors0;
uniform float4 in_colors1;

half4 main(float2 p) {
    float2 pp = p - in_center;
    float radius = sqrt(dot(pp, pp));
    radius = sqrt(radius);
    float angle = atan(pp.y / pp.x);
    float t = (angle + 3.1415926/2) / (3.1415926);
    t += radius * rad_scale;
    t = fract(t);
    return half4(mix(in_colors0, in_colors1, t));
}
`;
let floats = [0.5, 350-100, 200-100, 0.75, 1, 0.75, 1, 1, 0.75, 0.75, 1];

function preload() {
  console.log('preload');
}

function setup() {
  createCanvas(720, 420);

  shader = createSkiaShader();

  shader.MakeRuntimeEffect(spiralSkSL);
}

function draw() {
  shader.MakeRuntimeShader(
    [
      Math.sin(Date.now() / 2000) / 5,
      256, 256,
      1, 0, 0, 1,
      0, 1, 0, 1]
  );
  setSkiaShader(shader);
  background(255);
  setSkiaShader(null);
}
