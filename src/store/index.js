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
      policiaURI : 'http://localhost:5000/delicuente/antecedentes/',
      antecedentes: {},
    },
    mutations: {
      SetAntecedentes(state, payload){
        state.antecedentes = payload.antecedentes
      }
    },
    getters: {
      policiaURI: (state) => {
        return state.policiaURI
      },
      antecedentes: (state) => {
        return state.antecedentes
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEV
  })

  return Store
}
