import { NUBZUK_INIT_Y } from "./constants";

const PLATFORM_MIN_WIDTH = 75;
const PLATFORM_MAX_WIDTH = 100;
const PLATFORM_MIN_HEIGHT = 10;
const PLATFORM_MAX_HEIGHT = 25;
const PLATFORM_MIN_DISTANCE = 10;

let platforms = [];

const getRandom = (min, max) => {
  return min + Math.random() * (max - min);
};

export const getPlatforms = () => {
  return platforms;
};

export const createPlatformsBetween = (p5, yBottom, yTop) => {
  const isOverlapping = (p1, p2) => {
    if (
      p1.x - (p2.x + p2.width) > PLATFORM_MIN_DISTANCE ||
      p2.x - (p1.x + p1.width) > PLATFORM_MIN_DISTANCE
    )
      return false;
    if (
      p2.y - (p1.y + p1.height) > PLATFORM_MIN_DISTANCE ||
      p1.y - (p2.y + p2.height) > PLATFORM_MIN_DISTANCE
    )
      return false;
    return true;
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

      const newPlatform = { x, y, width, height };
      if (
        platforms
          .map((p) => isOverlapping(p, newPlatform))
          .filter((p) => p == true).length == 0
      ) {
        platforms.push(newPlatform);
      }
    }
  }
};

export const createPlatforms = (p5) => {
  platforms.push({
    x: p5.width / 2 - PLATFORM_MIN_WIDTH / 2,
    y: NUBZUK_INIT_Y,
    width: PLATFORM_MIN_WIDTH,
    height: PLATFORM_MIN_HEIGHT,
  });
  createPlatformsBetween(p5, 0, p5.height);
};

export const drawPlatforms = (p5) => {
  platforms.map((p) => p5.rect(p.x, p5.height - p.y, p.width, p.height));
};

export const onPlatform = (x, y) => {
  const error = 5;
  return (
    platforms.filter(
      (p) =>
        p.x <= x && x <= p.x + p.width && p.y - error <= y && y <= p.y + error
    ).length !== 0
  );
};
