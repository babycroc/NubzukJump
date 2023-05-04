<script>
  import P5 from "p5-svelte";

  import Nubzuk from "./lib/assets/Nubzuk.png";

  let nubzuk;
  const sketch = (p5) => {
    p5.preload = () => {
      nubzuk = p5.loadImage(Nubzuk);
    };
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);
    };
    p5.draw = () => {
      p5.background(255);

      p5.imageMode(p5.CENTER);
      p5.image(nubzuk, p5.width / 2, p5.height - 50, 100, 100);
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
