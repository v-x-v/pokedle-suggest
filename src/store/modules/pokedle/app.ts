import Vue from "vue";
import Vuex from "vuex";
import { Store, Module, ActionContext } from "vuex";

Vue.use(Vuex);

interface AppState {
  /** 入力済み文字列リスト */
  registeredList: Record<string, string>[][];
}

class AppModule implements Module<AppState, any> {
  namespaced = true;
  state = {
    registeredList: [],
  };
  actions = {};
  mutations = {
    /**
     * 入力中文字列を入力済み文字列リストに追加する
     * @param state
     * @param letter 入力中文字列(1文字ずつ分割されたリスト)
     */
    register(state: AppState, letter: Record<string, string>[]) {
      // 入力中配列をコピーしてから追加
      const item = letter.slice();
      state.registeredList.push(item);
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
