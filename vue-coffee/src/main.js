import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { autoAnimatePlugin } from "@formkit/auto-animate/vue";
import "./assets/main.css";
import App from "./App.vue";

import Home from "./Pages/Home.vue";
import Favorites from "./Pages/Favorites.vue";

const app = createApp(App);

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/favorites", name: "Favorites", component: Favorites },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

app.use(autoAnimatePlugin);
app.use(router);

app.mount("#app");
