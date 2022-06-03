/* eslint-disable */
let path;
let counter = 0;
let font,
  fontSize = 240;
let pointCount;
let verbCount;

function preload() {
  font = loadFont('assets/Kanit-Bold.ttf');
}

function setup() {
  createCanvas(1024, 768);
  const str = 'ไก่ที่เป่าปี่';
  bounds = font.textBounds(str, 0, 0, fontSize);
  path = createTextPath(
    str,
    font,
    fontSize,
    (width - bounds.w) / 2,
    height / 2
  );

  pointCount = path.countPoints();
  verbCount = path.countVerbs();
  console.log(pointCount, verbCount);

  noLoop();
}

function draw() {
  background(224);
  strokeCap(SQUARE);
  strokeJoin(MITER);
  fill(255);

  stroke(0);
  strokeWeight(1);

  drawPath(path);

  strokeWeight(6);
  stroke(0);

  var lastpt = [0, 0];
  var lastverb = -1;
  var pt2 = [0, 0];
  var pt3 = [0, 0];
  let v = 0;
  for (let i = 0; i < pointCount; i++) {
    let pt = path.getPoint(i);
    let verb = path.getVerb(v);
    v++;

    switch (verb) {
      case 0:
        console.log(i, 'Move', pt[0], pt[1]);
        stroke(0, 255, 0);
        strokeWeight(6);
        point(pt[0], pt[1]);
        strokeWeight(1);
        line(lastpt[0], lastpt[1], pt[0], pt[1]);
        break;

      case 1:
        console.log(i, 'Line');
        stroke(0, 0, 255);
        strokeWeight(6);
        point(pt[0], pt[1]);
        strokeWeight(1);
        line(lastpt[0], lastpt[1], pt[0], pt[1]);
        break;

      case 2:
        stroke(255, 0, 0);
        i++;
        pt2 = path.getPoint(i);
        console.log(i, 'Quad', pt[0], pt[1], pt2[0], pt2[1]);
        strokeWeight(1);
        line(lastpt[0], lastpt[1], pt[0], pt[1]);
        line(pt[0], pt[1], pt2[0], pt2[1]);
        pt = pt2;
        strokeWeight(6);
        point(pt[0], pt[1]);
        break;

        case 3:
          console.log(i, '3');   
          break;     

          case 4:
            console.log(i, '4');   
            break;     
  
      case 5:
        console.log(i, '--- Close ---');
        if (v < verbCount - 1) i--;
        break;
    }

    if (verb != 5) {
      lastpt[0] = pt[0];
      lastpt[1] = pt[1];
    }
    lastverb = verb;
  }
}
