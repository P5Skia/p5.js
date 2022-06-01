let y = 100;

function drawFrame(canvas) {
  canvas.clear(CanvasKit.Color(255, 255, 255, 1.0));

  const paint = new CanvasKit.Paint();
  paint.setStrokeWidth(1.0);
  paint.setAntiAlias(true);
  paint.setColor(CanvasKit.Color(0, 0, 0, 1.0));
  paint.setStyle(CanvasKit.PaintStyle.Stroke);

  const path = new CanvasKit.Path();
  path.moveTo(20, 5);
  path.lineTo(30, 20);
  path.lineTo(40, 10);
  path.lineTo(50, 20);
  path.lineTo(60, 0);
  path.lineTo(20, 5);

  path.moveTo(20, 80);
  path.cubicTo(90, 10, 160, 150, 190, 10);

  path.moveTo(36, 148);
  path.quadTo(66, 188, 120, 136);
  path.lineTo(36, 148);

  path.moveTo(150, 180);
  path.arcToTangent(150, 100, 50, 200, 20);
  path.lineTo(160, 160);

  path.moveTo(20, 120);
  path.lineTo(20, 120);

  canvas.drawPath(path, paint);

  const rrect = CanvasKit.RRectXY([100, 10, 140, 62], 10, 4);

  const rrectPath = new CanvasKit.Path().addRRect(rrect, true);

  canvas.drawPath(rrectPath, paint);

  rrectPath.delete();
  path.delete();
  paint.delete();
}

function toBase64String(bytes) {
  if (typeof Buffer !== 'undefined') {
    // Are we on node?
    return Buffer.from(bytes).toString('base64');
  } else {
    // From https://stackoverflow.com/a/25644409
    // because the naive solution of
    //     btoa(String.fromCharCode.apply(null, bytes));
    // would occasionally throw "Maximum call stack size exceeded"
    var CHUNK_SIZE = 0x8000; //arbitrary number
    var index = 0;
    var length = bytes.length;
    var result = '';
    var slice;
    while (index < length) {
      slice = bytes.slice(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return btoa(result);
  }
}

let roundRect = function(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();

  ctx.stroke();
};

// The statements in the setup() function
// execute once when the program begins
function setup() {
  background(0);
  noCanvas();

  // Canvas emulator
  let skcanvas = CanvasKit.MakeCanvas(300, 300);
  let ctx = skcanvas.getContext('2d');
  ctx.fillStyle = '#FFF';
  ctx.fillRect(0, 0, 300, 300);

  ctx.moveTo(20, 5);
  ctx.lineTo(30, 20);
  ctx.lineTo(40, 10);
  ctx.lineTo(50, 20);
  ctx.lineTo(60, 0);
  ctx.lineTo(20, 5);

  ctx.moveTo(20, 80);
  ctx.bezierCurveTo(90, 10, 160, 150, 190, 10);

  ctx.moveTo(36, 148);
  ctx.quadraticCurveTo(66, 188, 120, 136);
  ctx.lineTo(36, 148);

  ctx.moveTo(150, 180);
  ctx.arcTo(150, 100, 50, 200, 20);
  ctx.lineTo(160, 160);

  ctx.lineWidth = 4 / 3;
  ctx.stroke();

  roundRect(ctx, 100, 10, 40, 52, 6);

  document.getElementById('my_image').src = skcanvas.toDataURL();
  skcanvas.dispose();

  // Off-screen Render to <img>
  let surface0 = CanvasKit.MakeSurface(300, 300);
  const canvas0 = surface0.getCanvas();
  drawFrame(canvas0);
  // Save snapshot 
  const img0 = surface0.makeImageSnapshot();
  const pngBytes0 = img0.encodeToBytes();
  const b64encoded = toBase64String(pngBytes0);
  document.getElementById(
    'my_image2'
  ).src = `data:image/png;base64,${b64encoded}`;

  // Draw Off-screen buffer
  const surface1 = CanvasKit.MakeCanvasSurface('my_canvas');
  const canvas1 = surface1.getCanvas();
  canvas1.drawImage(img0, 0, 0, null);
  surface1.flush();

  // Software Renderer
  const surface2 = CanvasKit.MakeSWCanvasSurface('my_canvas2');
  if (!surface2) {
    console.error('Could not make surface');
    return;
  }
  const canvas2 = surface2.getCanvas();
  drawFrame(canvas2);
  surface2.flush();

  // Hardware Renderer
  const surface3 = CanvasKit.MakeCanvasSurface('my_canvas3');
  if (!surface3) {
    console.error('Could not make surface');
    return;
  }
  const canvas3 = surface3.getCanvas();
  drawFrame(canvas3);
  surface3.flush();

  /*
  createCanvas(300, 300, SKIA);

  const surfaceP5 = CanvasKit.MakeCanvasSurface('defaultCanvas0');
  if (!surfaceP5) {
    console.error('Could not make surface');
    return;
  }
  const canvasP5 = surfaceP5.getCanvas();
  drawFrame(canvasP5);
  surfaceP5.flush();
  */
}
// The statements in draw() are executed until the
// program is stopped. Each statement is executed in
// sequence and after the last line is read, the first
// line is executed again.
function draw() {}
