import {
  DT,
  G,
  NUBZUK_HORIZONTAL_STEP,
  NUBZUK_INIT_VY,
  NUBZUK_SIZE,
} from "./constants";
import NubzukImage from "./lib/assets/Nubzuk.png";

class Nubzuk {
  // constructor
  constructor(p5) {
    this.image = p5.loadImage(NubzukImage);
    this.size = NUBZUK_SIZE;
    this.x = p5.width / 2;
    this.y = 0;
    this.vy = NUBZUK_INIT_VY;
  }

  // singleton pattern
  static getInstance(p5) {
    // singleton pattern
    if (!this._instance) {
      this._instance = new Nubzuk(p5);
    }
    return this._instance;
  }

  // methods
  draw(p5) {
    const canvasY = p5.height - this.y;
    p5.imageMode(p5.CENTER);
    p5.image(this.image, this.x, canvasY - this.size / 2, this.size, this.size);

    // p5.ellipseMode(p5.CENTER);
    // p5.ellipse(this.x, canvasY, 5, 5);
  }

  jump() {
    if (this.y < 0) {
      this.y = 0;
      this.vy = NUBZUK_INIT_VY;
    }
    this.y += this.vy * DT;
    this.vy -= G * DT;
  }

  move(p5, direction) {
    this.x += direction * NUBZUK_HORIZONTAL_STEP;
    this.x = this.x + (p5.width % p5.width);
  }

  onPlatform(p5, platform) {
    const canvasY = p5.height - this.y;
    if (
      platform.x - 10 <= this.x &&
      this.x <= platform.x + platform.width + 10 &&
      platform.y - 5 <= canvasY &&
      canvasY <= platform.y + 5
    ) {
      return true;
    } else {
      return false;
    }
  }
}

export { Nubzuk };
