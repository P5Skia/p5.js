import p5 from './main';
import * as constants from './constants';
//import filters from '../image/filters';

import './p5.Renderer';

/**
 * p5.RendererSkia
 * The 2D graphics canvas renderer class.
 * extends p5.Renderer
 */
//const styleEmpty = 'rgba(0,0,0,0)';
// const alphaThreshold = 0.00125; // minimum visible

/*
    p5.Renderer
        canvas : html5 canvas element
        width : width of element offsetWidth
        height : height of element offsetHeight
        _isMainCanvas : is renderer handle main canvas?
        _pixelsState : p5 instance (renderer)
        _pInst : p5 instance (element)

    p5.RendererSkia.
        _skScale : scale factor of display (from p5 pixel density)
        _skSurface : skSurface of main canvas or off-screen canvas
        _skCanvas : (cached) skCanvas of _skSurface
        _retainImage : skImage for retain 

        _skStrokeColor
        _skStrokeWidth
        _skStrokePaint

        _skFillColor
        _skFillPaint

        _doFill : false if noFill
        _doStroke : false if noStroke

        _cachedFillStyle : #string format of fill color (used in Path)
        _cachedStrokeStyle : #string format of stroke color (used in Path)


  functions that pre-postSK
    background
    clear
    point
    line
    triangle
    quad
    rect
    arc
    ellipse
    image
    endshape
    updatePixels
    _renderText

  this not pre-postSK
    bezier
    curve
*/

p5.RendererSkia = function(elt, pInst, isMainCanvas, _isSWRender = false) {
  //console.log('RendererSkia', elt);
  p5.Renderer.call(this, elt, pInst, isMainCanvas);

  this.isSKIA = true; //lets us know we're in SKIA mode
  this.isSWRender = _isSWRender;
  //this.reset();

  if (isMainCanvas) {
    this._skiaAttributes = { retain: true };
    this._doRetain = true;
    this._inLoopCount = 0;
    this._pInst.registerMethod('pre', this.preDraw.bind(this));
    this._pInst.registerMethod('post', this.postDraw.bind(this));
  }

  return this;
};

p5.RendererSkia.prototype = Object.create(p5.Renderer.prototype);

p5.RendererSkia.prototype.preDraw = function() {
  if (this._inLoopCount) {
    return;
  }
  //console.log('predraw');

  if (!this._skCanvas) {
    this._skCanvas = this._skSurface.getCanvas();
  }
  this._skCanvas.restoreToCount(0);
  this._skCanvas.save();
  if (this._doRetain && !this._inLoopCount) {
    if (this._retainImage) {
      this._skCanvas.drawImage(this._retainImage, 0, 0, null);
    }
  }
  if (this._isMainCanvas) {
    this._skScale = this._pInst._pixelDensity;
    this._skCanvas.scale(this._skScale, this._skScale);
  }
  //console.log('scale', this._skScale);
  this._inLoopCount++;

  this._tint = null;
};

p5.RendererSkia.prototype.getImageData = function() {
  var pixels = this._skCanvas.readPixels(0, 0, this._skSurface.imageInfo());
  var ppixels = new Uint8ClampedArray(
    pixels,
    0,
    this.width *
      this._pInst._pixelDensity *
      this.height *
      this._pInst._pixelDensity *
      4
  );
  var imageData = new ImageData(
    ppixels,
    this.width * this._pInst._pixelDensity,
    this.height * this._pInst._pixelDensity
  );
  return imageData;
};

p5.RendererSkia.prototype.postDraw = function() {
  this._inLoopCount = 0;
  this._skCanvas.restoreToCount(0);
  if (this._doRetain) {
    if (this._retainImage) {
      this._retainImage.delete();
    }
    this._retainImage = this._skSurface.makeImageSnapshot();
  }
  this._skSurface.flush();
  //var imageData = this.getImageData();
  //this.canvas.getContext('2d').putImageData(imageData, 0, 0);
};

p5.RendererSkia.prototype.preSK = function() {
  if (!this._inLoopCount) {
    if (this._doRetain && this._retainImage) {
      this._skCanvas.drawImage(this._retainImage, 0, 0, null);
    }
  }
};

p5.RendererSkia.prototype.postSK = function() {
  if (!this._inLoopCount) {
    if (this._doRetain) {
      if (this._retainImage) {
        this._retainImage.delete();
      }
      this._retainImage = this._skSurface.makeImageSnapshot();
    }
  }
};

p5.prototype.setSkiaAttributes = function(key, value) {
  if (typeof this._renderer._skiaAttributes === 'undefined') {
    console.log(
      'You are trying to use setAttributes on a p5.Graphics object ' +
        'that does not use a WEBGL renderer.'
    );
    return;
  }
  let unchanged = true;
  if (typeof value !== 'undefined') {
    //first time modifying the attributes
    if (this._renderer._skiaAttributes === null) {
      this._renderer._skiaAttributes = {};
    }
    if (this._renderer._skiaAttributes[key] !== value) {
      //changing value of previously altered attribute
      this._renderer._skiaAttributes[key] = value;
      unchanged = false;
    }
    //setting all attributes with some change
  } else if (key instanceof Object) {
    if (this._renderer._skiaAttributes !== key) {
      this._renderer._skiaAttributes = key;
      unchanged = false;
    }
  }
  //@todo_FES
  if (!this._renderer.isSKIA || unchanged) {
    return;
  }

  if (this._renderer._skiaAttributes['retain']) this._renderer._doRetain = true;
  else this._renderer._doRetain = false;
};

