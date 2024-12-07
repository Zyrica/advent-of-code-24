import assert from "assert";
import { readFileSync } from "fs";

const day = 7;

console.log(`day-${day}.js`);

const testInput = `190: 10 19
3267: 81 40 27
83: 17 5
156: 15 6
7290: 6 8 6 15
161011: 16 10 13
192: 17 8 14
21037: 9 7 18 13
292: 11 6 16 20`;
const testAnswer1 = 3749;
const testAnswer2 = 11387;

const input = readFileSync(`input-day-${day}.txt`, "utf-8");

function parse(input) {
  const rows = input
    .replaceAll("\r", "")
    .split("\n")
    .map((row) => {
      let [result, values] = row.split(": ");
      result = Number(result);
      values = values.split(" ").map(Number);
      return {
        result,
        values,
      };
    });
  return rows;
}

function isSolvable(result, values, operators) {
  const possibleEquations = [];
  const combinations = Math.pow(operators.length, values.length - 1);
  for (let i = 0; i < combinations; i++) {
    possibleEquations.push(
      i.toString(operators.length).padStart(values.length - 1, "0"),
    );
  }

  for (let equation of possibleEquations) {
    let s = values[0];
    for (let i = 1; i < values.length; i++) {
      const op = operators[equation[i - 1]];
      if (op === "*") {
        s *= values[i];
      } else if (op === "+") {
        s += values[i];
      } else if (op === "||") {
        s = Number("" + s + values[i]);
      }
    }
    if (s === result) {
      return true;
    }
  }
  return false;
}

function question1(input) {
  const equations = parse(input);

  let sum = 0;
  equations.forEach(({ result, values }) => {
    if (isSolvable(result, values, ["*", "+"])) {
      sum += result;
    }
  });
  return sum;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function question2(input) {
  const equations = parse(input);

  let sum = 0;
  equations.forEach(({ result, values }) => {
    if (isSolvable(result, values, ["*", "+", "||"])) {
      sum += result;
    }
  });
  return sum;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
