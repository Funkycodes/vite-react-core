import Page from "../classes/Page";

export default class Home extends Page {
  constructor () {
    super({
      selector: ".about",
      selectors: {
        wrapper: ".about__wrapper",
      }
    });
  }

  create() {
    super.create();
  }

  show() {
    super.show();
  }
  reset() {
    super.hide();
  }
}
