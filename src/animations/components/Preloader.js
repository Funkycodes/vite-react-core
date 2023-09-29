import gsap from "gsap";
import Component from "../classes/Component";

export default class Preloader extends Component {
  constructor () {
    super({
      element: ".preloader",
      elements: {
        wrapper: ".preloader__inner",
        progress: ".preloader__progress"
      },
    });
  }

  createLoader() {
    // this.media.forEach((medium) => {
    //   const image = new Image();
    //   image.crossOrigin = "anonymous";
    //   image.src = medium.getAttribute("data-src");
    //   image.onload = (_) => {
    //     medium.setAttribute("src", image.src);
    //     medium.removeAttribute("data-src");
    //   };
    // });

    // this.addEvents();
    for (let index = 0; index < 100; index++) {
      setTimeout(this.onAssetLoaded, 50 * index);
    }
  }

  onAssetLoaded() {
    this.length += 1;
    let percent = this.length / 100;

    // const wrapperWidth = this.elements.wrapper.offsetWidth;
    // const buttonWidth = this.elements.button.offsetWidth;
    // const width = wrapperWidth - buttonWidth - 48;
    // const translateX = width * percent;

    this.elements.progress.textContent = `${Math.round(percent * 100)}%`;

    if (percent === 1)
      setTimeout(() => {
        this.onLoaded();
      }, 1000);
  }

  onLoaded() {
    this.emit("completed");
    this.animateOut();
  }

  // addEvents() {
  //   this.elements.button.addEventListener("click", this.onLoaded);
  // }
  animateOut() {
    const timeline =
      gsap.timeline({ paused: true })
        .set(this.element, {
          bottom: "unset",
          transformOrigin: "left top"
        }).to(this.element, {
          y: "-100%",
          duration: 1.5,
          ease: "expo.inOut",
          onComplete: this.destroy
        }).restart();
  }
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}