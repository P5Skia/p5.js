import p5 from '../core/main';

p5.SVG = function(...args) {
  this.elements = [];
  this.fillColor = '#000';
  this.strokeColor = '#000';
  this.strokeWeight = 0.1;

  if (args.length > 0) {
    const path = new p5.Path(...args);
    const el = {
      path: path,
      fill: 'currentColor',
      stroke: 'currentColor',
      strokeWeight: 0.1
    };
    this.elements.push(el);
  }
};

p5.SVG.prototype.jsonParse = function(json) {
  const _svg = json['svg'];
  if (!_svg) {
    return;
  }

  var _paths = [];

  function addPathsFromG(g) {
    if (g['g']) {
      addPathsFromG(g['g']);
    }
    if (!g['path']) {
      return;
    }
    if (g['path'].length) {
      for (let i = 0; i < g['path'].length; i++) {
        let gp = g['path'][i];
        _paths.push(gp);
      }
    } else {
      _paths.push(g['path']);
    }

    if (g['@fill']) {
      this.svgFill = g['@fill'];
    } else if (g['fill']) {
      this.svgFill = g['fill'];
    }

    if (g['@stroke']) {
      this.svgStroke = g['@stroke'];
    } else if (g['stroke']) {
      this.svgStroke = g['stroke'];
    }

    if (g['@stroke-width']) {
      this.svgStrokeWeight = parseFloat(g['@stroke-width']);
    } else if (g['stroke-width']) {
      this.svgStrokeWeight = parseFloat(g['stroke-width']);
    }
  }

  if (_svg['@fill']) {
    this.svgFill = _svg['@fill'];
  } else if (_svg['fill']) {
    this.svgFill = _svg['fill'];
  }
  if (_svg['@stroke']) {
    this.svgStroke = _svg['@stroke'];
  } else if (_svg['stroke']) {
    this.svgStroke = _svg['stroke'];
  }
  if (_svg['@stroke-width']) {
    this.svgStrokeWeight = parseFloat(_svg['@stroke-width']);
  } else if (_svg['stroke-width']) {
    this.svgStrokeWeight = parseFloat(_svg['stroke-width']);
  }

  if (_svg['g']) {
    addPathsFromG(_svg['g']);
  } else {
    if (_svg['path'].length) {
      for (let i = 0; i < _svg['path'].length; i++) {
        let gp = _svg['path'][i];
        _paths.push(gp);
      }
    } else {
      _paths.push(_svg['path']);
    }
  }
  this.svgWidth = 0;
  this.svgHeight = 0;
  if (_svg['@width']) {
    this.svgWidth = parseFloat(_svg['@width']);
  }
  if (_svg['@height']) {
    this.svgHeight = parseFloat(_svg['@height']);
  }

  const _viewBox = _svg['@viewBox'].split(' ');
  this.viewBox = {
    x: parseFloat(_viewBox[0]),
    y: parseFloat(_viewBox[1]),
    w: parseFloat(_viewBox[2]),
    h: parseFloat(_viewBox[3])
  };

  let pathWidth = 0;
  let pathHeight = 0;
  let pathX = 0;
  let pathY = 0;
  for (var p = 0; p < _paths.length; p++) {
    const _path = _paths[p];
    const _svgString = _path['@d'];
    const element = {};
    element.path = new p5.Path(_svgString);
    if (_path['@fill']) {
      element.fill = _path['@fill'];
    } else if (_path['fill']) {
      element.fill = _path['fill'];
    }
    if (_path['@stroke']) {
      element.stroke = _path['@stroke'];
    }
    if (_path['@stroke-width']) {
      element.strokeWeight = parseFloat(_path['@stroke-width']);
    }

    const _bounds = element.path.skPath.computeTightBounds();

    if (p === 0) {
      pathX = _bounds[0];
      pathY = _bounds[1];
      pathWidth = _bounds[2];
      pathHeight = _bounds[3];
    } else {
      if (_bounds[0] < pathX) {
        pathX = _bounds[0];
      }
      if (_bounds[1] < pathY) {
        pathY = _bounds[1];
      }
      if (_bounds[2] > pathWidth) {
        pathWidth = _bounds[2];
      }
      if (_bounds[3] > pathHeight) {
        pathHeight = _bounds[3];
      }
    }

    this.elements.push(element);
  }
  this.pathX = pathX - 1;
  this.pathY = pathY - 1;
  this.pathWidth = pathWidth + 2;
  this.pathHeight = pathHeight + 2;

  for (var e = 0; e < this.elements.length; e++) {
    const el = this.elements[e];
    el.path.skPath.transform(1, 0, -this.pathX, 0, 1, -this.pathY, 0, 0, 1);
  }
};

p5.SVG.prototype.draw = function(_p5, _x = 0, _y = 0) {
  if (this.svgFill) {
    if (this.svgFill === 'currentColor') {
      _p5.fill(this.fillColor);
    } else {
      _p5.fill(this.svgFill);
    }
  } else {
    _p5.fill(this.fillColor);
  }

  if (this.svgStroke) {
    if (this.svgStroke === 'currentColor') {
      _p5.stroke(this.strokeColor);
    } else {
      _p5.stroke(this.svgStroke);
    }
  } else {
    _p5.stroke(this.strokeColor);
  }

  if (this.svgStrokeWeight) {
    _p5.strokeWeight(parseFloat(this.svgStrokeWeight));
  } else {
    _p5.strokeWeight(this.strokeWeight);
  }

  for (var i = 0; i < this.elements.length; i++) {
    const _el = this.elements[i];
    const _path = _el.path;
    if (_el.fill === 'none') {
      _p5.fill(0);
    } else if (_el.fill === undefined) {
      _p5.fill(this.fillColor);
    } else if (_el.fill === 'currentColor') {
      _p5.fill(this.fillColor);
    } else {
      _p5.fill(_el.fill);
    }
    if (_el.stroke === 'none') {
      _p5.stroke(0);
    } else if (_el.stroke === undefined) {
      _p5.stroke(this.strokeColor);
    } else if (_el.stroke === 'currentColor') {
      _p5.stroke(this.strokeColor);
    } else {
      _p5.stroke(_el.stroke);
    }
    if (_el.strokeWeight) {
      _p5.strokeWeight(parseFloat(_el.strokeWeight));
    }
    _p5.drawPath(_path, _x, _y);
  }
};
