const state = {
  downloadUrl: "",
};

const mutations = {
  SET_DOWNLOAD_URL(state, downloadUrl) {
    state.downloadUrl = downloadUrl;
  },
};

const actions = {
  setDownloadUrl({ commit }, downloadUrl) {
    commit("SET_DOWNLOAD_URL", downloadUrl);
  },
};

export default {
  state,
  mutations,
  actions,
};
