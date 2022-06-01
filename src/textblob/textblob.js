/**
 * @module TextBlob
 * @submodule TextBlob
 * @for p5
 * @requires core
 */

/**
 * This module defines the p5 methods for the <a href="#/p5.Image">p5.Image</a> class
 * for drawing images to the main display canvas.
 */
import p5 from '../core/main';

p5.prototype.createTextBlob = function() {
  return new p5.TextBlob();
};

p5.prototype.drawTextBlob = function(textBlob, x = 0, y = 0) {
  this._renderer._drawTextBlob(textBlob, x, y);
};

export default p5;