p5.RendererSkia.prototype._applyDefaults = function() {
  this._skStrokeColor = this.ArgsToSkColor(constants._DEFAULT_STROKE);
  this._skStrokeWidth = 1;
  if (!this._skStrokePaint) this._skStrokePaint = new CanvasKit.Paint();
  this._skStrokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
  this._skStrokePaint.setStrokeWidth(this._skStrokeWidth);
  this._skStrokePaint.setStrokeCap(CanvasKit.StrokeCap.Round);
  this._skStrokePaint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
  this._skStrokePaint.setAntiAlias(true);
  this._skStrokePaint.setColor(this._skStrokeColor);

  this._skFillColor = this.ArgsToSkColor(constants._DEFAULT_FILL);
  if (!this._skFillPaint) this._skFillPaint = new CanvasKit.Paint();
  this._skFillPaint.setStyle(CanvasKit.PaintStyle.Fill);
  this._skFillPaint.setAntiAlias(true);
  this._skFillPaint.setColor(this._skFillColor);

  this._cachedFillStyle = this._cachedStrokeStyle = undefined;
  this._cachedBlendMode = constants.BLEND;
  this._setFill(constants._DEFAULT_FILL);
  this._setStroke(constants._DEFAULT_STROKE);

  this._translateX = 0;
  this._translateY = 0;

  this._shader = null;

  /*
  console.log('setup default font', this._pInst._skDefaultFont);
  if (this._pInst._skDefaultFont) {
    this._textFont = this._pInst._skDefaultFont;
  }
  else {
    console.log('no default font');
  }
  */
  this._textSize = 12;

  //this.drawingContext.lineCap = constants.ROUND;
  //this.drawingContext.font = 'normal 12px sans-serif';
};

p5.RendererSkia.prototype._getFill = function() {
  if (!this._cachedFillStyle) {
    this._cachedFillStyle = constants._DEFAULT_FILL;
  }
  return this._cachedFillStyle;
};

p5.RendererSkia.prototype._setFill = function(fillStyle) {
  if (fillStyle !== this._cachedFillStyle) {
    this._cachedFillStyle = fillStyle;
  }
};

p5.RendererSkia.prototype._getStroke = function() {
  if (!this._cachedStrokeStyle) {
    this._cachedStrokeStyle = constants._DEFAULT_STROKE;
  }
  return this._cachedStrokeStyle;
};

p5.RendererSkia.prototype._setStroke = function(strokeStyle) {
  if (strokeStyle !== this._cachedStrokeStyle) {
    this._cachedStrokeStyle = strokeStyle;
  }
};

p5.RendererSkia.prototype.fill = function(...args) {
  const _col = this._pInst.color(...args);
  this._skFillColor = this.P5ColorToSkColor(_col);
  this._skFillPaint.setColor(this._skFillColor);
  this._setFill(_col.toString());
};

p5.RendererSkia.prototype.stroke = function(...args) {
  const _col = this._pInst.color(...args);
  this._skStrokeColor = this.P5ColorToSkColor(_col);
  this._skStrokePaint.setColor(this._skStrokeColor);
  this._setStroke(_col.toString());
};

p5.RendererSkia.prototype.strokeCap = function(cap) {
  if (cap === constants.ROUND)
    this._skStrokePaint.setStrokeCap(CanvasKit.StrokeCap.Round);
  if (cap === constants.SQUARE)
    this._skStrokePaint.setStrokeCap(CanvasKit.StrokeCap.Butt);
  if (cap === constants.PROJECT)
    this._skStrokePaint.setStrokeCap(CanvasKit.StrokeCap.Square);
  return this;
};

p5.RendererSkia.prototype.strokeJoin = function(join) {
  if (join === constants.ROUND)
    this._skStrokePaint.setStrokeJoin(CanvasKit.StrokeJoin.Round);
  if (join === constants.BEVEL)
    this._skStrokePaint.setStrokeJoin(CanvasKit.StrokeJoin.Bevel);
  if (join === constants.MITER)
    this._skStrokePaint.setStrokeJoin(CanvasKit.StrokeJoin.Miter);
  return this;
};

p5.RendererSkia.prototype.strokeWeight = function(w) {
  if (typeof w === 'undefined' || w === 0) {
    this._skStrokeWidth = 1;
  } else {
    this._skStrokeWidth = w;
  }
  this._skStrokePaint.setStrokeWidth(this._skStrokeWidth);
  return this;
};

p5.RendererSkia.prototype.resize = function(w, h) {
  p5.Renderer.prototype.resize.call(this, w, h);
  this.reset();
  //this.resetMatrix();
  this.preDraw();
  //this.needPostDraw = true;
};

p5.RendererSkia.prototype.reset = function() {
  this._skScale = this._pInst._pixelDensity;
  //console.log('reset', this.canvas);

  if (this._isMainCanvas) {
    if (this.isSWRender) {
      this._skSurface = CanvasKit.MakeSWCanvasSurface(this.canvas);
    } else {
      this._skSurface = CanvasKit.MakeCanvasSurface(this.canvas);
    }
  } else {
    this._skSurface = CanvasKit.MakeSurface(this.width, this.height);
  }

  this._skCanvas = this._skSurface.getCanvas();
  //this._skCanvas.save();
  //this._skCanvas.scale(this._skScale, this._skScale);

  if (this._retainImage) {
    this._retainImage.delete();
  }
  this._retainImage = null;
};

p5.RendererSkia.prototype.resetMatrix = function() {
  //console.log('reset Matrix');
  this._skCanvas.restoreToCount(0);
  this._skCanvas.save();
  if (this._isMainCanvas) {
    this._skScale = this._pInst._pixelDensity;
    this._skCanvas.scale(this._skScale, this._skScale);
  }

  //this._skScale = this._pInst._pixelDensity;
  //this._skCanvas.scale(this._skScale, this._skScale);
  //this._skCanvas.scale(this._skScale, this._skScale);
  /*
  this.drawingContext.setTransform(1, 0, 0, 1, 0, 0);f
  */
  return this;
};

p5.RendererSkia.prototype.clip = function(x, y, w, h) {
  //console.log('clip', x, y, w, h);
  this._skCanvas.clipRect(
    CanvasKit.XYWHRect(x, y, w, h),
    CanvasKit.ClipOp.Intersect,
    true
  );
};

