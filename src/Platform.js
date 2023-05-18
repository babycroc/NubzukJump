import {
  NUBZUK_INIT_Y,
  PLATFORM_MIN_WIDTH,
  PLATFORM_MAX_WIDTH,
  PLATFORM_MIN_HEIGHT,
  PLATFORM_MAX_HEIGHT,
  PLATFORM_MIN_DISTANCE,
} from "./constants";

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
    p5.rect(this.x, p5.height - this.y, this.width, this.height);
  }

  shiftTo(height) {
    this.y = height;
  }

  overlaps(platform) {
    if (
      this.x - (platform.x + platform.width) > PLATFORM_MIN_DISTANCE ||
      platform.x - (this.x + this.width) > PLATFORM_MIN_DISTANCE
    )
      return false;
    if (
      platform.y - (this.y + this.height) > PLATFORM_MIN_DISTANCE ||
      this.y - (platform.y + platform.height) > PLATFORM_MIN_DISTANCE
    )
      return false;
    return true;
  }
}

class PlatformFactory {
  // constructor
  constructor() {
    this.platforms = [];
  }

  static getInstance() {
    // singleton pattern
    if (!this._instance) {
      this._instance = new PlatformFactory();
    }
    return this._instance;
  }

  // methods
  getPlatforms() {
    return this.platforms;
  }
  setPlatforms(platforms) {
    this.platforms = platforms;
  }

  addPlatform(platform) {
    this.platforms.push(platform);
  }

  createPlatforms(p5) {
    const initPlatform = new Platform(
      p5.width / 2 - PLATFORM_MIN_WIDTH / 2,
      NUBZUK_INIT_Y,
      PLATFORM_MIN_WIDTH,
      PLATFORM_MIN_HEIGHT
    );
    this.addPlatform(initPlatform);
    this.createPlatformsBetween(p5, 0, p5.height);
  }

  createPlatformsBetween(p5, yBottom, yTop) {
    const getRandom = (min, max) => {
      return min + Math.random() * (max - min);
    };

    const yInterval = 100;
    const platformPerInterval = 3;
    for (let y1 = yBottom; y1 <= yTop - yInterval; y1 += yInterval) {
      const y2 = y1 + yInterval;
      if (y2 > yTop) y2 = yTop;

      for (let i = 0; i < platformPerInterval; i++) {
        const width = Math.floor(
          getRandom(PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH)
        );
        const height = Math.floor(
          getRandom(PLATFORM_MIN_HEIGHT, PLATFORM_MAX_HEIGHT)
        );
        const x = Math.floor(getRandom(0, p5.width - width));
        const y = Math.floor(getRandom(y1, y2));

        const newPlatform = new Platform(x, y, width, height);
        if (
          this.platforms
            .map((p) => p.overlaps(newPlatform))
            .filter((p) => p == true).length == 0
        ) {
          this.addPlatform(newPlatform);
        }
      }
    }
  }

  draw(p5) {
    this.platforms.map((p) => p.draw(p5));
  }
}

export { Platform, PlatformFactory };
