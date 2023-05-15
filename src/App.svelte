<script>
  import P5 from "p5-svelte";

  import { Nubzuk } from "./Nubzuk";
  import { createPlatforms, drawPlatforms, getPlatforms } from "./platforms";
  import { delay } from "./utils";
  import { DT } from "./constants";

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
            if (nubzuk.onPlatform(platform)) {
              stop = true;

              const shiftHeight = nubzuk.getY();
              nubzuk.toBaseline();

              getPlatforms().map(async (platform) => {
                const initialY = platform.y;
                const dy = (Math.floor(shiftHeight) / 10) * DT;
                for (let y = initialY; y > initialY - shiftHeight; y -= dy) {
                  platform.y = Math.ceil(y);
                  await delay(DT);
                }
              });
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