p5.RendererSkia.prototype.ArgsToSkColor = function(...args) {
  const _col = this._pInst.color(...args);

  return CanvasKit.Color4f(
    _col._array[0],
    _col._array[1],
    _col._array[2],
    _col._array[3]
  );
};

p5.RendererSkia.prototype.LevelsToSkColor = function(color, isOpaque = false) {
  if (isOpaque) {
    return CanvasKit.Color4f(
      color[0] / 255,
      color[1] / 255,
      color[2] / 255,
      1.0
    );
  }
  return CanvasKit.Color4f(
    color[0] / 255,
    color[1] / 255,
    color[2] / 255,
    color[3] / 255
  );
};

p5.RendererSkia.prototype.P5ColorToSkColor = function(_col, isOpaque = false) {
  if (isOpaque) {
    return CanvasKit.Color4f(
      _col._array[0],
      _col._array[1],
      _col._array[2],
      1.0
    );
  }
  return CanvasKit.Color4f(
    _col._array[0],
    _col._array[1],
    _col._array[2],
    _col._array[3]
  );
};

// p5.background();
p5.RendererSkia.prototype.background = function(...args) {
  if (args[0] instanceof p5.Image) {
    this._pInst.image(args[0], 0, 0, this.width, this.height);
    return;
  }

  this.preSK();
  this._skFillPaint.setColor(this.ArgsToSkColor(...args));
  this._skCanvas.drawRect(
    CanvasKit.XYWHRect(
      0,
      0,
      this.width * this._pInst._pixelDensity,
      this.height * this._pInst._pixelDensity
    ),
    this._skFillPaint
  );
  this._skFillPaint.setColor(this._skFillColor);
  // Use fill Rect instead of clear to handle transparency in retain mode
  // this._skCanvas.clear(this.ArgsToSkColor(...args));
  this.postSK();
};

p5.RendererSkia.prototype.clear = function() {
  this.preSK();
  //console.log('clear');
  this._skCanvas.clear(CanvasKit.TRANSPARENT);
  this.postSK();
};

p5.RendererSkia.prototype.rotate = function(rad) {
  this._skCanvas.rotate(this._pInst.degrees(rad), 0, 0);
  return this;
};

p5.RendererSkia.prototype.scale = function(x, y) {
  this._skCanvas.scale(x, y);
  return this;
};

p5.RendererSkia.prototype.translate = function(x, y) {
  // support passing a vector as the 1st parameter
  if (x instanceof p5.Vector) {
    y = x.y;
    x = x.x;
  }
  this._translateX += x;
  this._translateY += y;
  this._skCanvas.translate(x, y);
  return this;
};

p5.RendererSkia.prototype.point = function(x, y) {
  this.preSK();
  this._skStrokePaint.setStyle(CanvasKit.PaintStyle.Fill);
  this._skCanvas.drawCircle(x, y, this._skStrokeWidth / 2, this._skStrokePaint);
  this._skStrokePaint.setStyle(CanvasKit.PaintStyle.Stroke);
  this.postSK();
};

p5.RendererSkia.prototype.line = function(x1, y1, x2, y2) {
  if (this._doStroke) {
    this.preSK();
    this._skCanvas.drawLine(x1, y1, x2, y2, this._skStrokePaint);
    this.postSK();
  }

  return this;
};

p5.RendererSkia.prototype.triangle = function(args) {
  const x1 = args[0],
    y1 = args[1];
  const x2 = args[2],
    y2 = args[3];
  const x3 = args[4],
    y3 = args[5];

  const path = new CanvasKit.Path();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x3, y3);
  path.close();

  this.preSK();
  if (this._doFill) this._skCanvas.drawPath(path, this._skFillPaint);
  if (this._doStroke) this._skCanvas.drawPath(path, this._skStrokePaint);
  this.postSK();

  path.delete();
};

p5.RendererSkia.prototype.quad = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  const path = new CanvasKit.Path();
  path.moveTo(x1, y1);
  path.lineTo(x2, y2);
  path.lineTo(x3, y3);
  path.lineTo(x4, y4);
  path.close();

  this.preSK();
  if (this._doFill) this._skCanvas.drawPath(path, this._skFillPaint);
  if (this._doStroke) this._skCanvas.drawPath(path, this._skStrokePaint);
  this.postSK();

  path.delete();
  return this;
};

p5.RendererSkia.prototype.rect = function(args) {
  const x = args[0];
  const y = args[1];
  const w = args[2];
  const h = args[3];
  let tl = args[4];
  let tr = args[5];
  let br = args[6];
  let bl = args[7];

  this.preSK();
  const path = new CanvasKit.Path();

  if (typeof tl === 'undefined') {
    // No rounded corners
    path.addRect(CanvasKit.XYWHRect(x, y, w, h));
  } else {
    // At least one rounded corner
    // Set defaults when not specified
    if (typeof tr === 'undefined') {
      tr = tl;
    }
    if (typeof br === 'undefined') {
      br = tr;
    }
    if (typeof bl === 'undefined') {
      bl = br;
    }

    // corner rounding must always be positive
    const absW = Math.abs(w);
    const absH = Math.abs(h);
    const hw = absW / 2;
    const hh = absH / 2;

    // Clip radii
    if (absW < 2 * tl) {
      tl = hw;
    }
    if (absH < 2 * tl) {
      tl = hh;
    }
    if (absW < 2 * tr) {
      tr = hw;
    }
    if (absH < 2 * tr) {
      tr = hh;
    }
    if (absW < 2 * br) {
      br = hw;
    }
    if (absH < 2 * br) {
      br = hh;
    }
    if (absW < 2 * bl) {
      bl = hw;
    }
    if (absH < 2 * bl) {
      bl = hh;
    }

    // Draw shape
    path.moveTo(x + tl, y);
    path.arcToTangent(x + w, y, x + w, y + h, tr);
    path.arcToTangent(x + w, y + h, x, y + h, br);

    path.arcToTangent(x, y + h, x, y, bl);
    path.arcToTangent(x, y, x + w, y, tl);
  }

  if (this._doFill) this._skCanvas.drawPath(path, this._skFillPaint);
  if (this._doStroke) this._skCanvas.drawPath(path, this._skStrokePaint);

  path.delete();
  this.postSK();

  return this;
};

