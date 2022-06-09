class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.dragging = false;
  }

  draw(w = 16, color = 0) {
    push();
    strokeWeight(w);
    if (this.dragging) {
      stroke(0, 255, 255);
    } else {
      stroke(color);
    }
    point(this.x, this.y);
    pop();
  }

  isHit(_x, _y) {
    if (dist(_x, _y, this.x, this.y) <= 8) {
      return true;
    }
    return false;
  }
}
