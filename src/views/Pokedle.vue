<template>
  <div class="home">
    <PokedleMain />
    <Keyboard />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Main from "@/components/pokedle/Main.vue";
import Keyboard from "@/components/pokedle/Keyboard.vue";

@Component({
  components: {
    PokedleMain: Main,
    Keyboard,
  },
})
export default class HomeView extends Vue {}
</script>
