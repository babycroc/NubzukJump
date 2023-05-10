<script>
  import P5 from "p5-svelte";

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

  const sketch = (p5) => {
    p5.preload = () => {
      nubzuk = p5.loadImage(Nubzuk);
    };
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzukX = p5.width / 2;
      nubzukY = initY;
      nubzukVy = initVy;
    };
    p5.draw = () => {
      p5.background(255);

      p5.imageMode(p5.CENTER);
      p5.image(nubzuk, nubzukX, p5.height - nubzukY - 50, 100, 100);

      jump();
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
