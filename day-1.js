import assert from "assert";
import { readFileSync } from "fs";

console.log("day-1.js");

const testInput = `3   4
4   3
2   5
1   3
3   9
3   3`;
const testAnswer1 = 11;
const testAnswer2 = 31;

const input = readFileSync("input-day-1.txt", "utf-8");

function parse(input) {
  const left = [];
  const right = [];
  input
    .split("\n")
    .filter((s) => s)
    .map((s) => s.split("   "))
    .forEach((s) => {
      left.push(Number(s[0]));
      right.push(Number(s[1]));
    });
  return { left, right };
}

function question1(input) {
  const { left, right } = parse(input);
  const asc = (a, b) => a - b;
  left.sort(asc);
  right.sort(asc);
  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    sum += Math.abs(left[i] - right[i]);
  }
  return sum;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  const { left, right } = parse(input);
  let similarityScore = 0;
  left.forEach((l) => {
    const count = right.filter((r) => r === l).length;
    similarityScore += count * l;
  });
  return similarityScore;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
