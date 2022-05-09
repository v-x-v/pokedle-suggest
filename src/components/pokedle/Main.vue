<template>
  <v-container id="main-panel">
    <v-row>
      <v-col id="history" cols="6" class="mb-0 pb-0">
        <v-card class="mx-auto mt-4 pt-md-0 mb-0">
          <v-container fill-height fluid class="pt-0">
            <v-toolbar flat color="transparent">
              <v-toolbar-title class="text-body-1">入力履歴</v-toolbar-title>
              <v-spacer />
              <v-btn color="secondary" @click="reset()">Reset</v-btn>
            </v-toolbar>
            <v-row>
              <v-col
                v-for="i in 2"
                :key="'col-' + i"
                cols="6"
                class="bordered pb-0"
              >
                <v-row
                  v-for="j in 6"
                  :key="'row-' + i + '-' + j"
                  dense
                  no-gutters
                  class="mx-1 py-0 flex-nowrap"
                >
                  <v-col
                    v-for="k in 5"
                    :key="'cell-' + i + '-' + j + '-' + k"
                    class="pa-0 d-flex align-center"
                  >
                    <v-responsive :aspect-ratio="1 / 1">
                      <v-card
                        outlined
                        :class="
                          'bordered font-weight-bold text-body-1 history__card ' +
                          displayColor(i - 1, j - 1, k - 1)
                        "
                        @click="changeColor(i - 1, j - 1, k - 1)"
                      >
                        <v-sheet
                          class="history__cell"
                          v-text="displayText(i - 1, j - 1, k - 1)"
                          color="transparent"
                        />
                      </v-card>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col id="suggestion" cols="3" class="pb-0">
        <v-card class="mx-auto mt-4 mb-6">
          <v-toolbar dense flat color="transparent">
            <v-toolbar-title class="text-body-1">
              予測リスト
              <v-spacer></v-spacer>
            </v-toolbar-title>
          </v-toolbar>
          <v-data-table
            dense
            :items-per-page="6"
            sort-by="score"
            :sort-desc="true"
            :headers="suggestHeaders"
            :items="suggestList"
            item-key="name"
            disable-items-per-page
          />
        </v-card>
      </v-col>
      <v-col cols="3" class="pb-0">
        <v-card class="mx-auto mt-4 mb-6">
          <v-toolbar dense flat color="transparent">
            <v-toolbar-title class="text-body-1">
              単語分布
              <v-spacer></v-spacer>
            </v-toolbar-title>
          </v-toolbar>
          <v-data-table
            dense
            :items-per-page="6"
            sort-by="count"
            :sort-desc="true"
            :headers="wordHeaders"
            :items="charList"
          />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
import { LetterColor, LetterCount, PokeJson } from "@/types/pokedle";

@Component
export default class PokedleMain extends Vue {
  suggestHeaders = [
    { text: "Name", value: "name" },
    { text: "Score", value: "score" },
  ];
  wordHeaders = [
    { text: "Charactor", value: "char" },
    { text: "Count", value: "count" },
  ];
  /**
   * 入力済み文字列リスト
   */
  get registeredList(): LetterColor[][] {
    return this.$store.state.app.registeredList;
  }
  /**
   * 推測リスト
   */
  get suggestList(): PokeJson[] {
    return this.$store.state.app.suggestList;
  }
  get charList(): LetterCount[] {
    return this.$store.state.app.charList;
  }
  /**
   * 入力中文字列
   */
  get typingLetters(): Record<string, unknown>[] {
    return this.$store.state.keyboard.typingLetters;
  }
  created() {
    this.$store.dispatch("app/initNameList");
  }
  changeColor(col: number, row: number, cell: number) {
    if (this.registeredList[col * 5 + row] !== undefined) {
      return;
    } else {
      if (this.registeredList.length === col * 5 + row) {
        if (this.typingLetters[cell]) {
          store.commit("keyboard/changeColor", cell);
        }
      }
    }
    return;
  }
  displayColor(col: number, row: number, cell: number) {
    const addr = col * 5 + row;
    if (this.registeredList.length > addr) {
      // 入力済みのものがあれば優先的に表示
      if (this.registeredList[addr].length > cell) {
        return this.registeredList[addr][cell].color === ""
          ? "grey"
          : this.registeredList[addr][cell].color;
      }
    } else {
      // 入力中のものは入力済みの後に表示
      if (this.registeredList.length === addr) {
        if (this.typingLetters[cell]) {
          return this.typingLetters[cell].color;
        } else {
          return "";
        }
      }
    }
    return "";
  }
  /**
   * 表示文字を取得する
   * @param col 列番号（0始まり）
   * @param row 行番号（0始まり）
   * @param cell 行内番地（0始まり）
   * @returns 入力済み or 入力中文字
   */
  displayText(col: number, row: number, cell: number) {
    const addr = col * 5 + row;
    if (this.registeredList.length > addr) {
      if (this.registeredList[addr].length > cell) {
        return this.registeredList[addr][cell].letter;
      }
    } else {
      if (this.registeredList.length === addr) {
        if (this.typingLetters[cell]) {
          return this.typingLetters[cell].letter;
        } else {
          return "　";
        }
      }
    }
    return "　";
  }
  reset(): void {
    this.$store.dispatch("app/initNameList");
  }
}
</script>
<style scoped lang="scss">
#main-panel {
  #history {
    .history__card {
      width: 90%;
      height: 90%;
    }
    .history__cell {
      font-weight: 700;
      font-size: large;
      text-align: center;
      position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translateY(-50%) translateX(-50%);
    }
    .bordered {
      border: solid 2px rgba(0, 0, 0, 0.12);
    }
  }
}
</style>
