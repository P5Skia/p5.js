/* eslint-disable */

let skottie;

function preload() {
  console.log('preload');
  skottie = loadSkottie('sk_legos','assets/lego_loader.json', null); // Load the images
}

function setup() {
  createCanvas(720, 400);
}

function draw() {
  background(255);
  text('Hello', 10, 20);

  drawSkottie(skottie);
}
