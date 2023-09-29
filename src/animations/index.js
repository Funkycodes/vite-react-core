import { ScrollTrigger } from "@/utils/gsap";

import Home from "./pages/Home";
import AutoBind from "./utils/bind";
import ScrollManager from "./classes/ScrollManager";
import { delay } from "./utils/math";

export default class App {
  constructor ({ page }) {
    AutoBind(this);
    this.pageTitle = page;
    this.init();
  }
  init() {
    this.createPage();
    delay(1500).then(this.createScrollManager);
  }

  createPage() {
    this.pages = {
      "home": new Home(),
    };
    this.page = this.pages[ this.pageTitle ];
    this.page.create();
  }

  createScrollManager() {
    this.scrollManager = new ScrollManager({});
    // this.scrollManager.on("scroll", ScrollTrigger.update);
  }
  onMove(e) {
    if (this.cursor) this.cursor.onMove(e);
  }

  addEvents() {
    window.addEventListener("mousemove", this.onMove, { passive: true });
    window.addEventListener("popstate", this.onPopstate, { passive: true });
  }
  reset() {
    window.removeEventListener("mousemove", this.onMove, { passive: true });
    window.removeEventListener("popstate", this.onPopstate, { passive: true });
    this.page.reset();
    console.log("page reset");
  }
}