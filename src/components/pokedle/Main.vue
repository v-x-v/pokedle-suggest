<template>
  <v-container id="main-panel">
    <v-row>
      <v-col id="history" cols="8">
        <v-card class="mx-auto mt-4 pt-md-0 mb-6">
          <v-container fill-height fluid>
            <v-row>
              <v-col v-for="i in 2" :key="'col-' + i" cols="6">
                <v-row v-for="j in 6" :key="'row-' + i + '-' + j" no-gutters>
                  <v-col
                    v-for="k in 5"
                    :key="'cell-' + i + '-' + j + '-' + k"
                    align-self="stretch"
                    class="mx-0 pa-1"
                  >
                    <v-responsive :aspect-ratio="1">
                      <v-card outlined class="history__card">
                        <v-card-text
                          class="history__cell px-auto"
                          v-text="displayText(i - 1, j - 1, k - 1)"
                        ></v-card-text>
                      </v-card>
                    </v-responsive>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </v-col>
      <v-col id="suggestion" cols="4">
        <v-card class="mx-auto mt-4 pt-md-4 mb-6"> </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import store from "@/store";
@Component
export default class PokedleMain extends Vue {
  list = [];
  /**
   * 入力済み文字列リスト
   */
  get registeredList(): string[][] {
    return this.$store.state.app.registeredList;
  }
  /**
   * 入力中文字列
   */
  get typingLetters(): string[] {
    return this.$store.state.keyboard.typingLetters;
  }
  /**
   * 表示文字を取得する
   * @param col 列番号（0始まり）
   * @param row 行番号（0始まり）
   * @param cell 行内番地（0始まり）
   * @returns 入力済み or 入力中文字
   */
  displayText(col: number, row: number, cell: number) {
    if (this.registeredList[col * 5 + row] !== undefined) {
      return this.registeredList[col * 5 + row][cell];
    } else {
      if (this.registeredList.length === col * 5 + row) {
        if (this.typingLetters[cell]) {
          return this.typingLetters[cell];
        } else {
          return "　";
        }
      }
    }
    return "　";
  }
}
</script>
<style scoped lang="scss">
#history {
  .history__card {
    width: 90%;
    height: 90%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .history__cell {
    font-weight: 700;
    font-size: large;
    position: absolute;
    text-align: center;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
