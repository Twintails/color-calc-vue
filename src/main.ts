import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import Footer from "./Footer.vue";

createApp(App).mount("#app");
createApp(Footer).mount(
  document.body.querySelector("footer") ||
    document.body.appendChild(document.createElement("footer")),
);
