import { map } from "lodash";
import AutoBind from "auto-bind";
import Title from "../animations/Title";
import Paragraph from "../animations/Paragraph";

export default class Page {
  constructor({ selector, selectors, classes }) {
    AutoBind(this);
    this.selector = selector;
    this.selectorChildren = { ...selectors, animatedTitles: "[data-animation='title']", animatedParagraphs: "[data-animation='paragraph']" };
    this.classes = { ...classes };

    this.create();
  }

  create() {
    if (this.selector instanceof HTMLElement) {
      this.element = this.selector;
    } else {
      this.element = document.querySelector(this.selector);
    }

    this.elements = {};
    for (let [key, value] of Object.entries(this.selectorChildren)) {
      if (
        value instanceof HTMLElement ||
        value instanceof NodeList ||
        Array.isArray(value)
      ) {
        this.elements[key] = value;
      } else {
        this.elements[key] = this.element.querySelectorAll(value);

        if (this.elements[key].length === 1) { this.elements[key] = this.element.querySelector(value); }
        else if (this.elements[key].length === 0) {
          this.elements[key] = null;
        }
      }
    }
  }

  createAnimations() {
    if (this.elements.animatedTitles instanceof HTMLElement)
      this.animatedTitles = new Title({
        element: this.elements.animatedTitles
      })
    else
      this.animatedTitles = map(this.elements.animatedTitles, element => new Title({ element }))

    if (this.elements.animatedParagraphs instanceof HTMLElement) {
      this.animatedParagraphs = new Paragraph({ element: this.element.animatedParagraphs })
    }
    else
      this.animatedParagraphs = map(this.elements.animatedParagraphs, element => new Paragraph({ element }))
  }

  show() {
    this.createAnimations()
    return Promise.resolve();
  }

  hide() {
    return Promise.resolve();
  }
}