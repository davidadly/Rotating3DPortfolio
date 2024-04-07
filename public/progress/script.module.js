import { APP } from "/scripts/app.module.js";

fetch("./store.json")
  .then((res) => res.json())
  .then((store) => APP(store, false));
