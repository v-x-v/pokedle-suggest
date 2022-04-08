<template>
  <v-app id="inspire">
    <v-navigation-drawer app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64">TODO</v-avatar>
        <div>Pokedle Suggest</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="menuItem in menuItems"
          :key="menuItem.link"
          link
          :href="menuItem.link"
        >
          <v-list-item-icon>
            <v-icon v-text="menuItem.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-action-text
            v-text="menuItem.name"
          ></v-list-item-action-text>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "./store";
@Component
export default class App extends Vue {
  get menuItems() {
    return [
      { icon: "mdi-star", link: "/", name: "home" },
      { icon: "mdi-start", link: "/pokedle", name: "pokedle" },
    ];
  }
  click() {
    store.commit("app/switchDrawer");
  }
}
</script>
