import Component from "./Component";

export default class Animation extends Component {
  constructor ({ element, elements }) {
    super({
      element: element,
      elements: elements
    });
    this.createObserver();
  }

  createObserver() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) this.animateIn();
        else this.animateOut();
      });
    });

    this.observer.observe(this.element);
  }
  animateIn() {
    console.log(`Animating ${this.element} in`);
  }
  animateOut() { console.log(`Animating ${this.element} out`); }
}