<script>
  import P5 from "p5-svelte";

  import { createPlatforms, drawPlatforms } from "./platforms";

  import Nubzuk from "./lib/assets/Nubzuk.png";

  let nubzuk;
  let nubzukX, nubzukY; // position of Nubzuk's feet
  let nubzukVy;

  const dt = 0.25;
  const g = 9.8;

  const initY = 0;
  const initVy = 75;

  const jump = () => {
    if (nubzukY < initY) {
      nubzukY = initY;
      nubzukVy = initVy;
    }
    nubzukY += nubzukVy * dt;
    nubzukVy -= g * dt;
  };

  const move = (p5) => {
    const step = 5;
    if (p5.keyIsDown(p5.LEFT_ARROW)) nubzukX -= step;
    if (p5.keyIsDown(p5.RIGHT_ARROW)) nubzukX += step;
    nubzukX = (nubzukX + p5.width) % p5.width;
  };

  const sketch = (p5) => {
    p5.preload = () => {
      nubzuk = p5.loadImage(Nubzuk);
    };
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzukX = p5.width / 2;
      nubzukY = initY;
      nubzukVy = initVy;

      createPlatforms(p5);
    };
    p5.draw = () => {
      p5.background(255);

      p5.imageMode(p5.CENTER);
      p5.image(nubzuk, nubzukX, p5.height - nubzukY - 50, 100, 100);

      jump();
      move(p5);

      drawPlatforms(p5);
    };
    p5.windowResized = () => {
      p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    };
  };
</script>

<main>
  <P5 {sketch} />
</main>

<style>
  main {
    text-align: center;
  }
</style>
