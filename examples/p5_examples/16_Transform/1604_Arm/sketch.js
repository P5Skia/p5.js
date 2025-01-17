
let x, y;
let angle1 = 0.0;
let angle2 = 0.0;
let segLength = 100;

function setup() {
  createCanvas(720, 400);
  strokeWeight(30);

  //Stroke with a semi-transparent white
  stroke(255, 160);

  //Position the "shoulder" of the arm in the center of the canvas
  x = width * 0.5;
  y = height * 0.5;
}

function draw() {
  background(0);

  //Change the angle of the segments according to the mouse positions
  angle1 = (mouseX / float(width) - 0.5) * -TWO_PI;
  angle2 = (mouseY / float(height) - 0.5) * PI;

  //use push and pop to "contain" the transforms. Note that
  // even though we draw the segments using a custom function,
  // the transforms still accumulate
  push();
  segment(x, y, angle1);
  segment(segLength, 0, angle2);
  pop();
}

//a custom function for drawing segments
function segment(x, y, a) {
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
}
