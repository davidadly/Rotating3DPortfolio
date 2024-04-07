import { APP } from "./app.module.js";
import store from "./store.js";

window.addEventListener("resize", setHeight);
function setHeight() {
  const maxHeight = window.innerHeight;
  document.documentElement.style.setProperty("--max-height", `${maxHeight}px`);
}

setHeight();

APP(store, true);
