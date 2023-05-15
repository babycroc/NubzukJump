<script>
  import P5 from "p5-svelte";

  import { Nubzuk } from "./Nubzuk";
  import { createPlatforms, drawPlatforms, getPlatforms } from "./platforms";

  let nubzuk;

  let stop = false;

  const sketch = (p5) => {
    p5.preload = () => {};
    p5.setup = () => {
      p5.createCanvas(p5.windowWidth, p5.windowHeight);

      nubzuk = Nubzuk.getInstance(p5);
      createPlatforms(p5);
    };
    p5.draw = () => {
      p5.background(255);

      drawPlatforms(p5);

      nubzuk.draw(p5);

      if (!stop) {
        nubzuk.jump();
        if (p5.keyIsDown(p5.LEFT_ARROW)) nubzuk.move(p5, -1);
        if (p5.keyIsDown(p5.RIGHT_ARROW)) nubzuk.move(p5, 1);

        if (nubzuk.vy < 0) {
          for (const platform of getPlatforms()) {
            if (nubzuk.onPlatform(p5, platform)) {
              stop = true;
              nubzuk.toBaseline();
            }
          }
        }
      }
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
