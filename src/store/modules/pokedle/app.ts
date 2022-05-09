import Vue from "vue";
import Vuex from "vuex";
import { Module, ActionContext } from "vuex";
import listJSON from "@/assets/json/daipa_list.json";
import listFullJSON from "@/assets/json/daipa_list_full.json";

Vue.use(Vuex);

interface AppState {
  /** 入力済み文字列リスト */
  registeredList: Record<string, string>[][];
  /** 全対象ポケモン名リスト（5文字以下含む） */
  fullNameList: string[];
  /** 現在の推測結果 */
  suggestList: Record<string, any>[];
  /** 現在の単語分布 */
  charList: Record<string, any>[];
  /** 緑文字、位置リスト */
  greenList: Record<string, any>[];
  /** 黄色文字、位置リスト */
  yellowList: Record<string, any>[];
  /** 灰色文字リスト */
  greyList: string[];
}

class AppModule implements Module<AppState, any> {
  namespaced = true;
  state = {
    registeredList: [],
    fullNameList: [],
    suggestList: [],
    charList: [],
    greenList: [],
    yellowList: [],
    greyList: [],
  };
  getters = {
    isValidName:
      (state: AppState) => (typingLetters: Record<string, string>[]) => {
        if (typingLetters.length <= 0) {
          return false;
        }
        const target = typingLetters.map((item) => item.letter).join("");
        return state.fullNameList.includes(target);
      },
  };
  actions = {
    /**
     * ポケモン名JSONを読み込み、配列を初期化する
     * @param context
     */
    initNameList(context: ActionContext<AppState, any>) {
      context.state.greenList = [];
      context.state.yellowList = [];
      context.state.greyList = [];
      context.state.registeredList = [];
      context.state.suggestList = listJSON.slice();
      context.state.fullNameList = listFullJSON.map((item) => item.name);
      context.commit("analysisWord");
      context.commit("scoringSuggest");
    },
    /**
     * 入力中文字列を入力済み文字列リストに追加する
     * @param state
     * @param letter 入力中文字列(1文字ずつ分割されたリスト)
     */
    register(
      context: ActionContext<AppState, any>,
      letter: Record<string, string>[]
    ) {
      // 入力中配列をコピーしてから追加
      const item = letter.slice();
      context.state.registeredList.push(item);
      context.commit("updateList", context.state);
      context.commit("suggest", context.state);
      context.commit("scoringSuggest", context.state);
    },
  };
  mutations = {
    /**
     * 推測結果をスコアリングする
     * @param state
     */
    scoringSuggest(state: AppState) {
      state.suggestList.forEach((suggest) => {
        let score = 0;
        // 同一文字でダブルカウントしないように重複削除
        const uniqueSuggestList = Array.from(
          new Set((suggest.name as string).split(""))
        );
        uniqueSuggestList.forEach((c) => {
          const char = state.charList.find((item) => item.char === c);
          if (char === undefined) return;
          score += char.count;
        });
        suggest["score"] = score;
      });
      return;
    },
    /**
     * 緑、黄色、灰色文字リストの更新
     * @param state
     */
    updateList(state: AppState) {
      const tmpList: string[] = [];
      // 緑、黄色、灰色ごとの文字を抽出
      state.registeredList.forEach((row) => {
        row.forEach((cell, index) => {
          if (cell.color === "amber") {
            // 黄色処理：既に緑(位置確定)している文字の場合、黄色は無視する
            if (
              state.greenList.find((item) => {
                item.letter === cell.index;
              }) === undefined
            ) {
              state.yellowList.push({ letter: cell.letter, index: index });
            }
          } else if (cell.color === "green") {
            // 緑処理
            state.greenList.push({ letter: cell.letter, index: index });
          } else {
            tmpList.push(cell.letter);
          }
        });
      });
      // 灰色処理（緑リストに入っていた場合は追加しない）
      tmpList.forEach((letter) => {
        if (
          state.greenList.findIndex((item) => item.letter === letter) === -1
        ) {
          state.greyList.push(letter);
        }
      });
    },
    /**
     * 現在の候補に含まれる文字を数え上げる
     * @param state
     */
    analysisWord(state: AppState) {
      const tmpList: Record<string, any>[] = [];
      state.suggestList.map((suggestItem) => {
        suggestItem.name.split("").forEach((c: string) => {
          let index = tmpList.findIndex((tempItem) => tempItem.char === c);
          if (index === -1) {
            tmpList.push({ char: c, count: 0 });
            index = tmpList.findIndex((tempItem) => tempItem.char === c);
          }
          tmpList[index].count++;
        });
      });
      state.charList = tmpList.slice();
    },
    /**
     * 入力から、条件に当てはまるポケモンリストを抽出する
     * @param state
     */
    suggest(state: AppState) {
      // 各文字から、対象ポケモンを抽出
      let tmpList = state.suggestList.slice();
      // 灰色リストの文字を含まないポケモン名のみ抽出
      state.greyList.forEach((letter) => {
        tmpList = tmpList.filter((item) => {
          return item.name.indexOf(letter) === -1;
        });
      });
      // 緑リストの文字・位置が一致するポケモン名のみ抽出
      state.greenList.forEach((row) => {
        tmpList = tmpList.filter((item) => {
          return item.name.indexOf(row.letter) === row.index;
        });
      });
      // 黄色リストの文字を含み、位置違いのポケモン名のみ抽出
      state.yellowList.forEach((row) => {
        tmpList = tmpList.filter((item) => {
          return (
            item.name.charAt(row.index) !== row.letter &&
            item.name.indexOf(row.letter) !== -1
          );
        });
      });
      state.suggestList = tmpList.slice();
    },
    /**
     * 入力済み文字列リストをすべて削除する
     * @param state
     */
    clear(state: AppState) {
      state.registeredList.splice(0);
    },
  };
}

const appModule = new AppModule();
export default appModule;
