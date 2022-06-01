/**
 * @module Paragraph
 * @submodule Paragraph
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.Paragraph">p5.Paragraph</a> class and P5 methods for
 * drawing Paragraph to the main display canvas.
 */

import p5 from '../core/main';

p5.Paragraph = function() {
  //console.log('Paragraph');
};

p5.Paragraph.prototype.layout = function(width) {
  this.paragraph.layout(width);
};

p5.Paragraph.prototype.getShapedLines = function() {
  return this.paragraph.getShapedLines();
};

p5.Paragraph.prototype.getWordBoundary = function(offset) {
  return this.paragraph.getWordBoundary(offset);
};

export default p5.Paragraph;
