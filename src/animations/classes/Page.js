import AutoBind from "../utils/bind";

export default class Page {
  constructor ({ selector: element, selectors: elements }) {
    AutoBind(this);
    this.selector = element;
    this.selectorChildren = { ...elements };
  }

  create() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    this.elements = {};
    for (let [ key, value ] of Object.entries(this.selectorChildren)) {
      if (
        value instanceof HTMLElement ||
        value instanceof NodeList ||
        Array.isArray(value)
      ) {
        this.elements[ key ] = value;
      } else {
        this.elements[ key ] = this.element.querySelectorAll(value);

        if (this.elements[ key ].length === 1) { this.elements[ key ] = this.element.querySelector(value); }
        else if (this.elements[ key ].length === 0) {
          this.elements[ key ] = null;
        }
      }
    }
  }

  createAnimations() {
  }

  show() {
  }

  hide() {
  }
}