import Page from "../classes/Page";

export default class Home extends Page {
  constructor() {
    super({
      selector: ".home",
      selectors: {
        wrapper: ".home__wrapper",
      },
      classes: {
        active: "home--active",
      },
    });
  }
  show() {
    this.element.classList.add(this.classes.active);
    return super.show();
  }
  hide() {
    this.element.classList.remove(this.classes.active);
    return super.hide();
  }
}
