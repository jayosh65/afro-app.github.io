import * as firebase from 'firebase'

export default {
  state: {
    user: null,
    firstLogin: null,
    loading: false,
    IsuserLoggedIn: sessionStorage.getItem('refreshToken'),
    userExist: null,
    userProfile: null
  },
  mutations: {
    setUser (state, payload) {
      state.user = payload
    },
    checkIfFirstLogin (state, payload) {
      state.firstLogin = payload
    },
    idNameExist (state, payload) {
      state.userExist = payload
    },
    userProfile (state, payload) {
      state.userProfile = payload
    }
  },
  actions: {
    signUserIn ({commit}, payload) {
      const db = firebase.firestore()
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            const firstTime = {
              IsfirstTime: user.additionalUserInfo.isNewUser
            }
            const docRef = db.collection("users").doc(user.user.uid)
            docRef.get().then(function (doc) {
              if (doc.exists) {
                let data = doc.data()
                data.token = user.user.refreshToken
                sessionStorage.setItem('refreshToken', JSON.stringify(data))
              } 
            }).catch(function(error) {
              commit('setError', error)
            });    
            commit('checkIfFirstLogin', firstTime)
          }
        ) 
        .catch(
          error => {
            commit('setError', error)
          }
        )
    },
    signUserOut ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null) 
      commit('checkIfFirstLogin', null) 
      sessionStorage.removeItem('refreshToken')        
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {id: payload.uid, email: payload.email})  
    },
    requestEamilReset({commit}, payload) {
      var auth = firebase.auth()
      var emailAddress = payload.email
      
      auth.sendPasswordResetEmail(emailAddress).then(function() {
        commit('setSuccess', 'Please check your email to reset password.')
      }).catch(function(error) {
        commit('setError', error)
      });
    },
    updatePassword ({commit}, payload) {
      var user = firebase.auth().currentUser;
      // console.log(payload)
      user.updatePassword(payload).then(function() {
        commit('setSuccess', payload)
      }).catch(function(error) {
        commit('setError', error)
      });      
    }
  },
  getters: {
    user (state) {
      return state.user
    },
    firstLogin (state) {
      return state.firstLogin
    },
    userLoggedIn (state) {
      return state.IsuserLoggedIn
    },
    doesUserExist (state) {
      return state.userExist
    },
    loadUserProfile (state) {
      return state.userProfile
    }
  }
}
