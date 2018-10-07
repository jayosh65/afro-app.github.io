import * as firebase from 'firebase'
import 'firebase/firestore'
import guid from '@/helpers/uidgenerator.js'

export default {
  state: {
    allRestaurants: [],
    userMails: [],
    savedMail: sessionStorage.getItem('userMail'),
    socialSettings: []
  }, 
  mutations: {
    saveAllRestaurants (state, payload) {
      state.allRestaurants = payload
    },
    saveUserMails (state, payload) {
      state.userMails = payload
    },
    saveSocialSetting (state, payload) {
      state.socialSettings = payload
    }
  },
  actions: {
    getAllRestaurants ({commit}) {
      const db = firebase.firestore();
      db.collection("restaurant")
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
              let data = doc.data()
              data.id = doc.id
              // doc.data() is never undefined for query doc snapshots
              // console.log(doc.id, " => ", doc.data())
              alldata.push(data)
          })
          alldata.sort(function (a, b) {
            return b.timecreated - a.timecreated
          })
          commit('saveAllRestaurants', alldata)
      })
      .catch(function(error) {
        commit('setError',  error)
      })
    },
    restaurantApproval ({commit, dispatch}, payload) {
      // console.log(payload)
      const db = firebase.firestore();
      db.collection("restaurant").doc(payload.id)
      .update({
        approve: payload.approve
      })
      .then(function() {
          // console.log("Document successfully updated!");
          dispatch('getAllRestaurants')
      })
      .catch(function(error) {
          // The document probably doesn't exist.
        commit('setError',  error)
      });      
    },
    restaurantFeature ({commit, dispatch}, payload) {
      // console.log(payload)
      const db = firebase.firestore();
      db.collection("restaurant").doc(payload.id)
      .update({
        feature: payload.feature
      })
      .then(function() {
          // console.log("Document successfully updated!");
          dispatch('getAllRestaurants')
      })
      .catch(function(error) {
          // The document probably doesn't exist.
        commit('setError',  error)
      });      
    },
    deleteCarouselImage({commit, dispatch}, payload) {
      const userId = firebase.auth().currentUser.uid
      var storageRef = firebase.storage().ref()

      var imageRef = storageRef.child(payload.path)

      imageRef.delete().then(function () {
        // console.log('Image deleted')
      }).catch(function (error) {
        commit('setError',  error)
      })

      const db = firebase.firestore();
      db.collection('carouselImages').doc(payload.id).delete().then(function () {
        // console.log('Document successfully deleted!')
      }).catch(function (error) {
        commit('setError',  error)
      })
      dispatch('loadCarouselImage', userId)
    },   
    deleteBackgroundImage({commit, dispatch}, payload) {
      const userId = firebase.auth().currentUser.uid
      var storageRef = firebase.storage().ref()

      var imageRef = storageRef.child(payload.path)

      imageRef.delete().then(function () {
        // console.log('Image deleted')
      }).catch(function (error) {
        commit('setError',  error)
      })

      const db = firebase.firestore();
      db.collection('backgroundImages').doc(payload.id).delete().then(function () {
        // console.log('Document successfully deleted!')
      }).catch(function (error) {
        commit('setError',  error)
      })
      dispatch('loadPageImage', userId)
    },
    loadCarouselImage({commit}) {
      const db = firebase.firestore();
      db.collection("carouselImages")
      .get()
      .then(function(querySnapshot) {
        const alldata = []
        querySnapshot.forEach(function(doc) {
          let data = doc.data()
          data.id = doc.id
          alldata.push(data)
        })
        commit('saveAllCarouselImages', alldata)
      })
      .catch(function(error) {
        commit('setError', error)
      })        
    },
    loadPageImage({commit}) {
      const db = firebase.firestore();
      db.collection("backgroundImages")
      .get()
      .then(function(querySnapshot) {
        const alldata = []
        querySnapshot.forEach(function(doc) {
          let data = doc.data()
          data.id = doc.id
          alldata.push(data)
        })
        commit('saveAllCarouselImages', alldata)
      })
      .catch(function(error) {
        commit('setError', error)
      })        
    },
    sendMessageToMember ({commit, dispatch}, payload) {
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid
      let data = payload
      data.sender = userId
      data.timesent = firebase.firestore.FieldValue.serverTimestamp()
      // Add a new document with a generated id.
      db.collection("internalMail").add(data)
      .then(function(docRef) {
        dispatch('getSpecificMails')
        commit('setSuccess', docRef.id)
      })
      .catch(function(error) {
        commit('setError',  error)
      })
    },
    getAllMail({commit}) {
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid
      db.collection("internalMail").where("recipient", "==", userId)
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            let data = doc.data()
            data.id = doc.id
            alldata.push(data)
          })
          // console.log(alldata)
          commit('saveUserMails', alldata)
      })
      .catch(function(error) {
        commit('setError',  error)
      })     
    },
    getAdminMail({commit}) {
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid
      db.collection("internalMail").where("recipient", "==", userId)
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            let data = doc.data()
            data.id = doc.id
            alldata.push(data)
          })
          alldata.sort(function (a, b) {
            return b.timesent - a.timesent
          })
          commit('saveUserMails', alldata)
      })
      .catch(function(error) {
        commit('setError',  error)
      })     
    },
    getSpecificMails({commit}) {
      const db = firebase.firestore()
      const userId = firebase.auth().currentUser.uid
      db.collection("internalMail").where("recipient", "==", userId).where("sender", "==", userId)
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            let data = doc.data()
            data.id = doc.id
            alldata.push(data)
          })
          sessionStorage.setItem('userMail', JSON.stringify(alldata))
          commit('saveUserMails', alldata)
      })
      .catch(function(error) {
        commit('setError',  error)
      })     
    },
    mailSeen({commit, dispatch}, payload) {
      const db = firebase.firestore()
      const locatedkey = payload.map(
        a => db.collection('internalMail').doc(a)
        .update({
          seen: true
        })
      )
      Promise.all(locatedkey).then(function () {
        dispatch('getSpecificMails')
      })
      .catch(function(error) {
        // The document probably doesn't exist.
        commit('setError', error)
      })
    },
    addCarouselImage({commit, dispatch}, payload){
      const uid = guid.generator()
      const imagename = `carouselImages/${uid}.${payload.type}`

      const db = firebase.firestore()
      // Create a root reference
      var storageRef = firebase.storage().ref()
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(imagename).put(payload.content, payload.metaData)

      // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // switch (snapshot.state) {
            //   case firebase.storage.TaskState.PAUSED: // or 'paused'
            //     console.log('Upload is paused')
            //     break
            //   case firebase.storage.TaskState.RUNNING: // or 'running'
            //     console.log('Upload is running')
            //     break
            // }
          }, function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break

                case 'storage/canceled':
                  // User canceled the upload
                  break

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break
              }
            }, function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                const path = downloadURL
                db.collection('carouselImages').add({
                  'pathname': imagename,
                  'title': payload.title,
                  'path': path,
                  timecreated: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                  dispatch('loadCarouselImage')
                })
                .catch(function(error) {
                  commit('setError', error)
                });
              })
            });
    },
    addPageBackgroundImage({commit, dispatch}, payload){
      const uid = guid.generator()
      const imagename = `backgroundImages/${uid}.${payload.type}`

      const db = firebase.firestore()
      // Create a root reference
      var storageRef = firebase.storage().ref()
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(imagename).put(payload.content, payload.metaData)

      // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            // switch (snapshot.state) {
            //   case firebase.storage.TaskState.PAUSED: // or 'paused'
            //     console.log('Upload is paused')
            //     break
            //   case firebase.storage.TaskState.RUNNING: // or 'running'
            //     console.log('Upload is running')
            //     break
            // }
          }, function (error) {
            // A full list of error codes is available at
            // https://firebase.google.com/docs/storage/web/handle-errors
              switch (error.code) {
                case 'storage/unauthorized':
                  // User doesn't have permission to access the object
                  break

                case 'storage/canceled':
                  // User canceled the upload
                  break

                case 'storage/unknown':
                  // Unknown error occurred, inspect error.serverResponse
                  break
              }
            }, function () {
              // Upload completed successfully, now we can get the download URL
              uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
                const path = downloadURL
                db.collection('backgroundImages').add({
                  'pathname': imagename,
                  'category': payload.category,
                  'path': path,
                  timecreated: firebase.firestore.FieldValue.serverTimestamp()
                }).then(function() {
                  dispatch('loadPageImage')
                })
                .catch(function(error) {
                  commit('setError', error)
                });
              })
            });
    },
    addSocial({commit, dispatch}, payload){
      const db = firebase.firestore();
      let data = payload
      data.timecreated = firebase.firestore.FieldValue.serverTimestamp()
      // Add a new document with a generated id.
      db.collection("settings").add(data)
      .then(function (docRef) {
        dispatch('loadSocial')
        // console.log("Document written with ID: ", docRef.id);
      })
      .catch(function (error) {
        commit('setError',  error)
      })
    }, 
    loadSocial({commit}) {
      const db = firebase.firestore();
      db.collection("settings")
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            let data = doc.data()
            data.id = doc.id
            alldata.push(data)
          })
          alldata.sort(function (a, b) {
            return b.timesent - a.timesent
          })
          commit('saveSocialSetting', alldata)
      })
      .catch(function(error) {
        commit('setError',  error)
      })     
    },
    deleteSocial({commit, dispatch}, payload) {
      const db = firebase.firestore();
      db.collection('settings').doc(payload).delete().then(function () {
        dispatch('loadSocial')
      }).catch(function (error) {
        commit('setError',  error)
      })
    },   
  },
  getters: {
    loadAllRestaurants (state) {
      return state.allRestaurants
    }, 
    loadAllMails (state) {
      return state.userMails
    },
    loadSavedMails (state) {
      return state.savedMail
    },
    loadSocialSettings (state) {
      return state.socialSettings
    }   
  }      
}