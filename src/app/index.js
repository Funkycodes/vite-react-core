import Home from "./pages/Home";
import AutoBind from "auto-bind";
import { delay } from "./utils/math";
import Cursor from "./components/Cursor";
import Preloader from "./components/Preloader";
import Transition from "./components/Transition";

import "../styles/style.scss";
import "splitting/dist/splitting.css";

class App {
  constructor () {
    AutoBind(this);
    this.init();
  }
  init() {
    this.createPages();
    this.createLenis();
    this.createComponents();

    this.addEvents();
    this.addLinkListeners();
    this.update();
  }

  async createPages() {
    this.pages = {
      "/": new Home(),
    };
    this.url = window.location.pathname;
    this.page = this.pages[ this.url ];
  }
  async createComponents() {
    this.cursor = new Cursor();
    this.transition = new Transition();
    this.preloader = new Preloader();
    this.onPreloaded();

  }

  async onChange({ push = true, url = null }) {
    url = url.replace(window.location.origin, "");

    if (this.isFetching || this.url === url) return;

    this.isFetching = true;
    this.url = url;

    await delay(1500);
    await this.page.hide();

    if (push) {
      window.history.pushState({}, document.title, url);
    }

    this.page = this.pages[ url ];

    await delay(1500);
    this.page.show();

    this.isFetching = false;
  }

  onPreloaded() {
    this.preloader.once("completed", () => {
      delay(1200).then(() => this.page.show());
    });
  }

  onPopstate() {
    this.onChange({
      url: window.location.pathname,
      push: false,
    });
  }

  onMove(e) {
    if (this.cursor) this.cursor.onMove(e);
  }

  addLinkListeners() {
    document.querySelectorAll("a").forEach((link) => {
      const isLocal = link.href.includes(window.location.origin);
      if (isLocal) {
        link.onclick = (e) => {
          e.preventDefault();
          this.transition.animate();
          this.onChange({
            url: link.href,
          });
        };
      } else if (!link.href.includes("mailto") && !link.href.includes("tel")) {
        link.rel = "noopener";
        link.target = "_blank";
      }
      link.onmouseenter = () => {
        this.cursor.onMouseEnter();
      };
      link.onmouseleave = () => {
        this.cursor.onMouseLeave();
      };
    });
  }

  addEvents() {
    window.addEventListener("mousemove", this.onMove, { passive: true });
    window.addEventListener("popstate", this.onPopstate, { passive: true });
  }

  update() {
    this.cursor.update();
    requestAnimationFrame(this.update);
  }
}

new App();
setTimeout(() => {
  console.log("%c I tried my best. Love❤️. Habib Carter Olorunfemi theMaskedOtaku. Bye ", "background-color:grey; color:white; font-family: 'Segoe UI'");
}, 10000);