let newTilt = 0;
let tilt = 0;
basic.forever(function () {
  const raw = input.acceleration(Dimension.X);
  const direction = raw > 0 ? 1 : -1;
  newTilt = direction * Math.floor(Math.abs(raw / 200));
  if (newTilt != tilt) {
    tilt = newTilt;
    serial.writeLine(`{"tilt":${tilt}}`);
  }
});
