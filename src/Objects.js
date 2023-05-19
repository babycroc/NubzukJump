import { Goose } from "./Goose";
import { Platform } from "./Platform";
import {
  NUBZUK_INIT_Y,
  PLATFORM_MIN_WIDTH,
  PLATFORM_MAX_WIDTH,
  PLATFORM_MIN_HEIGHT,
  PLATFORM_MAX_HEIGHT,
  GOOSE_SIZE,
  NUBZUK_SIZE,
} from "./constants";
import { getRandom } from "./utils";

class Objects {
  // constructor
  constructor() {
    this.platforms = [];
    this.obstacles = [];
  }

  static getInstance() {
    // singleton pattern
    if (!this._instance) {
      this._instance = new Objects();
    }
    return this._instance;
  }

  // methods
  getObjects() {
    return this.platforms.concat(this.obstacles);
  }
  getPlatforms() {
    return this.platforms;
  }
  setPlatforms(platforms) {
    this.platforms = platforms;
  }
  getObstacles() {
    return this.obstacles;
  }
  setObstacles(obstacles) {
    this.obstacles = obstacles;
  }

  addPlatform(platform) {
    this.platforms.push(platform);
  }
  addObstacle(obstacle) {
    this.obstacles.push(obstacle);
  }

  createPlatforms(p5) {
    const initPlatform = new Platform(
      p5.width / 2 - PLATFORM_MIN_WIDTH / 2,
      NUBZUK_INIT_Y + NUBZUK_SIZE,
      PLATFORM_MIN_WIDTH,
      PLATFORM_MAX_HEIGHT
    );
    this.addPlatform(initPlatform);
    this.createObjectsBetween(p5, 0, p5.height, false);
  }

  createObjectsBetween(p5, yBottom, yTop, obstacles) {
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

    if (obstacles && yTop - yBottom > 2 * GOOSE_SIZE && Math.random() < 0.1) {
      const x = getRandom(0, p5.width - GOOSE_SIZE);
      const y = getRandom(yBottom, yTop - 2 * GOOSE_SIZE);
      const newObstacle = new Goose(p5, x, y);
      this.addObstacle(newObstacle);

      const filteredPlatforms = this.getPlatforms().filter(
        (p) => p.overlaps(newObstacle) == false
      );
      this.setPlatforms(filteredPlatforms);
    }
  }

  draw(p5) {
    this.platforms.map((p) => p.draw(p5));
    this.obstacles.map((p) => p.draw(p5));
  }
}

export { Objects };
