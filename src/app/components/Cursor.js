import AutoBind from "auto-bind";
import { lerp, clamp } from "../utils/math";

export default class Cursor {
  constructor(selector = ".cursor") {
    AutoBind(this);
    this.selector = selector;
    this.mouse = {
      tx: {
        current: 0,
        target: 0,
      },
      ty: {
        current: 0,
        target: 0,
      },
      ease: 0.15,
    };

    this.scale = { current: 1, target: 1, ease: 0.1 };
    this.opacity = { current: 1, target: 1, ease: 0.18 };

    this.init();
  }
  init() {
    this.element = document.querySelector(this.selector);
    this.bounds = this.element.getBoundingClientRect();
  }

  transform() {
    this.element.style.transform = `translate(${this.mouse.tx.current}px, ${this.mouse.ty.current}px) scale(${this.scale.current})`;
    this.element.style.opacity = this.opacity.current;
  }
  onMove(e) {
    this.mouse.tx.target = e.clientX - this.bounds.width / 2;
    this.mouse.ty.target = e.clientY - this.bounds.height / 2;

    requestAnimationFrame(this.update);
  }
  onMouseEnter() {
    this.scale.target = 2.5;
    this.opacity.target = 0.7;
  }
  onMouseLeave() {
    this.scale.target = 1;
    this.opacity.target = 1;
  }
  update() {
    this.scale.current = lerp(
      this.scale.current,
      this.scale.target,
      this.scale.ease
    );
    this.opacity.current = lerp(
      this.opacity.current,
      this.opacity.target,
      this.opacity.ease
    );
    this.mouse.tx.current = lerp(
      this.mouse.tx.current,
      this.mouse.tx.target,
      this.mouse.ease
    );
    this.mouse.ty.current = lerp(
      this.mouse.ty.current,
      this.mouse.ty.target,
      this.mouse.ease
    );
    this.transform();
  }
}
