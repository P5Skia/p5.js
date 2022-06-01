let fingers;
let ok = false;

function setup() {
  createCanvas(320, 240).parent('container');
  // specify multiple formats for different browsers
  fingers = createVideo(['assets/fingers.mov', 'assets/fingers.webm']);
  fingers.hide();
  noStroke();
  fill(0);
}

function draw() {
  background(255);
  if (ok) {
    fingers.loadPixels();
    const stepSize = round(constrain(mouseX / 8, 6, 32));
    for (let y = 0; y < height; y += stepSize) {
      for (let x = 0; x < width; x += stepSize) {
        const i = y * width + x;
        const darkness = (255 - fingers.pixels[i * 4]) / 255;
        const radius = stepSize * darkness;
        ellipse(x, y, radius, radius);
      }
    }
  }
}

function mousePressed() {
  fingers.loop(); // set the video to loop and start playing
  ok = true;
}
