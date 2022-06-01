/**
 * @module Skottie
 * @submodule Skottie
 * @requires core
 * @requires constants
 * @requires filters
 */

/**
 * This module defines the <a href="#/p5.Skottie">p5.Skottie</a> class and P5 methods for
 * drawing Skottie to the main display canvas.
 */

import p5 from '../core/main';

p5.Skottie = function(id) {
  this.id = id;
  console.log('Skottie', id);
};

export default p5.Skottie;