/**
 * Generate a cubic Bezier representing an arc on the unit circle of total
 * angle `size` radians, beginning `start` radians above the x-axis. Up to
 * four of these curves are combined to make a full arc.
 *
 * See www.joecridge.me/bezier.pdf for an explanation of the method.
 */
p5.RendererSkia.prototype._acuteArcToBezier = function _acuteArcToBezier(
  start,
  size
) {
  // Evaluate constants.
  const alpha = size / 2.0,
    cos_alpha = Math.cos(alpha),
    sin_alpha = Math.sin(alpha),
    cot_alpha = 1.0 / Math.tan(alpha),
    // This is how far the arc needs to be rotated.
    phi = start + alpha,
    cos_phi = Math.cos(phi),
    sin_phi = Math.sin(phi),
    lambda = (4.0 - cos_alpha) / 3.0,
    mu = sin_alpha + (cos_alpha - lambda) * cot_alpha;

  // Return rotated waypoints.
  return {
    ax: Math.cos(start).toFixed(7),
    ay: Math.sin(start).toFixed(7),
    bx: (lambda * cos_phi + mu * sin_phi).toFixed(7),
    by: (lambda * sin_phi - mu * cos_phi).toFixed(7),
    cx: (lambda * cos_phi - mu * sin_phi).toFixed(7),
    cy: (lambda * sin_phi + mu * cos_phi).toFixed(7),
    dx: Math.cos(start + size).toFixed(7),
    dy: Math.sin(start + size).toFixed(7)
  };
};

/*
 * This function requires that:
 *
 *   0 <= start < TWO_PI
 *
 *   start <= stop < start + TWO_PI
 */
p5.RendererSkia.prototype.arc = function(x, y, w, h, start, stop, mode) {
  const rx = w / 2.0;
  const ry = h / 2.0;
  const epsilon = 0.00001; // Smallest visible angle on displays up to 4K.
  let arcToDraw = 0;
  const curves = [];

  x += rx;
  y += ry;

  this.preSK();

  // Create curves
  while (stop - start >= epsilon) {
    arcToDraw = Math.min(stop - start, constants.HALF_PI);
    curves.push(this._acuteArcToBezier(start, arcToDraw));
    start += arcToDraw;
  }

  const path = new CanvasKit.Path();
  // Fill curves
  if (this._doFill) {
    curves.forEach((curve, index) => {
      if (index === 0) {
        path.moveTo(x + curve.ax * rx, y + curve.ay * ry);
      }
      // prettier-ignore
      path.cubicTo(x + curve.bx * rx, y + curve.by * ry,
                          x + curve.cx * rx, y + curve.cy * ry,
                          x + curve.dx * rx, y + curve.dy * ry);
    });
    if (mode === constants.PIE || mode == null) {
      path.lineTo(x, y);
    }
    path.close();
    this._skCanvas.drawPath(path, this._skFillPaint);
  }

  // Stroke curves
  if (this._doStroke) {
    curves.forEach((curve, index) => {
      if (index === 0) {
        path.moveTo(x + curve.ax * rx, y + curve.ay * ry);
      }
      // prettier-ignore
      path.cubicTo(x + curve.bx * rx, y + curve.by * ry,
                          x + curve.cx * rx, y + curve.cy * ry,
                          x + curve.dx * rx, y + curve.dy * ry);
    });
    if (mode === constants.PIE) {
      path.lineTo(x, y);
      path.close();
    } else if (mode === constants.CHORD) {
      path.close();
    }
    this._skCanvas.drawPath(path, this._skStrokePaint);
  }
  path.delete();

  this.postSK();

  return this;
};

p5.RendererSkia.prototype.ellipse = function(args) {
  const x = parseFloat(args[0]),
    y = parseFloat(args[1]),
    w = parseFloat(args[2]),
    h = parseFloat(args[3]);

  this.preSK();
  if (this._doFill)
    this._skCanvas.drawOval(CanvasKit.XYWHRect(x, y, w, h), this._skFillPaint);
  if (this._doStroke)
    this._skCanvas.drawOval(
      CanvasKit.XYWHRect(x, y, w, h),
      this._skStrokePaint
    );
  this.postSK();
};

p5.RendererSkia.prototype.bezier = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.vertex(x1, y1, true);
  this._pInst.bezierVertex(x2, y2, x3, y3, x4, y4);
  this._pInst.endShape();
  return this;
};

p5.RendererSkia.prototype.curve = function(x1, y1, x2, y2, x3, y3, x4, y4) {
  this._pInst.beginShape();
  this._pInst.curveVertex(x1, y1);
  this._pInst.curveVertex(x2, y2);
  this._pInst.curveVertex(x3, y3);
  this._pInst.curveVertex(x4, y4);
  this._pInst.endShape();
  return this;
};

p5.RendererSkia.prototype.blendMode = function(mode) {
  console.log('blendMode', mode);
};

