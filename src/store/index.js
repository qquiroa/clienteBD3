import Vue from 'vue'
import Vuex from 'vuex'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    modules: {
      // example
    },
    state: {
      policiaURL : 'http://34.69.177.195:5000',
      bancoURL: 'http://34.72.22.112:5000',
      renapURL: 'http://6ca8656e563a.ngrok.io',
      antecedentes: {},
    },
    mutations: {
      SetAntecedentes(state, payload){
        state.antecedentes = payload.antecedentes
      },
    },
    getters: {
      policiaURL: (state) => {
        return state.policiaURL
      },
      bancoURL: (state) => {
        return state.bancoURL
      },
      renapURL: (state) => {
        return state.renapURL
      },
      antecedentes: (state) => {
        return state.antecedentes
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
