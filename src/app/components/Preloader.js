import Animation from "../classes/Animation";
import gsap from "gsap";

export default class Preloader extends Animation {
  constructor() {
    super({
      element: ".preloader",
      elements: {
        wrapper: ".preloader__wrapper",
        text: ".preloader__text",
        progress: ".preloader__progress"
      },
    });

    this.length = 0;
    this.media = [...document.querySelectorAll("[data-src]")];
    this.animateIn();
    this.createLoader();
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
      setTimeout(this.onAssetLoaded, 50 * index)
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
        this.onLoaded()
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
    const timeline = gsap.timeline()
    timeline.set(this.element, {
      bottom: "unset",
      transformOrigin: "left top"
    });

    timeline.to(this.element, {
      y: "-100%",
      duration: 1.5,
      ease: "expo.inOut",
      onComplete: this.destroy
    })
  }

  animateIn() {
    gsap.to(this.element, { autoAlpha: 1 })
  }
  destroy() {
    this.element.parentNode.removeChild(this.element);
  }
}