import assert from "assert";
import { readFileSync } from "fs";

const day = 12;

console.log(`day-${day}.js`);

const testInput = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;
const testAnswer1 = 1930;
const testAnswer2 = 1206;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function search(
  grid,
  centerX,
  centerY,
  value,
  region,
  checked = {},
  fenceAlignment = "",
) {
  const key = `${centerX},${centerY}`;
  if (checked[key]) return;

  if (!grid[centerY] || grid[centerY][centerX] !== value) {
    region.fence++;
    const key = `${centerX},${centerY}`;
    region.fenceCoords[fenceAlignment][key] = { x: centerX, y: centerY };
  } else {
    region.amount++;
    grid[centerY][centerX] = false;
    checked[key] = true;

    [
      [0, -1, "L"],
      [0, 1, "R"],
      [1, 0, "D"],
      [-1, 0, "U"],
    ].forEach(([x, y, fenceAlignment]) => {
      search(
        grid,
        centerX + x,
        centerY + y,
        value,
        region,
        checked,
        fenceAlignment,
      );
    });
  }
}
function parse(input) {
  const grid = input
    .replaceAll("\r", "")
    .split("\n")
    .map((row) => row.split(""));

  const regions = [];
  for (let y = 0; y < grid.length; y++) {
    const row = grid[y];
    for (let x = 0; x < row.length; x++) {
      const v = row[x];
      if (v) {
        const region = {
          name: v,
          amount: 0,
          fence: 0,
          fenceCoords: {
            L: {},
            R: {},
            U: {},
            D: {},
          },
        };
        regions.push(region);
        search(grid, x, y, v, region);
      }
    }
  }
  return regions;
}

function question1(input) {
  return parse(input).reduce(
    (acc, regions) => acc + regions.amount * regions.fence,
    0,
  );
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function countSides(coords) {
  let count = 0;
  while (Object.keys(coords).length) {
    const key = Object.keys(coords)[0];
    count++;
    let c = coords[key];
    let x = 1;
    while (coords[`${c.x - x},${c.y}`]) {
      delete coords[`${c.x - x},${c.y}`];
      x++;
    }
    x = 1;
    while (coords[`${c.x + x},${c.y}`]) {
      delete coords[`${c.x + x},${c.y}`];
      x++;
    }
    let y = 1;
    while (coords[`${c.x},${c.y - y}`]) {
      delete coords[`${c.x},${c.y - y}`];
      y++;
    }
    y = 1;
    while (coords[`${c.x},${c.y + y}`]) {
      delete coords[`${c.x},${c.y + y}`];
      y++;
    }
    delete coords[key];
  }
  return count;
}

function question2(input) {
  return parse(input).reduce((acc, region) => {
    let sides =
      countSides(region.fenceCoords.L) +
      countSides(region.fenceCoords.R) +
      countSides(region.fenceCoords.U) +
      countSides(region.fenceCoords.D);

    return acc + sides * region.amount;
  }, 0);
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
