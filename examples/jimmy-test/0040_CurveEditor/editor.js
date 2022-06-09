let menu;

let font = null;
let points = [];

let draggingPoint = null;

function downloadAssets() {
  font = loadFont('assets/Kanit-Regular.ttf');
}

function processRightClick() {
  menu = createSelect();
  menu.option('Add Point');
  menu.option('Blue');
  menu.option('Green');
  menu.position(mouseX, mouseY);
  menu.changed(onMenu);
  return false;
}

function processLeftClick() {
  for (var i = 0; i < points.length; i++) {
    if (points[i].isHit(mouseX, mouseY)) {
      draggingPoint = points[i];
      points[i].dragging = true;
      break;
    }
  }
}

function processLeftDragged() {
  if (draggingPoint) {
    draggingPoint.x = mouseX;
    draggingPoint.y = mouseY;
  }
}

function processLeftRelease() {
  if (draggingPoint) {
    draggingPoint.dragging = false;
    draggingPoint = null;
  }
}

function onMenu() {
  return false;
}

function addPoint(x, y) {
  const pt = new Point(x, y);
  points.push(pt);
}

function drawPoints(PARAMS) {
  for (var i = 0; i < points.length - 1; i++) {
    strokeWeight(1);
    stroke(color(0, 255, 255, 64));
    line(points[i].x, points[i].y, points[i + 1].x, points[i + 1].y);
  }

  let path = null;
  if (points.length === 2) {
    path = createPath();
    path.moveTo(points[0].x, points[0].y);
    path.lineTo(points[1].x, points[1].y);
  } else if (points.length === 3) {
    path = createPath();
    path.moveTo(points[0].x, points[0].y);
    path.quadTo(points[1].x, points[1].y, points[2].x, points[2].y);
  } else if (points.length === 4) {
    path = createPath();
    path.moveTo(points[0].x, points[0].y);
    path.cubicTo(
      points[1].x,
      points[1].y,
      points[2].x,
      points[2].y,
      points[3].x,
      points[3].y
    );
  } else if (points.length > 4) {
    path = createBezierPath(points);
  }
  if (path) {
    strokeWeight(2);
    stroke(color(0, 255, 255, 255));
    noFill();
    drawPath(path);
  }

  if (path && path.skPath) {
    let textBlob = createTextBlob();
    let posn = 0;
    textBlob.MakeTextOnPath(PARAMS.text, path, font, PARAMS.fontSize, posn);
    noStroke();
    fill(0);
    drawTextBlob(textBlob);
  }

  for (i = 0; i < points.length; i++) {
    points[i].draw();
  }
}

function createBezierPath(points) {
  const path = createPath();
  if (points.length < 4) {
    return path;
  }
  path.moveTo(points[0].x, points[0].y);

  const n = points.length;
  let lastPoint = points[0];
  let lastCtrl = points[1];
  let idx = 1;
  let ctrl;
  let nextCtrl;
  let pt;

  let ctrlPoints = [];
  let bezierPoints = [];
  while (true) {
    if (idx === n - 3) {
      path.cubicTo(
        lastCtrl.x,
        lastCtrl.y,
        points[n - 2].x,
        points[n - 2].y,
        points[n - 1].x,
        points[n - 1].y
      );
      break;
    }
    let l1 = (1 * 2) / 3;
    let l2 = 1 / 3;
    if (idx === 1) {
      l1 = 0.5;
    }
    if (idx === n - 4) {
      l2 = 0.5;
    }
    ctrl = new Point(
      lerp(points[idx].x, points[idx + 1].x, l1),
      lerp(points[idx].y, points[idx + 1].y, l1)
    );
    ctrlPoints.push(ctrl);
    nextCtrl = new Point(
      lerp(points[idx + 1].x, points[idx + 2].x, l2),
      lerp(points[idx + 1].y, points[idx + 2].y, l2)
    );
    ctrlPoints.push(nextCtrl);

    pt = new Point(
      lerp(ctrl.x, nextCtrl.x, 0.5),
      lerp(ctrl.y, nextCtrl.y, 0.5)
    );
    bezierPoints.push(pt);

    path.cubicTo(lastCtrl.x, lastCtrl.y, ctrl.x, ctrl.y, pt.x, pt.y);
    lastPoint = pt;
    lastCtrl = nextCtrl;
    idx += 1;
  }
  return path;
}
