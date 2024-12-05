import assert from "assert";
import { readFileSync } from "fs";

console.log("day-5.js");

const testInput = `47|53
97|13
97|61
97|47
75|29
61|13
75|53
29|13
97|29
53|29
61|53
97|53
61|29
47|13
75|47
97|75
47|61
75|61
47|29
75|13
53|13

75,47,61,53,29
97,61,53,29,13
75,29,13
75,97,47,61,53
61,13,29
97,13,75,29,47`;
const testAnswer1 = 143;
const testAnswer2 = 123;

const input = readFileSync("input-day-5.txt", "utf-8");

function parse(input) {
  let [rules, updates] = input.replaceAll("\r", "").split("\n\n");
  rules = rules.split("\n").map((rule) => {
    return rule.split("|").map(Number);
  });
  updates = updates.split("\n").map((update) => {
    return update.split(",").map(Number);
  });
  return { rules, updates };
}

function isRightOrder(update, rules) {
  let isRight = true;
  rules.forEach((rule) => {
    const i1 = update.findIndex((v) => v === rule[0]);
    const i2 = update.findIndex((v) => v === rule[1]);
    const rulesApply = i1 >= 0 && i2 >= 0;
    if (rulesApply && i1 > i2) {
      isRight = false;
    }
  });
  return isRight;
}
function getMiddleValue(update) {
  const centerIndex = (update.length - 1) / 2;
  return update[centerIndex];
}

function question1(input) {
  const { rules, updates } = parse(input);

  let count = 0;
  updates.forEach((update) => {
    if (isRightOrder(update, rules)) {
      count += getMiddleValue(update);
    }
  });

  return count;
}

assert.strictEqual(question1(testInput), testAnswer1);

console.log("Answer question 1:", question1(input));

function fixOrder(update, rules) {
  rules.forEach((rule) => {
    const i1 = update.findIndex((v) => v === rule[0]);
    const i2 = update.findIndex((v) => v === rule[1]);
    const rulesApply = i1 >= 0 && i2 >= 0;
    if (rulesApply && i1 > i2) {
      update = [
        ...update.slice(0, i2),
        ...update.slice(i2 + 1, i1 + 1),
        rule[1],
        ...update.slice(i1 + 1),
      ];
    }
  });
  return update;
}
function question2(input) {
  const { rules, updates } = parse(input);

  let count = 0;
  updates.forEach((update) => {
    if (!isRightOrder(update, rules)) {
      while (!isRightOrder(update, rules)) {
        update = fixOrder(update, rules);
      }
      update = fixOrder(update, rules);
      count += getMiddleValue(update);
    }
  });
  return count;
}

assert.strictEqual(question2(testInput), testAnswer2);

console.log("Answer question 2:", question2(input));
