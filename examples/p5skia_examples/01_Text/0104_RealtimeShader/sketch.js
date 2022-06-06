/* eslint-disable */

let img; // Declare variable 'img'.
let message = 'สวัสดีเป็ดที่เป่าปี่';
let font,
  fontSize = 88;
let x = 20;
let shader;
let counter = 0;

let floats = [0.5, 350, 200, 0, 1, 0, 1, 1, 0, 0, 1];

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
}`;

function preload() {
  font = loadFont('assets/Kanit-Black.ttf');
}

function setup() {
  createCanvas(720, 420);
  textFont(font);
  textSize(fontSize);
  shader = createSkiaShader();

  shader.MakeRuntimeEffect(spiralSkSL);
}

function draw() {
  x = (Math.sin(counter) + 1) * 45;
  setSkiaShader(null);
  background(255);
  fill(0);

  floats[0] = 0.5 + (Math.sin(counter/10)+0.5) * 0.5;
  shader.MakeRuntimeShader(floats);
  setSkiaShader(shader);
  noStroke();
  text(message, 5 + x, 100);
  text(message, 5 + x, 200);
  text(message, 5 + x, 300);
  text(message, 5 + x, 400);
  stroke(0);
  strokeWeight(3);
  noSkiaShader();
  noFill();
  text(message, 5 + x, 100);
  text(message, 5 + x, 200);
  text(message, 5 + x, 300);
  text(message, 5 + x, 400);
  counter += 0.05;
}
