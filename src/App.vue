<template>
  <v-app id="inspire">
    <v-navigation-drawer app permanent :mini-variant="isHiddenMenu">
      <v-sheet color="grey lighten-4" class="d-flex align-center pa-4">
        <v-icon @click="switchMenu">mdi-menu</v-icon>
      </v-sheet>

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="menuItem in menuItems"
          :key="menuItem.path"
          :link="currentURL === menuItem.path ? false : true"
          :href="currentURL === menuItem.path ? '' : baseURL + menuItem.path"
          class="pl-0"
          :style="
            currentURL === menuItem.path ? 'background-color: #E3F2FD;' : ''
          "
        >
          <v-list-item-icon>
            <v-icon
              v-if="menuItem.meta !== undefined"
              v-text="menuItem.meta.icon"
            ></v-icon>
          </v-list-item-icon>
          <v-list-item-action-text
            v-text="menuItem.name"
            class="text-body-2"
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
import routes from "@/router/routes";
import { RouteConfig } from "vue-router";

@Component
export default class App extends Vue {
  isHiddenMenu = false;

  get baseURL(): string {
    return process.env.BASE_URL.slice(0, -1);
  }
  get currentURL(): string {
    return this.$route.path;
  }
  get menuItems(): Array<RouteConfig> {
    return routes;
  }
  switchMenu(): void {
    this.isHiddenMenu = !this.isHiddenMenu;
  }
  mounted() {
    document.title = this.$route.meta?.title;
  }
}
</script>
