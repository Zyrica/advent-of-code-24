import assert from "assert";
import { readFileSync } from "fs";

const day = 10;
console.clear();
console.log(`day-${day}.js`);

const testInput = `89010123
78121874
87430965
96549874
45678903
32019012
01329801
10456732`;
const testAnswer1 = 36;
const testAnswer2 = 81;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  const grid = input.replaceAll("\r", "").split("\n");
  const heads = [];
  const ends = [];
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (grid[y][x] === "0") {
        heads.push({ y, x });
      }
      if (grid[y][x] === "9") {
        ends.push({ y, x });
      }
    }
  }
  return { grid, heads, ends };
}

function getKey(coord) {
  return `${coord.x},${coord.y}`;
}
// removes duplicates
function mergeCoordArrays(a1, a2) {
  const result = {};
  [...a1, ...a2].forEach((a) => {
    result[getKey(a)] = a;
  });
  return Object.values(result);
}

function findAround(grid, center, value) {
  if (Array.isArray(center)) {
    let all = [];
    center.forEach((c) => {
      const around = findAround(grid, c, value);
      all = mergeCoordArrays(all, around);
    });
    return all;
  }

  const around = [];
  const offsets = [
    { x: 0, y: -1 },
    { x: 1, y: 0 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
  ];
  offsets.forEach((offset) => {
    const y = center.y + offset.y;
    const x = center.x + offset.x;
    if (grid[y] && grid[y][x] && Number(grid[y][x]) === value) {
      around.push({ x, y });
    }
  });
  return around;
}

function question1(input) {
  const { grid, heads } = parse(input);
  let result = 0;
  heads.forEach((head) => {
    let positions = [head];
    let next = 1;
    while (next < 10) {
      positions = findAround(grid, positions, next);
      next++;
    }
    result += positions.length;
  });
  return result;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function countDistinctPaths(grid, center, value, end) {
  if (center.x === end.x && center.y === end.y) {
    return 1;
  }
  const around = findAround(grid, center, value);
  let sum = 0;
  around.forEach((a) => {
    sum += countDistinctPaths(grid, a, value + 1, end);
  });
  return sum;
}

function question2(input) {
  const { grid, heads, ends } = parse(input);
  let sum = 0;
  heads.forEach((head) => {
    ends.forEach((end) => {
      sum += countDistinctPaths(grid, head, 1, end);
    });
  });

  return sum;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
