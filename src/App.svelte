<script>
  import P5 from "p5-svelte";

  import Nubzuk from "./lib/assets/Nubzuk.png";

  let nubzuk;
  let nubzukX, nubzukY;

  let jumpStart, jumpDir;
  const jump = () => {
    const jumpHeight = 100;
    if (nubzukY >= jumpStart) jumpDir = -1;
    if (nubzukY <= jumpStart - jumpHeight) jumpDir = 1;
    nubzukY += jumpDir;
  };

  const sketch = (p5) => {
    p5.preload = () => {
      nubzuk = p5.loadImage(Nubzuk);
    };
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzukX = p5.width / 2;
      nubzukY = p5.height;

      jumpStart = nubzukY;
      jumpDir = 1;
    };
    p5.draw = () => {
      p5.background(255);

      p5.imageMode(p5.CENTER);
      p5.image(nubzuk, nubzukX, nubzukY - 50, 100, 100);

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
