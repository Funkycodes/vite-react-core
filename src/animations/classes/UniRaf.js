import AutoBind from "../utils/bind";

let instance = null;
export default class UniRaf {
  constructor () {
    if (instance) return instance;
    AutoBind(this);
    this.callbacks = [];
    this.now = performance.now();
    instance = this;
    requestAnimationFrame(this.update);
  }

  add(callback) {
    this.callbacks.push(callback);
    return () => this.remove(callback);
  }

  remove(callback) {
    this.callbacks.filter(cb => cb !== callback);
  }

  update(now) {
    const delta = (now - this.now) / 1000; // I think better in seconds
    this.now = now;
    this.callbacks.forEach(cb => cb(delta, now / 1000)); // Again I think better in seconds
    requestAnimationFrame(this.update);
  }
}