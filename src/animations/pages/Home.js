import Page from "../classes/Page";

export default class Home extends Page {
  constructor () {
    super({
      selector: "[data-animation='home']",
      selectors: {},
    });
  }
  show() {
    super.show();
  }
  reset() {
    console.log("riddim");
  }
}
