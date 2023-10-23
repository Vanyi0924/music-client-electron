import { Api } from "@music/common";
import { PLAYLIST } from "@/config/constants";
import { nextSongIndex, PlayModel, SwitchSongDirection } from "@/utils";
import { defineStore } from "pinia";
// import { Songlist } from "@music/common/types/typings";

interface AppState {
  loginRegisterModalVisible: boolean;
}

export const useAccountStore = defineStore("account", {
  state: (): AppState => {
    return {
      loginRegisterModalVisible: false,
    };
  },
  getters: {},
  actions: {},
});
