<template>
  <v-app id="inspire">
    <v-navigation-drawer app>
      <v-sheet color="grey lighten-4" class="pa-4">
        <v-avatar class="mb-4" color="grey darken-1" size="64">TODO</v-avatar>
        <div>v-x-v tools</div>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="menuItem in menuItems"
          :key="menuItem.path"
          :link="currentURL === menuItem.path ? false : true"
          :href="currentURL === menuItem.path ? '' : baseURL + menuItem.path"
          :color="currentURL === menuItem.path ? 'grey darken-2' : ''"
        >
          <v-list-item-icon>
            <v-icon v-text="menuItem.meta.icon"></v-icon>
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
import { Component, Vue, Watch } from "vue-property-decorator";
import store from "./store";
import routes from "@/router/routes";

@Component
export default class App extends Vue {
  get baseURL(): string {
    return process.env.BASE_URL.slice(0, -1);
  }
  get currentURL(): string {
    return this.$route.path;
  }
  get menuItems(): Record<string, any>[] {
    return routes;
  }
  click() {
    store.commit("app/switchDrawer");
  }
  mounted() {
    document.title = this.$route.meta?.title;
  }
  @Watch("$route")
  changeTitle() {
    document.title = this.$route.meta?.title;
  }
}
</script>
