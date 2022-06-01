let scale;

function setup() {
  createCanvas(720, 400);
  noStroke();
  scale = width / 20;
}

function draw() {
  let i;
  for (i = 0; i < scale; i++) {
    colorMode(RGB, (i + 1) * scale * 10);
    fill(millis() % ((i + 1) * scale * 10));
    rect(i * scale, 0, scale, height);
  }
}
