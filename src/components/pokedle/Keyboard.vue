<template>
  <v-card id="keyboard" class="mx-auto mt-4 pt-md-4 mb-6">
    <v-container class="keyboard__tooltips">
      <v-row class="mx-1" no-gutters>
        <v-col class="pa-0">
          <v-btn-toggle mandatory dense borderless>
            <v-btn
              @click="updateMode('normal')"
              value="normal"
              class="keyboard__keyswitch"
              >通常</v-btn
            >
            <v-btn
              @click="updateMode('extra')"
              value="extra"
              class="keyboard__keyswitch"
              >゛゜小</v-btn
            >
          </v-btn-toggle>
        </v-col>
        <v-col>
          <v-spacer />
        </v-col>
        <v-col>
          <v-btn @click="backspace()" absolute right>
            <v-icon>mdi-backspace-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="keyboard__main">
      <div>{{ typingLetters.join("") }}</div>
      <v-row
        class="mx-1"
        v-for="(item, index_row) in letters"
        :key="index_row"
        no-gutters
      >
        <v-col
          class="pa-0"
          v-for="(letter, index_col) in item"
          :key="index_col"
        >
          <v-responsive :aspect-ratio="1">
            <v-btn
              x-small
              depressed
              v-if="letter !== ''"
              class="keyboard__keytop px-0 text-body-1"
              :value="letter"
              v-text="letter"
              v-on:click="typing(letter)"
            />
            <v-spacer v-else class="keyboard__keytop" />
          </v-responsive>
        </v-col>
      </v-row>
      <v-row justify="center" class="my-4 mx-md-6 mx-1">
        <v-spacer />
        <v-btn value="enter" depressed large @click="enter()">enter</v-btn>
        <v-spacer />
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";

@Component
export default class Keyboard extends Vue {
  /**
   * キーボードの表示モード（通常50音/その他）
   */
  get mode(): string {
    return this.$store.state.keyboard.mode;
  }
  /**
   * 表示中のキーボード表示文字リスト
   */
  get letters(): string[][] {
    return this.$store.state.keyboard.letters;
  }
  /**
   * 入力中文字列
   */
  get typingLetters(): string[] {
    return this.$store.state.keyboard.typingLetters;
  }
  /**
   * キーボードの表示モードを変更する
   * @param mode 更新後の表示モード
   */
  updateMode(mode: string) {
    store.dispatch("keyboard/updateMode", mode);
  }
  /**
   * 入力中の文字を追加する
   * @param charactor 押下されたキー
   */
  typing(charactor: string) {
    if (this.typingLetters.length <= 4) {
      store.commit("keyboard/push", charactor);
    }
  }
  /**
   * 入力中の文字を一文字削除する
   */
  backspace() {
    store.commit("keyboard/pop");
  }
  /**
   * 入力中の文字を入力済み文字列リストに登録する
   */
  enter() {
    if (this.typingLetters.length > 0) {
      store.commit("app/register", this.typingLetters);
      store.commit("keyboard/clear");
    }
  }
  created() {
    this.updateMode(this.mode);
  }
}
</script>
<style scoped lang="scss">
#keyboard {
  max-width: 500px;
  .keyboard__keyswitch {
    width: 4em;
    min-height: 0em;
  }
  .keyboard__keytop {
    width: 90%;
    height: 90%;
    font-weight: 700;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
