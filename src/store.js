import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sceneIndex: 0,
  },
  mutations: {
    updateSceneIndex (state, index){
      state.sceneIndex = index;
    },
  },
  actions: {
  },
  strict: true
});
