import { GOOSE_SIZE } from "./constants";
import GooseImage from "./lib/assets/Goose.png";

class Goose {
  // constructor
  constructor(p5, x, y) {
    this.image = p5.loadImage(GooseImage);
    this.x = x;
    this.y = y;
    this.width = GOOSE_SIZE;
    this.height = 2 * GOOSE_SIZE;
  }

  // methods
  draw(p5) {
    const canvasY = p5.height - this.y;
    p5.imageMode(p5.CORNER);
    p5.image(this.image, this.x, canvasY, this.width, this.height);
  }

  shiftTo(height) {
    this.y = height;
  }
}

export { Goose };
