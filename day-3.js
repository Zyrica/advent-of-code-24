import assert from "assert";
import { readFileSync } from "fs";

console.log("day-3.js");

const testInput = `xmul(2,4)&mul[3,7]!^don't()_mul(5,5)+mul(32,64](mul(11,8)undo()?mul(8,5))`;
const testAnswer1 = 161;
const testAnswer2 = 48;

const input = readFileSync("input-day-3.txt", "utf-8");

function question1(input) {
  const regex = /mul\(([0-9][0-9]?[0-9]?),([0-9][0-9]?[0-9]?)\)/gm;

  let sum = 0;
  input.match(regex).forEach((s) => {
    const [_, s1, s2] = s.match(
      /mul\(([0-9][0-9]?[0-9]?),([0-9][0-9]?[0-9]?)\)/,
    );
    const n1 = Number(s1);
    const n2 = Number(s2);
    sum += n1 * n2;
  });
  return sum;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  return question1(
    input
      .split("do()")
      .map((s) => s.split("don't")[0])
      .join(""),
  );
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
