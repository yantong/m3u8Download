const state = {
  mainWindowId: "",
  downloadWindowId: "",
};

const mutations = {
  SET_MAIN_WINDOW_ID(state, mainWindowId) {
    state.mainWindowId = mainWindowId;
  },
  SET_DOWNLOAD_WINDOW_ID(state, downloadWindowId) {
    state.downloadWindowId = downloadWindowId;
  },
};

const actions = {
  setMainWindowId({ commit }, mainWindowId) {
    commit("SET_MAIN_WINDOW_ID", mainWindowId);
  },
  setDownloadWindowId({ commit }, downloadWindowId) {
    commit("SET_DOWNLOAD_WINDOW_ID", downloadWindowId);
  },
};

export default {
  state,
  mutations,
  actions,
};