p5.RendererSkia.prototype.image = function(
  img,
  sx,
  sy,
  sWidth,
  sHeight,
  dx,
  dy,
  dWidth,
  dHeight
) {
  let paint = new CanvasKit.Paint();
  paint.setStyle(CanvasKit.PaintStyle.Fill);
  //paint.setAntiAlias(true);

  /*
  P5 blend Mode  *factor is source alpha*

  BLEND - linear interpolation of colours: C = A*factor + B. This is the default blending mode.
  ADD - sum of A and B
  DARKEST - only the darkest colour succeeds: C = min(A*factor, B).
  LIGHTEST - only the lightest colour succeeds: C = max(A*factor, B).
  DIFFERENCE - subtract colors from underlying image.
  EXCLUSION - similar to DIFFERENCE, but less extreme.
  MULTIPLY - multiply the colors, result will always be darker.
  SCREEN - opposite multiply, uses inverse values of the colors.
  REPLACE - the pixels entirely replace the others and don't utilize alpha (transparency) values.
  REMOVE - removes pixels from B with the alpha strength of A.
  OVERLAY - mix of MULTIPLY and SCREEN . Multiplies dark values, and screens light values. (2D)
  HARD_LIGHT - SCREEN when greater than 50% gray, MULTIPLY when lower. (2D)
  SOFT_LIGHT - mix of DARKEST and LIGHTEST. Works like OVERLAY, but not as harsh. (2D)
  DODGE - lightens light tones and increases contrast, ignores darks. (2D)
  BURN - darker areas are applied, increasing contrast, ignores lights. (2D)
  SUBTRACT - remainder of A and B (3D) 
  */

  /*
  kClear,         //!< r = 0
  kSrc,           //!< r = s
  kDst,           //!< r = d
  kSrcOver,       //!< r = s + (1-sa)*d
  kDstOver,       //!< r = d + (1-da)*s
  kSrcIn,         //!< r = s * da
  kDstIn,         //!< r = d * sa
  kSrcOut,        //!< r = s * (1-da)
  kDstOut,        //!< r = d * (1-sa)
  kSrcATop,       //!< r = s*da + d*(1-sa)
  kDstATop,       //!< r = d*sa + s*(1-da)
  kXor,           //!< r = s*(1-da) + d*(1-sa)
  kPlus,          //!< r = min(s + d, 1)
  kModulate,      //!< r = s*d
  kScreen,        //!< r = s + d - s*d

  kOverlay,       //!< multiply or screen, depending on destination
  kDarken,        //!< rc = s + d - max(s*da, d*sa), ra = kSrcOver
  kLighten,       //!< rc = s + d - min(s*da, d*sa), ra = kSrcOver
  kColorDodge,    //!< brighten destination to reflect source
  kColorBurn,     //!< darken destination to reflect source
  kHardLight,     //!< multiply or screen, depending on source
  kSoftLight,     //!< lighten or darken, depending on source
  kDifference,    //!< rc = s + d - 2*(min(s*da, d*sa)), ra = kSrcOver
  kExclusion,     //!< rc = s + d - two(s*d), ra = kSrcOver
  kMultiply,      //!< r = s*(1-da) + d*(1-sa) + s*d

  kHue,           //!< hue of source with saturation and luminosity of destination
  kSaturation,    //!< saturation of source with hue and luminosity of destination
  kColor,         //!< hue and saturation of source with luminosity of destination
  kLuminosity,    //!< luminosity of source with hue and saturation of destination

  kLastCoeffMode     = kScreen,     //!< last porter duff blend mode
  kLastSeparableMode = kMultiply,   //!< last blend mode operating separately on components
  kLastMode          = kLuminosity, //!< last valid value
  */

  if (this._tint) {
    // _tint stored as array (Levels)
    const colorRGB = this.LevelsToSkColor(this._tint, true);
    const color = this.LevelsToSkColor(this._tint, false);

    const colf = CanvasKit.ColorFilter.MakeBlend(
      color,
      CanvasKit.BlendMode.Modulate
    );
    /*
    const alphaf = CanvasKit.ColorFilter.MakeBlend(
      color,
      CanvasKit.BlendMode.DstATop
    );
    const combindF = CanvasKit.ColorFilter.MakeCompose(alphaf, colf);
    */
    paint.setColorFilter(colf);
  }
  if (img.elt && img.elt.videoWidth > 0 && img.elt.videoHeight > 0) {
    if (
      img.elt.currentTime > 0 &&
      !img.elt.paused &&
      !img.elt.ended &&
      img.elt.readyState > 2 &&
      !img.creatingSkImg
    ) {
      img.creatingSkImg = true;
      try {
        createImageBitmap(img.elt).then(imgbmp => {
          const skimg = CanvasKit.MakeImageFromCanvasImageSource(imgbmp);
          if (img.skImg) img.skImg.delete();
          img.skImg = skimg;
          img.creatingSkImg = false;
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
  this.preSK();
  if (img instanceof p5.Graphics) {
    if (img._renderer._skSurface) {
      const image = img._renderer._skSurface.makeImageSnapshot();
      if (!image) {
        //console.error('no snapshot');
        return;
      }
      this._skCanvas.drawImageRect(
        image,
        CanvasKit.XYWHRect(sx, sy, sWidth, sHeight),
        CanvasKit.XYWHRect(dx, dy, dWidth, dHeight),
        paint
      );
      image.delete();
    }
  } else {
    if (img.skImg) {
      if (img.skImgMask) {
        if (!img.skSurfaceMask) {
          img.skSurfaceMask = CanvasKit.MakeSurface(
            img.skImgMask.width(),
            img.skImgMask.height()
          );
          let cv = img.skSurfaceMask.getCanvas();
          cv.clear(CanvasKit.TRANSPARENT);
          cv.drawImage(img.skImgMask, 0, 0, null);

          let p = new CanvasKit.Paint();
          p.setStyle(CanvasKit.PaintStyle.Fill);
          p.setBlendMode(CanvasKit.BlendMode.SrcIn);
          cv.drawImage(img.skImg, 0, 0, p);
        }
        const image = img.skSurfaceMask.makeImageSnapshot();
        if (image) {
          this._skCanvas.drawImageRect(
            image,
            CanvasKit.XYWHRect(sx, sy, sWidth, sHeight),
            CanvasKit.XYWHRect(dx, dy, dWidth, dHeight),
            paint
          );
          image.delete();
        }
      } else {
        this._skCanvas.drawImageRect(
          img.skImg,
          CanvasKit.XYWHRect(sx, sy, sWidth, sHeight),
          CanvasKit.XYWHRect(dx, dy, dWidth, dHeight),
          paint
        );
      }
    }
  }

  this.postSK();

  /*
  let cnv;
  if (img.gifProperties) {
    img._animateGif(this._pInst);
  }

  try {
    if (this._tint) {
      if (p5.MediaElement && img instanceof p5.MediaElement) {
        img.loadPixels();
      }
      if (img.canvas) {
        cnv = this._getTintedImageCanvas(img);
      }
    }
    if (!cnv) {
      cnv = img.canvas || img.elt;
    }
    let s = 1;
    if (img.width && img.width > 0) {
      s = cnv.width / img.width;
    }
    if (this._isErasing) {
      this.blendMode(this._cachedBlendMode);
    }
    this.drawingContext.drawImage(
      cnv,
      s * sx,
      s * sy,
      s * sWidth,
      s * sHeight,
      dx,
      dy,
      dWidth,
      dHeight
    );
    if (this._isErasing) {
      this._pInst.erase();
    }
  } catch (e) {
    if (e.name !== 'NS_ERROR_NOT_AVAILABLE') {
      throw e;
    }
  }
  */
};

p5.RendererSkia.prototype._doFillStrokeClose = function(path, closeShape) {
  if (closeShape) {
    path.close();
  }
  if (this._doFill) {
    this._skCanvas.drawPath(path, this._skFillPaint);
  }
  if (this._doStroke) {
    this._skCanvas.drawPath(path, this._skStrokePaint);
  }
};

p5.RendererSkia.prototype.MakeCurvePath = function(mode, vertices) {
  const closeShape = mode === constants.CLOSE;
  console.log('MakeCurvePath', closeShape);
  const numVerts = vertices.length;

  if (numVerts > 3) {
    const b = [],
      s = 1 - this._curveTightness;
    const path = new p5.Path();
    path.pathMoveTo(vertices[1][0], vertices[1][1]);
    for (var i = 1; i + 2 < numVerts; i++) {
      const v = vertices[i];
      b[0] = [v[0], v[1]];
      b[1] = [
        v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
        v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
      ];
      b[2] = [
        vertices[i + 1][0] + (s * vertices[i][0] - s * vertices[i + 2][0]) / 6,
        vertices[i + 1][1] + (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
      ];
      b[3] = [vertices[i + 1][0], vertices[i + 1][1]];
      path.cubicTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
    }
    if (closeShape) {
      path.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
    }
    return path;
  }
  return null;
};

p5.RendererSkia.prototype.endShape = function(
  mode,
  vertices,
  isCurve,
  isBezier,
  isQuadratic,
  isContour,
  shapeKind
) {
  if (vertices.length === 0) {
    return this;
  }
  if (!this._doStroke && !this._doFill) {
    return this;
  }
  this.preSK();
  const closeShape = mode === constants.CLOSE;
  let v;
  if (closeShape && !isContour) {
    vertices.push(vertices[0]);
  }
  let i, j;
  const numVerts = vertices.length;
  if (isCurve && (shapeKind === constants.POLYGON || shapeKind === null)) {
    if (numVerts > 3) {
      const b = [],
        s = 1 - this._curveTightness;
      const path = new CanvasKit.Path();
      path.moveTo(vertices[1][0], vertices[1][1]);
      for (i = 1; i + 2 < numVerts; i++) {
        v = vertices[i];
        b[0] = [v[0], v[1]];
        b[1] = [
          v[0] + (s * vertices[i + 1][0] - s * vertices[i - 1][0]) / 6,
          v[1] + (s * vertices[i + 1][1] - s * vertices[i - 1][1]) / 6
        ];
        b[2] = [
          vertices[i + 1][0] +
            (s * vertices[i][0] - s * vertices[i + 2][0]) / 6,
          vertices[i + 1][1] + (s * vertices[i][1] - s * vertices[i + 2][1]) / 6
        ];
        b[3] = [vertices[i + 1][0], vertices[i + 1][1]];
        path.cubicTo(b[1][0], b[1][1], b[2][0], b[2][1], b[3][0], b[3][1]);
      }
      if (closeShape) {
        path.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
      }
      this._doFillStrokeClose(path, closeShape);
      path.delete();
    }
  } else if (
    isBezier &&
    (shapeKind === constants.POLYGON || shapeKind === null)
  ) {
    const path = new CanvasKit.Path();
    for (i = 0; i < numVerts; i++) {
      if (vertices[i].isVert) {
        if (vertices[i].moveTo) {
          path.moveTo(vertices[i][0], vertices[i][1]);
        } else {
          path.lineTo(vertices[i][0], vertices[i][1]);
        }
      } else {
        path.cubicTo(
          vertices[i][0],
          vertices[i][1],
          vertices[i][2],
          vertices[i][3],
          vertices[i][4],
          vertices[i][5]
        );
      }
    }
    this._doFillStrokeClose(path, closeShape);
    path.delete();
  } else if (
    isQuadratic &&
    (shapeKind === constants.POLYGON || shapeKind === null)
  ) {
    const path = new CanvasKit.Path();
    for (i = 0; i < numVerts; i++) {
      if (vertices[i].isVert) {
        if (vertices[i].moveTo) {
          path.moveTo(vertices[i][0], vertices[i][1]);
        } else {
          path.lineTo(vertices[i][0], vertices[i][1]);
        }
      } else {
        path.quadTo(
          vertices[i][0],
          vertices[i][1],
          vertices[i][2],
          vertices[i][3]
        );
      }
    }
    this._doFillStrokeClose(path, closeShape);
    path.delete();
  } else {
    if (shapeKind === constants.POINTS) {
      for (i = 0; i < numVerts; i++) {
        v = vertices[i];
        if (this._doStroke) {
          this._pInst.stroke(v[6]);
        }
        this._pInst.point(v[0], v[1]);
      }
    } else if (shapeKind === constants.LINES) {
      for (i = 0; i + 1 < numVerts; i += 2) {
        v = vertices[i];
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        this._pInst.line(v[0], v[1], vertices[i + 1][0], vertices[i + 1][1]);
      }
    } else if (shapeKind === constants.TRIANGLES) {
      for (i = 0; i + 2 < numVerts; i += 3) {
        v = vertices[i];
        const path = new CanvasKit.Path();
        path.moveTo(v[0], v[1]);
        path.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
        path.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
        path.close();
        if (this._doFill) {
          this._pInst.fill(vertices[i + 2][5]);
          this.drawingContext.fill();
        }
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 2][6]);
          this.drawingContext.stroke();
        }
        path.delete();
      }
    } else if (shapeKind === constants.TRIANGLE_STRIP) {
      for (i = 0; i + 1 < numVerts; i++) {
        v = vertices[i];
        const path = new CanvasKit.Path();
        path.moveTo(vertices[i + 1][0], vertices[i + 1][1]);
        path.lineTo(v[0], v[1]);
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 1][6]);
        }
        if (this._doFill) {
          this._pInst.fill(vertices[i + 1][5]);
        }
        if (i + 2 < numVerts) {
          path.lineTo(vertices[i + 2][0], vertices[i + 2][1]);
          if (this._doStroke) {
            this._pInst.stroke(vertices[i + 2][6]);
          }
          if (this._doFill) {
            this._pInst.fill(vertices[i + 2][5]);
          }
        }
        this._doFillStrokeClose(path, closeShape);
        path.delete();
      }
    } else if (shapeKind === constants.TRIANGLE_FAN) {
      if (numVerts > 2) {
        // For performance reasons, try to batch as many of the
        // fill and stroke calls as possible.
        const path = new CanvasKit.Path();
        for (i = 2; i < numVerts; i++) {
          v = vertices[i];
          path.moveTo(vertices[0][0], vertices[0][1]);
          path.lineTo(vertices[i - 1][0], vertices[i - 1][1]);
          path.lineTo(v[0], v[1]);
          path.lineTo(vertices[0][0], vertices[0][1]);
          // If the next colour is going to be different, stroke / fill now
          if (i < numVerts - 1) {
            if (
              (this._doFill && v[5] !== vertices[i + 1][5]) ||
              (this._doStroke && v[6] !== vertices[i + 1][6])
            ) {
              if (this._doFill) {
                this._pInst.fill(v[5]);
                this.drawingContext.fill();
                this._pInst.fill(vertices[i + 1][5]);
              }
              if (this._doStroke) {
                this._pInst.stroke(v[6]);
                this.drawingContext.stroke();
                this._pInst.stroke(vertices[i + 1][6]);
              }
              path.close();
              //this.drawingContext.beginPath(); // Begin the next one
            }
          }
        }
        this._doFillStrokeClose(path, closeShape);
        path.delete();
      }
    } else if (shapeKind === constants.QUADS) {
      for (i = 0; i + 3 < numVerts; i += 4) {
        v = vertices[i];
        const path = new CanvasKit.Path();
        path.moveTo(v[0], v[1]);
        for (j = 1; j < 4; j++) {
          path.lineTo(vertices[i + j][0], vertices[i + j][1]);
        }
        path.lineTo(v[0], v[1]);
        if (this._doFill) {
          this._pInst.fill(vertices[i + 3][5]);
        }
        if (this._doStroke) {
          this._pInst.stroke(vertices[i + 3][6]);
        }
        this._doFillStrokeClose(path, closeShape);
        path.delete();
      }
    } else if (shapeKind === constants.QUAD_STRIP) {
      if (numVerts > 3) {
        for (i = 0; i + 1 < numVerts; i += 2) {
          v = vertices[i];
          const path = new CanvasKit.Path();
          if (i + 3 < numVerts) {
            path.moveTo(vertices[i + 2][0], vertices[i + 2][1]);
            path.lineTo(v[0], v[1]);
            path.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
            path.lineTo(vertices[i + 3][0], vertices[i + 3][1]);
            if (this._doFill) {
              this._pInst.fill(vertices[i + 3][5]);
            }
            if (this._doStroke) {
              this._pInst.stroke(vertices[i + 3][6]);
            }
          } else {
            path.moveTo(v[0], v[1]);
            path.lineTo(vertices[i + 1][0], vertices[i + 1][1]);
          }
          this._doFillStrokeClose(path, closeShape);
          path.delete();
        }
      }
    } else {
      const path = new CanvasKit.Path();
      path.moveTo(vertices[0][0], vertices[0][1]);
      for (i = 1; i < numVerts; i++) {
        v = vertices[i];
        if (v.isVert) {
          if (v.moveTo) {
            path.moveTo(v[0], v[1]);
          } else {
            path.lineTo(v[0], v[1]);
          }
        }
      }
      this._doFillStrokeClose(path, closeShape);
      path.delete();
    }
  }
  isCurve = false;
  isBezier = false;
  isQuadratic = false;
  isContour = false;
  if (closeShape) {
    vertices.pop();
  }
  this.postSK();
  return this;
};

