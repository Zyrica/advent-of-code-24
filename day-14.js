import { Jimp } from "jimp";
import assert from "assert";
import { readFileSync } from "fs";

const day = 14;

console.log(`day-${day}.js`);

const testInput = `p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`;
const testAnswer1 = 12;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  const positions = [];
  const velocities = [];
  input
    .replaceAll("\r", "")
    .split("\n")
    .forEach((s) => {
      const [p, v] = s.split(" ");
      positions.push(
        p
          .replace("p=", "")
          .split(",")
          .map((s) => Number(s)),
      );
      velocities.push(
        v
          .replace("v=", "")
          .split(",")
          .map((s) => Number(s)),
      );
    });
  return { positions, velocities };
}

function print(positions, width, height) {
  let s = "";
  for (let y = 0; y < height; y++) {
    let row = "";
    for (let x = 0; x < width; x++) {
      const found = positions.filter((p) => p[0] === x && p[1] === y);
      row += found.length ? found.length : " ";
    }
    s += row + "\n";
  }
  console.log(s);
}

function calculateSaftyFactor(positions, width, height) {
  let quadrants = [0, 0, 0, 0];
  positions.forEach(([x, y]) => {
    const horizontalCenter = (width - 1) / 2;
    const left = x < horizontalCenter;
    const right = horizontalCenter < x;

    const verticalCenter = (height - 1) / 2;
    const top = y < verticalCenter;
    const bottom = verticalCenter < y;

    if (left && top) quadrants[0] += 1;
    if (right && top) quadrants[1] += 1;
    if (left && bottom) quadrants[2] += 1;
    if (right && bottom) quadrants[3] += 1;
  });
  return quadrants.reduce((a, b) => a * b);
}

function question1(input, width, height, seconds) {
  const { positions, velocities } = parse(input);
  const robots = positions.length;
  for (let s = 0; s < seconds; s++) {
    for (let i = 0; i < robots; i++) {
      let px = positions[i][0] + velocities[i][0];
      let py = positions[i][1] + velocities[i][1];

      if (px < 0) px += width;
      if (px >= width) px -= width;
      if (py < 0) py += height;
      if (py >= height) py -= height;

      positions[i] = [px, py];
    }
  }
  return calculateSaftyFactor(positions, width, height);
}

assert.strictEqual(question1(testInput, 11, 7, 100), testAnswer1);

console.log("Answer question 1:", question1(input, 101, 103, 100));
function createImage(positions, seconds, width, height) {
  const img = new Jimp({ width, height, color: 0x000000 });

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const found = positions.filter((p) => p[0] === x && p[1] === y);
      const color = found.length ? 0xffffff : 0x000000;
      img.setPixelColor(color, x, y);
    }
  }

  img.write("img/" + seconds + ".png", (err) => {
    if (err) throw err;
  });
}

function question2(input, width, height, start, stop) {
  const { positions, velocities } = parse(input);

  const robots = positions.length;
  for (let s = start; s < stop; s++) {
    for (let i = 0; i < robots; i++) {
      let px = positions[i][0] + velocities[i][0];
      let py = positions[i][1] + velocities[i][1];

      if (px < 0) px += width;
      if (px >= width) px -= width;
      if (py < 0) py += height;
      if (py >= height) py -= height;

      positions[i] = [px, py];
    }
    createImage(positions, s, width, height);
  }
}

question2(input, 101, 103, 0, 1000);
