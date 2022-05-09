import { RouteConfig } from "vue-router";
import HomeView from "../views/HomeView.vue";
import PokedleView from "../views/Pokedle.vue";

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: { icon: "mdi-home", title: "home" },
  },
  {
    path: "/pokedle",
    name: "pokedle suggest",
    component: PokedleView,
    meta: { icon: "mdi-chart-line", title: "pokedle suggest" },
  },
];

export default routes;
