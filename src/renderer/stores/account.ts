import { Api } from "@/http";
import { PLAYLIST, USER } from "@/config/constants";
import {
  enhanceJSONParse,
  nextSongIndex,
  PlayModel,
  SwitchSongDirection,
} from "@/utils";
import { defineStore } from "pinia";
// import { Songlist } from "@music/common/types/typings";

interface User {
  email: string;
  token: string;
}

interface AppState {
  loginRegisterModal: {
    visible: boolean;
    isLogin: boolean;
  };
  user?: User;
}

export const useAccountStore = defineStore("account", {
  state: (): AppState => {
    const user = enhanceJSONParse(window.localStorage.getItem(USER));

    return {
      loginRegisterModal: {
        visible: false,
        isLogin: false,
      },
      user,
    };
  },
  getters: {
    isLogin: (state) => Boolean(state.user),
  },
  actions: {
    setUser(user: User | undefined) {
      this.user = user;
      window.localStorage.setItem(USER, JSON.stringify(user));
    },
    removeUser() {
      this.setUser(undefined);
    },
  },
});
