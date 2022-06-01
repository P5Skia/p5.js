/**
 * @module TextBlob
 * @submodule TextBlob
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.TextBlob">p5.TextBlob</a> class and P5 methods for
 * drawing TextBlob to the main display canvas.
 */

import p5 from '../core/main';

p5.TextBlob = function() {
  this.skTextBlob = null;
};

p5.TextBlob.prototype.MakeTextOnPath = function(
  str,
  path,
  font,
  fontSize,
  initialOffset
) {
  const skFont = new CanvasKit.Font(font.skTypeface, fontSize);
  this.skTextBlob = CanvasKit.TextBlob.MakeOnPath(
    str,
    path.skPath,
    skFont,
    initialOffset
  );
};

export default p5.TextBlob;