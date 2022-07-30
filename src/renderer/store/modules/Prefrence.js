const state = {
  downloadPath: "",
};

const mutations = {
  SET_DOWNLOAD_PATH(state, downloadPath) {
    state.downloadPath = downloadPath;
  },
};

const actions = {
  setDownloadPath({ commit }, downloadPath) {
    commit("SET_DOWNLOAD_PATH", downloadPath);
  },
};

export default {
  state,
  mutations,
  actions,
};
