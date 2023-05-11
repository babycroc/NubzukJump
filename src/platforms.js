const PLATFORM_MIN_WIDTH = 75;
const PLATFORM_MAX_WIDTH = 100;
const PLATFORM_MIN_HEIGHT = 10;
const PLATFORM_MAX_HEIGHT = 25;
const PLATFORM_MIN_DISTANCE = 10;

let platforms = [];
const initPlatformNum = 20;

const getRandom = (min, max) => {
  return min + Math.random() * (max - min);
};

export const createPlatforms = (p5) => {
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

  const createPlatform = (p5) => {
    const width = getRandom(PLATFORM_MIN_WIDTH, PLATFORM_MAX_WIDTH);
    const height = getRandom(PLATFORM_MIN_HEIGHT, PLATFORM_MAX_HEIGHT);
    const x = getRandom(0, p5.width - width);
    const y = getRandom(0, p5.height - height);
    const newPlatform = { x, y, width, height };
    if (
      platforms
        .map((p) => isOverlapping(p, newPlatform))
        .filter((p) => p == true).length == 0
    )
      platforms.push(newPlatform);
  };

  while (platforms.length < initPlatformNum) createPlatform(p5);
};

export const drawPlatforms = (p5) => {
  platforms.map((p) => p5.rect(p.x, p.y, p.width, p.height));
};
