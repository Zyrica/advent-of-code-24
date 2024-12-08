import assert from "assert";
import { readFileSync } from "fs";

const day = 8;

console.log(`day-${day}.js`);

const testInput = `............
........0...
.....0......
.......0....
....0.......
......A.....
............
............
........A...
.........A..
............
............`;
const testAnswer1 = 14;
const testAnswer2 = 34;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  const rows = input.replace(/\r/g, "").split("\n");
  const max = {
    x: rows[0].length,
    y: rows.length,
  };
  const nodes = {};
  for (let y = 0; y < max.y; y++) {
    for (let x = 0; x < max.x; x++) {
      const value = rows[y][x];
      if (value !== ".") {
        if (!nodes[value]) nodes[value] = [];
        nodes[value].push({ x, y });
      }
    }
  }

  return { max, nodes };
}
function getAntiNodes(n1, n2) {
  const dx = n1.x - n2.x;
  const dy = n1.y - n2.y;
  const an1 = {
    x: n1.x + dx,
    y: n1.y + dy,
  };
  const an2 = {
    x: n2.x - dx,
    y: n2.y - dy,
  };
  return [an1, an2];
}
function question1(input) {
  const { max, nodes } = parse(input);
  const antiNodes = {};
  for (const key in nodes) {
    const v = nodes[key];
    for (let i = 0; i < v.length - 1; i++) {
      for (let j = i + 1; j < v.length; j++) {
        const n1 = v[i];
        const n2 = v[j];
        getAntiNodes(n1, n2).forEach(({ x, y }) => {
          if (x >= 0 && x < max.x && y >= 0 && y < max.y) {
            const key = `${x},${y}`;
            if (!antiNodes[key]) antiNodes[key] = 0;
            antiNodes[key]++;
          }
        });
      }
    }
  }

  return Object.keys(antiNodes).length;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

const precision = 0.0001;

function getAntiNodesInLine(n1, n2, max) {
  const antiNodes = [];
  const m = (n2.y - n1.y) / (n2.x - n1.x);
  const c = n1.y - m * n1.x;
  for (let x = 0; x < max.x; x++) {
    for (let y = 0; y < max.y; y++) {
      if (y === Math.round((m * x + c) / precision) * precision) {
        antiNodes.push({ x, y });
      }
    }
  }
  return antiNodes;
}

function question2(input) {
  const { max, nodes } = parse(input);
  const antiNodes = {};
  for (const key in nodes) {
    const v = nodes[key];
    for (let i = 0; i < v.length - 1; i++) {
      for (let j = i + 1; j < v.length; j++) {
        const n1 = v[i];
        const n2 = v[j];
        getAntiNodesInLine(n1, n2, max).forEach(({ x, y }) => {
          if (x >= 0 && x < max.x && y >= 0 && y < max.y) {
            const key = `${x},${y}`;
            if (!antiNodes[key]) antiNodes[key] = 0;
            antiNodes[key]++;
          }
        });
      }
    }
  }

  return Object.keys(antiNodes).length;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
