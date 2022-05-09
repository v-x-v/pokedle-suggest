import Vue from "vue";
import Vuex from "vuex";
import { Module, ActionContext } from "vuex";

Vue.use(Vuex);

/** 通常モードのキー配列 */
const LETTERS_NORMAL = [
  ["ア", "カ", "サ", "タ", "ナ", "ハ", "マ", "ヤ", "ラ", "ワ"],
  ["イ", "キ", "シ", "チ", "ニ", "ヒ", "ミ", "", "リ", ""],
  ["ウ", "ク", "ス", "ツ", "ヌ", "フ", "ム", "ユ", "ル", "ン"],
  ["エ", "ケ", "セ", "テ", "ネ", "ヘ", "メ", "", "レ", ""],
  ["オ", "コ", "ソ", "ト", "ノ", "ホ", "モ", "ヨ", "ロ", "ー"],
];
/** その他モードのキー配列 */
const LETTERS_EXTRA = [
  ["ァ", "ガ", "ザ", "ダ", "", "バ", "パ", "ャ", "", "♀"],
  ["ィ", "ギ", "ジ", "ヂ", "", "ビ", "ピ", "", "", "♂"],
  ["ゥ", "グ", "ズ", "ヅ", "ッ", "ブ", "プ", "ュ", "", ""],
  ["ェ", "ゲ", "ゼ", "デ", "", "ベ", "ペ", "", "", "２"],
  ["ォ", "ゴ", "ゾ", "ド", "", "ボ", "ポ", "ョ", "", "Ｚ"],
];

const COLOR_LIST = ["", "amber", "green"];

interface KeyboardState {
  /** キーボードの表示モード（通常50音/その他） */
  mode: string;
  /** 表示中のキーボード表示文字リスト */
  letters: string[][];
  /** 入力中文字列 */
  typingLetters: Record<string, string>[];
}

class KeyboardModule implements Module<KeyboardState, any> {
  namespaced = true;
  state = {
    mode: "normal", // デフォルトは通常モード
    letters: LETTERS_NORMAL,
    typingLetters: [],
  };
  actions = {
    /**
     * キーボードの表示モード変更
     * @param context
     * @param mode 変更後モード名 (normal or extra)
     */
    updateMode(context: ActionContext<KeyboardState, any>, mode: string) {
      context.commit("setMode", mode);
      context.commit("switchLetters");
    },
  };
  mutations = {
    /**
     * 入力中文字列に押されたキー文字を追加する
     * @param state
     * @param charactor 押されたキー
     */
    push(state: KeyboardState, charactor: string) {
      state.typingLetters.push({
        letter: charactor,
        color: "",
      });
    },
    /**
     * 入力中文字列から1文字削除する（バックスペース）
     * @param state
     */
    pop(state: KeyboardState) {
      state.typingLetters.pop();
    },
    /**
     * 入力中文字列をすべて削除する
     * @param state
     */
    clear(state: KeyboardState) {
      state.typingLetters.splice(0);
    },
    setMode(state: KeyboardState, mode: string) {
      state.mode = mode;
    },
    switchLetters(state: KeyboardState) {
      state.letters =
        state.mode == "normal"
          ? LETTERS_NORMAL
          : state.mode == "extra"
          ? LETTERS_EXTRA
          : [];
    },
    changeColor(state: KeyboardState, index: number) {
      if (state.typingLetters[index]) {
        const now = COLOR_LIST.indexOf(state.typingLetters[index].color);
        state.typingLetters[index].color =
          COLOR_LIST[(now + 1) % COLOR_LIST.length];
      }
    },
  };
}

const keyboardModule = new KeyboardModule();
export default keyboardModule;