p5.RendererSkia.prototype.loadPixels = function() {
  if (this._pixelsState.pixels) {
    delete this._pixelsState.pixels;
  }

  // prettier-ignore
  pixels = this._skCanvas.readPixels(
      0, 0, this._skSurface.imageInfo()
  )
  this._pixelsState._setProperty('pixels', pixels);
};

p5.RendererSkia.prototype.updatePixels = function(x, y, w, h) {
  const pixelsState = this._pixelsState;
  let pixels = pixelsState.pixels;

  this.preSK();
  /*
  const image = CanvasKit.MakeImage(
    this._skSurface.imageInfo(),
    pixels,
    4 * this.width
  );

  this._skCanvas.drawImage(image, 0, 0, null);
  image.delete();
  */
  const imgInfo = this._skSurface.imageInfo();
  this._skCanvas.writePixels(
    pixels,
    this.width,
    this.height,
    0,
    0,
    imgInfo.alphaType,
    imgInfo.colorType,
    imgInfo.colorSpace
  );
  this.postSK();
};

p5.RendererSkia.prototype._applyTextProperties = function() {
  let textTypeface = this._textFont.skTypeface;
  const textSize = this._textSize;

  if (!textTypeface) {
    this._skFont = new CanvasKit.Font(null, textSize);
  } else {
    this._skFont = new CanvasKit.Font(textTypeface, textSize);
  }
};

