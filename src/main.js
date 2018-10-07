import '@babel/polyfill'
import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import * as firebase from 'firebase'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyAw7Kt4ue-VB3_jVAJPwDW6UrLibzHIcTs',
      authDomain: 'mysite-197011.firebaseapp.com',
      databaseURL: 'https://mysite-197011.firebaseio.com',
      projectId: 'mysite-197011',
      storageBucket: 'mysite-197011.appspot.com',
      messagingSenderId: '224283391874'
    })

    const firestore = firebase.firestore()

    firestore.settings({
      timestampsInSnapshots: true
    })

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
      }
    })      
  }
}).$mount('#app')
