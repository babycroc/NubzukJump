export function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function getRandom(min, max) {
  return Math.floor(min + Math.random() * (max - min));
}