p5.RendererSkia.prototype.textWidth = function(s) {
  if (!this._skFont) {
    this._applyTextProperties();
  }
  if (this._skFont) {
    return this._skFont.measureText(s);
  }
  return 0;
};

p5.RendererSkia.prototype._renderText = function(p, line, x, y, maxY) {
  if (y >= maxY) {
    return; // don't render lines beyond our maxY position
  }
  if (!this._skFont) {
    this._applyTextProperties();
  }

  p.push(); // fix to #803

  this.preSK();

  let xx = x;
  if (this._textAlign === constants.CENTER) {
    xx = x - this._skFont.measureText(line) / 2;
  } else if (this._textAlign === constants.RIGHT) {
    xx = x - this._skFont.measureText(line);
  }

  const matrix = this._skFont.getMetrics();
  //console.log(matrix);
  const ascent = matrix.ascent;
  const descent = matrix.descent;

  let yy = y;
  if (this._textBaseline === constants.TOP) {
    yy = y - ascent;
  } else if (this._textBaseline === constants.BOTTOM) {
    yy = y - descent;
  } else if (this._textBaseline === constants.CENTER) {
    yy = y - descent + (descent - ascent) / 2;
  }

  const textBlob = CanvasKit.TextBlob.MakeFromText(line, this._skFont);

  // no stroke unless specified by user
  if (this._doStroke && this._strokeSet) {
    //this._skCanvas.drawText(line, xx, yy, this._skStrokePaint, this._skFont);
    this._skCanvas.drawTextBlob(textBlob, xx, yy, this._skStrokePaint);
  }

  if (this._doFill) {
    // if fill hasn't been set by user, use default text fill
    if (!this._fillSet) {
      this._skFillPaint.setColor(
        this.ArgsToSkColor(constants._DEFAULT_TEXT_FILL)
      );
      //this._skCanvas.drawText(line, xx, yy, this._skFillPaint, this._skFont);
      this._skCanvas.drawTextBlob(textBlob, xx, yy, this._skFillPaint);
      this._skFillPaint.setColor(this._skFillColor);
    } else {
      //this._skCanvas.drawText(line, xx, yy, this._skFillPaint, this._skFont);
      this._skCanvas.drawTextBlob(textBlob, xx, yy, this._skFillPaint);
    }
  }

  this.postSK();

  p.pop();
  return p;
};

