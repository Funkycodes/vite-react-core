export const lerp = (a, b, n) => a + (b - a) * n;

export const clamp = (min, max, value) => Math.min(max, Math.max(value, min));

export const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const random = (min, max) => Math.random() * (max - min) + min;

export const toArray = (nodelist) => Array.from(nodelist);

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