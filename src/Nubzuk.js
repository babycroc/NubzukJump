import {
  DT,
  G,
  NUBZUK_HORIZONTAL_STEP,
  NUBZUK_INIT_VY,
  NUBZUK_INIT_Y,
  NUBZUK_SIZE,
} from "./constants";
import NubzukImage from "./lib/assets/Nubzuk.png";
import { delay } from "./utils";

class Nubzuk {
  // constructor
  constructor(p5) {
    this.image = p5.loadImage(NubzukImage);
    this.size = NUBZUK_SIZE;
    this.x = p5.width / 2;
    this.y = NUBZUK_INIT_Y;
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
  getY() {
    return this.y;
  }
  setY(y) {
    this.y = y;
  }

  draw(p5) {
    const canvasY = p5.height - this.y;
    p5.imageMode(p5.CENTER);
    p5.image(this.image, this.x, canvasY - this.size / 2, this.size, this.size);
  }

  jump() {
    this.y += this.vy * DT;
    this.vy -= G * DT;
  }

  move(p5, direction) {
    this.x += direction * NUBZUK_HORIZONTAL_STEP;
    this.x = (this.x + p5.width) % p5.width;
  }

  onPlatform(platform) {
    const nextY = this.y + this.vy * DT;
    if (
      platform.x - 10 <= this.x &&
      this.x <= platform.x + platform.width + 10 &&
      this.y >= platform.y &&
      platform.y >= nextY
    ) {
      return true;
    } else {
      return false;
    }
  }

  async toBaseline() {
    const dy = (Math.floor(this.y) / 10) * DT;
    for (let y = this.getY(); y > NUBZUK_INIT_Y; y -= dy) {
      await this.setY(Math.ceil(y));
      await delay(DT);
    }
    this.y = NUBZUK_INIT_Y;
    this.vy = NUBZUK_INIT_VY;
  }
}

export { Nubzuk };
