import * as firebase from 'firebase'
import 'firebase/firestore'
import guid from '@/helpers/uidgenerator.js'

export default {
  state: {
    memberRegistrationForm: null,
    contactForm: null,
  },
  mutations: {
    setRegistrationForm (state, payload) {
      state.memberRegistrationForm = payload
    },
    setContactForm (state, payload) {
      state.contactForm = payload
    }      
  },
  actions: {
    sendRegistrationForm({commit}, payload){
      const db = firebase.firestore();
      let data = payload
      data.approval = false
      data.timecreated = firebase.firestore.FieldValue.serverTimestamp()
      // Add a new document with a generated id.
      db.collection("joinforms").add(data)
      .then(function(docRef) {
        // console.log(docRef)
        commit('setLoading', docRef)
      })
      .catch(function(error) {
        // console.log(error)
        commit('setError', error)
      })
    },
    deleteRegistrationForm({commit, dispatch}, payload){
      // console.log(payload)
      const db = firebase.firestore();
      db.collection("joinforms").doc(payload.id).delete().then(function() {
        // console.log("Document successfully deleted!");
        dispatch('getAllRegistrationRequest');
      }).catch(function (error) {
          // console.error("Error removing document: ", error);
      });
    },
    registrationUser({commit, dispatch}, payload){
      const uid = guid.generator()
      // console.log(payload);
      const db = firebase.firestore();
      const promise = firebase.auth().createUserWithEmailAndPassword(payload.email, uid)
      // promise.then(function(user) {
      //   // Send verificaton email
      //   firebase.auth().currentUser.sendEmailVerification()
      //   db.collection("users").doc(user.user.uid)
      //   .set({
      //     role: "member",
      //     timecreated: firebase.firestore.FieldValue.serverTimestamp() 
      //   })
      //   .then(function() {
      //     user.updateProfile({
      //       displayName: 'Jay Osh',
      //     });

      //       console.log("Document successfully written!");
      //   })
      //   .catch(function(error) {
      //       console.error("Error writing document: ", error);
      //   });

      promise.then(function () {
        const user = firebase.auth().currentUser;
        user.sendEmailVerification();

        db.collection("users").doc(user.uid)
        .set({
            role: "member",
            timecreated: firebase.firestore.FieldValue.serverTimestamp() 
        })
      })
      .then(function () {
                // user.updateProfile({
                //     displayName: 'Jay Osh',
                // });
                // console.log('email sent');
                // dispatch('updateRegistration', payload.id)
                // console.log(user.user)
      })
      .catch(function(error) {

      });
            // console.log('Validation link was sent to ' + email + '.', 7000);

         // console.log('email sent');
      //   dispatch('updateRegistration', payload.id)
      //   console.log(user.user)
      // }, function(error) {
      //   console.log(error)
      //   // An error happened.
      //   //   var errorCode = error.code;
      //   //   var errorMessage = error.message;
      // })    
    },
    updateRegistration ({commit, dispatch}, payload) {

      const db = firebase.firestore();
      db.collection("joinforms").doc(payload)
      .update({
        approval: true
      })
      .then(function() {
          dispatch('getAllRegistrationRequest');
      })
      .catch(function(error) {
          // The document probably doesn't exist.
      });      
    },    
    getAllRegistrationRequest({commit}){
      const db = firebase.firestore();
      db.collection("joinforms")
      .get()
      .then(function(querySnapshot) {
        const alldata = []
        querySnapshot.forEach(function(doc) {
          let data = doc.data()
          data.id = doc.id
          alldata.push(data)
        })
        commit('setRegistrationForm', alldata)
      })
      .catch(function(error) {
      })  
    },     
    sendContactForm({commit}, payload){
      const db = firebase.firestore();
      let data = payload
      data.timecreated = firebase.firestore.FieldValue.serverTimestamp()
      // Add a new document with a generated id.
      db.collection("contactforms").add(data)
      .then(function(docRef) {
        // console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        // console.error("Error adding document: ", error);
      })
    },
    sendSubscriberForm({commit}, payload){
      const db = firebase.firestore();
      let data = payload
      data.timecreated = firebase.firestore.FieldValue.serverTimestamp()
      // Add a new document with a generated id.
      db.collection("subscribers").add(data)
      .then(function(docRef) {
        // console.log(docRef)
        commit('setLoading', docRef)
        // console.log("Document written with ID: ", docRef.id);
      })
      .catch(function(error) {
        commit('setError',  error)
      })
    },       
  },
  getters: {
    loadAllRegistrationRequest (state) {
      return state.memberRegistrationForm
    },
  }
}
