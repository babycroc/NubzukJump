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
    p5.imageMode(p5.CENTER);
    p5.image(
      this.image,
      this.x,
      p5.height - this.y - this.size / 2,
      this.size,
      this.size
    );
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
}

export { Nubzuk };
