import Vue from "vue";
import Vuex, { Store } from "vuex";
import app from "./modules/pokedle/app";
import keyboard from "./modules/pokedle/keyboard";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: { app, keyboard },
});
