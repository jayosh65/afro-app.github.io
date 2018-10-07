import * as firebase from 'firebase'

export default {
  state: {
    error: null,
    loading: '',
    success: '',
  },
  mutations: {
    setError (state, payload) {
      state.error = payload
    },
    setLoading (state, payload) {
      state.loading = payload
    },
    setSuccess (state, payload) {
      state.success = payload
    }      
  },
  actions: {

  },
  getters: {
    error (state) {
      return state.error
    },
    loading (state) {
      return state.loading
    },
    success (state) {
      return state.success
    }   
  }
}