p5.RendererSkia.prototype._drawPath = function(path, x, y) {
  //console.log('drawPath in renderer');
  this.preSK();
  this._skCanvas.translate(x, y);
  if (path.pathEffect) {
    this._skStrokePaint.setPathEffect(path.pathEffect);
  } else {
    this._skStrokePaint.setPathEffect(null);
  }
  if (this._doFill) this._skCanvas.drawPath(path.skPath, this._skFillPaint);
  if (this._doStroke) this._skCanvas.drawPath(path.skPath, this._skStrokePaint);
  this._skCanvas.translate(-x, -y);
  this.postSK();
};

p5.RendererSkia.prototype._drawParagraph = function(pParagraph, x, y) {
  this.preSK();

  this._skCanvas.drawParagraph(pParagraph.paragraph, x, y);

  this.postSK();
};

p5.RendererSkia.prototype._drawSkottie = function(skottie) {
  this.preSK();

  if (!skottie.firstFrame) {
    skottie.firstFrame = Date.now();
  }

  let seek = ((Date.now() - skottie.firstFrame) / skottie.animDuration) % 1.0;
  let damage = skottie.animation.seek(seek);

  const rectLeft = 0;
  const rectTop = 1;
  const rectRight = 2;
  const rectBottom = 3;

  if (
    damage[rectRight] > damage[rectLeft] &&
    damage[rectBottom] > damage[rectTop]
  ) {
    this._skCanvas.clear(CanvasKit.WHITE);
    skottie.animation.render(
      this._skCanvas,
      CanvasKit.LTRBRect(0, 0, this.width, this.height)
    );
  }

  this.postSK();
};

p5.RendererSkia.prototype._drawTextBlob = function(textBlob) {
  this.preSK();
  if (this._doFill)
    this._skCanvas.drawTextBlob(textBlob.skTextBlob, 0, 0, this._skFillPaint);
  if (this._doStroke)
    this._skCanvas.drawTextBlob(textBlob.skTextBlob, 0, 0, this._skStrokePaint);
  this.postSK();
};

p5.RendererSkia.prototype._setShader = function(shader) {
  this._shader = shader;
  if (shader) {
    this._skFillPaint.setShader(this._shader.skShader);
    this._skStrokePaint.setShader(this._shader.skShader);
  } else {
    this._skFillPaint.setShader(null);
    this._skStrokePaint.setShader(null);
  }
};

// a push() operation is in progress.
// the renderer should return a 'style' object that it wishes to
// store on the push stack.
// derived renderers should call the base class' push() method
// to fetch the base style object.
p5.RendererSkia.prototype.push = function() {
  this._skCanvas.save();

  // get the base renderer style
  return p5.Renderer.prototype.push.apply(this);
};

// a pop() operation is in progress
// the renderer is passed the 'style' object that it returned
// from its push() method.
// derived renderers should pass this object to their base
// class' pop method
p5.RendererSkia.prototype.pop = function(style) {
  this._skCanvas.restore();

  // Re-cache the fill / stroke state
  //this._cachedFillStyle = this.drawingContext.fillStyle;
  //this._cachedStrokeStyle = this.drawingContext.strokeStyle;

  p5.Renderer.prototype.pop.call(this, style);
};

export default p5.RendererSkia;
