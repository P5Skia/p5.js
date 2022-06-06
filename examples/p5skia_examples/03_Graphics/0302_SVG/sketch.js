/* eslint-disable */

let svg;

function preload() {
  console.log('SVG preload');
  svg = loadSVG('assets/tiger.svg'); // Load the svg
}

function setup() {
  createCanvas(720, 400);
}

function draw() {
  background(255);

  drawSVG(svg);
}
