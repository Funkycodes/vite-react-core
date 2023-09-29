import gsap from "gsap";
import Splitting from "splitting";
import Animation from "../classes/Animation"

export default class Title extends Animation {
  constructor({
    element,
    elements
  }) {
    super({ element, elements });
    this.splitText()
    this.elementLineSpans = this.element.querySelectorAll("span");
    this.animateOut()
  }
  splitText() {
    Splitting({ target: this.element, by: "lines" })
  }
  animateIn() {
    this.elementLineSpans.forEach(line => {
      const lineIndex = line.style.getPropertyValue("--line-index");
      gsap.timeline()
        .set(this.element, { autoAlpha: 1, overflow: "hidden" })
        .fromTo(line, {
          y: "-100%"
        }, {
          y: 0,
          duration: 1.2,
          ease: "expo.out"
        })
    })
  }
  animateOut() {
    gsap.set(this.element, { autoAlpha: 0 })
  }
}