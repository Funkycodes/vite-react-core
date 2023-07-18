import gsap from "gsap"
import Component from "../classes/Component";

export default class Transition extends Component {
  constructor() {
    super({
      element: ".transition",
      elements: {}
    })
  }

  animate() {
    gsap
      .timeline({ defaults: { ease: "expo.inOut", duration: 1.5 } })
      .set(this.element, {
        top: "unset",
        transformOrigin: "center bottom",
        bottom: 0
      }).to(this.element, {
        scaleY: 1
      }).set(this.element, {
        transformOrigin: "center top",
        top: 0,
        bottom: "unset"
      }).to(this.element, {
        scaleY: 0
      })
  }
}