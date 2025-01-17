//1 coordinate for everything :)
let where = 0; //control boxes' positions

function setup() {
  createCanvas(400, 400);
}

function draw() {
  //similar to slide 4 use of OR, ||
  //to set bg color of canvas
  if ((where < 0) || (where > height)) {
    background("beige");
  } else {
    background("chocolate");
  }

  //similar to slide 4 use of AND, &&
  //to set fill color of box & text
  if (mouseIsPressed && keyIsPressed) {
    fill("cyan");
  } else {
    fill(255);
  }

  //boxL
  rect(where, where, 40);

  //boxR, pad x coordinate for size of box
  rect(width - where - 40, where, 40);

  //Move the boxes
  where = where + 1;

  //Show the value of where the boxes are
  text("where is " + where, 150, 30);

  //testing not, ! and or, || operators
  if (!(key === "q" || key === "Q")) {
    fill("purple");
  } else {
    fill("dodgerBlue");
  }
  //Show the current key value
  text("Did you type a q or Q? " + key, 150, 70);

  //*** Boundary checking ***
  //Is the mouse within rect boundary?
  //left, right, top, bottom
  let withinRect = (mouseX >= 150) &&
    (mouseX <= 150 + 100) &&
    (mouseY >= 300) &&
    (mouseY <= 300 + 40);
  //fill color based on value of withinRect
  if (withinRect) {
    fill("pink");
  } else {
    fill("orange");
  }
  //draw the rect
  rect(150, 300, 140, 40);
  //show withinRect value as label on rect
  fill(0);
  text("withinRect " + withinRect, 160, 320);
}

//boxes restart
function mousePressed() {
  //Reset boxes back up and above the canvas
  where = -50;
}
