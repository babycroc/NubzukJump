import { OBJECT_MIN_DISTANCE } from "./constants";

class Platform {
  // constructor
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // methods
  draw(p5) {
    const canvasY = p5.height - this.y;
    p5.noStroke();
    p5.fill("#40a0d2");
    p5.rectMode(p5.CORNER);
    p5.rect(this.x, canvasY, this.width, this.height, this.height / 2);
  }

  shiftTo(height) {
    this.y = height;
  }

  overlaps(object) {
    if (
      this.x - (object.x + object.width) > OBJECT_MIN_DISTANCE ||
      object.x - (this.x + this.width) > OBJECT_MIN_DISTANCE
    )
      return false;
    if (
      object.y - (this.y + this.height) > OBJECT_MIN_DISTANCE ||
      this.y - (object.y + object.height) > OBJECT_MIN_DISTANCE
    )
      return false;
    return true;
  }
}

export { Platform };
