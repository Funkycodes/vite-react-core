/**
 * @param {number} a - current, lower bound
 * @param {number} b - target, upper bound
 * @param {number} n - percentage
 * @returns 
 */
export const lerp = (a, b, n) => a * (1 - n) + b * n;

/**
 * @description clamps value within a defined range, returning the lower bound if the value is below the lower bound and the upper bound if value is above the upper bound.
 * @param {number} min - lower bound
 * @param {number} max - upper bound
 * @param {number} value - number to clamp 
 */
export const clamp = (min, max, value) => Math.min(max, Math.max(value, min));

/**
 * @description delays code for a certified amount of time
 * @param {number} ms - time in milliseconds
 */
export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const random = (min, max) => Math.random() * (max - min) + min;

/**
 * @description an easy to remember wrapper around the `from` method of the Array interface, nothing special really
 * @param {ArrayLike} iterable
 */
export const toArray = (iterable) => Array.from(iterable);

export const mapRange = (in_min, in_max, input, out_min, out_max) => {
  return ((input - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
};

export const normalize = (in_min, in_max, value) => mapRange(in_min, in_max, value, 0, 1);

/**
 * @param {number[]} array - Number array
 * @param {number} target - target
 * @returns closest number
 */
export function closestNumber(array, target) {
  return array.reduce((prev, curr) => {
    return Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev;
  });
}

/**
 * @description returns an array of numbers between `start` and `end` with step as the diferrence between consecutive values, `end` exclusive. E.g range(5) returns [0, 1, 2, 3, 4], range(0, 6, 2) returns [0, 2, 4]
 * 
 * @param {number} start 
 * @param {number} end
 * @param {number} step
 * 
 * @returns {number[]}
 */

export const range = (start, end, step = 1) => {
  let output = [];
  start = end === void 0 ? (end = start, 0) : start;
  for (let i = start; i < end; i += step)
    output.push(i);
  return output;
};