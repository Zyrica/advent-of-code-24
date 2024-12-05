import assert from "assert";
import { readFileSync } from "fs";

console.log("day-4.js");

const testInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
const testAnswer1 = 18;
const testAnswer2 = 9;

const input = readFileSync("input-day-4.txt", "utf-8");

function parse(input) {
  return input.replace("\r", "").split("\n");
}

function countInString(s) {
  return (s.match(/XMAS/g) || []).length + (s.match(/SAMX/g) || []).length;
}

function question1(input) {
  const rows = parse(input);

  let count = 0;
  for (let x = 0; x < rows[0].length; x++) {
    count += countInString(rows[x]);
  }
  for (let y = 0; y < rows.length; y++) {
    const s = rows.map((row) => row[y]).join("");
    count += countInString(s);
  }
  for (let x = 0; x < rows[0].length - 3; x++) {
    for (let y = 0; y < rows.length - 3; y++) {
      const s1 =
        rows[x][y] +
        rows[x + 1][y + 1] +
        rows[x + 2][y + 2] +
        rows[x + 3][y + 3];
      const s2 =
        rows[x][y + 3] +
        rows[x + 1][y + 2] +
        rows[x + 2][y + 1] +
        rows[x + 3][y];
      count += countInString(s1) + countInString(s2);
    }
  }

  return count;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  const rows = parse(input);

  let count = 0;
  for (let x = 0; x < rows[0].length - 2; x++) {
    for (let y = 0; y < rows.length - 2; y++) {
      if (rows[x + 1][y + 1] === "A") {
        const s1 = rows[x][y] + rows[x + 2][y + 2];
        const s2 = rows[x][y + 2] + rows[x + 2][y];
        if (["SM", "MS"].includes(s1) && ["SM", "MS"].includes(s2)) {
          count++;
        }
      }
    }
  }
  return count;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
