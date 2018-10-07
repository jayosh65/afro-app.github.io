import * as firebase from 'firebase'
import 'firebase/firestore'
import { GeoFirestore } from 'geofirestore'
import guid from '@/helpers/uidgenerator.js'

export default {
  state: {
    restaurants: [],
    images: [],
    carouselImages: []
  },
  mutations: {
    saveAllUserRestaurants (state, payload) {
      state.restaurants = payload
    },
    saveAllProfileImages (state, payload) {
      state.images = payload
    }, 
    saveAllCarouselImages (state, payload) {
      state.carouselImages = payload
    },   
  },
  actions: {
    fetchCarouselImage({commit}){
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
    addUserRestaurantGeolocation({commit, dispatch}, payload){
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid
      // Create a Firebase reference where GeoFirestore will store its information
      const collectionRef = db.collection('geofiredata')

      // Create a GeoFirestore index
      const geoFirestore = new GeoFirestore(collectionRef)
      const location = new firebase.firestore.GeoPoint(payload.latitude, payload.longitude)

      geoFirestore.set(payload.id, {coordinates: location}).then(() => {
        console.log('Provided key has been added to GeoFirestore');
        dispatch('fetchAllUsersRestaurants', userId)
      }, (error) => {
        console.log('Error: ' + error)
      });
    },      
    addUserRestaurant({commit, dispatch}, payload){
      let data = payload
      data.approve = "false"
      data.feature = "false"
      const db = firebase.firestore();

      db.collection('restaurant').add(data)         
      .then(function (docRef) {

        const data = {
          id: docRef.id,
          latitude: payload.address.latitude,
          longitude: payload.address.longitude  
        }

        dispatch('addUserRestaurantGeolocation', data)
        commit('success', 'success')
      }).catch(function(error) {
        commit('setError', error)
      })
    },
    deleteUserRestaurant({commit, dispatch}, payload){
      const db = firebase.firestore();
      const userId = firebase.auth().currentUser.uid
      db.collection('restaurant').doc(payload).delete().then(function() {
        dispatch('fetchAllUsersRestaurants', userId)
      }).catch(function(error) {
        console.error("Error removing document: ", error)
      }) 
      db.collection('geofiredata').doc(payload).delete().then(function() {
        console.log("Document successfully deleted!")
      }).catch(function(error) {
        console.error("Error removing document: ", error)
      })           
    },
    fetchAllUsersRestaurants ({commit}, payload) {
      const db = firebase.firestore();
      db.collection("restaurant").where("userid", "==", payload)
      .get()
      .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            let data = doc.data()
            data.id = doc.id
            alldata.push(data)
          })
          commit('saveAllUserRestaurants', alldata)
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error)
      })
      // db.collection("restaurant").where("userid", "==", payload)
      //   .onSnapshot(function(querySnapshot) {
      //   const alldata = []
      //   querySnapshot.forEach(function(doc) {
      //     let data = doc.data()
      //     data.id = doc.id
      //     alldata.push(data)
      //   });
      //   commit('saveAllUserRestaurants', alldata)
      // })
      // .catch(function(error) {
      //     console.log("Error getting documents: ", error)
      // })
    },
    addImage({commit}, payload){
      const userId = firebase.auth().currentUser.uid
      const uid = guid.generator()
      const imagename = `images/${userId}/${uid}.${payload.type}`

      const db = firebase.firestore()
      // Create a root reference
      var storageRef = firebase.storage().ref()
      // Upload file and metadata to the object 'images/mountains.jpg'
      var uploadTask = storageRef.child(imagename).put(payload.content, payload.metaData)

      // Listen for state changes, errors, and completion of the upload.
        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
          function (snapshot) {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            console.log('Upload is ' + progress + '% done')
            switch (snapshot.state) {
              case firebase.storage.TaskState.PAUSED: // or 'paused'
                console.log('Upload is paused')
                break
              case firebase.storage.TaskState.RUNNING: // or 'running'
                console.log('Upload is running')
                break
            }
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
                db.collection('image').add({
                  'userid': userId,
                  'pathname': imagename,
                  'category': payload.category,
                  'title': payload.title,
                  'description': payload.description,
                  'path': path,
                  timecreated: firebase.firestore.FieldValue.serverTimestamp()
                })
              })
            });
    },
    deleteUserImage({commit, dispatch}, payload) {
      const userId = firebase.auth().currentUser.uid
      var storageRef = firebase.storage().ref()
      // Create a reference to the file to delete
      var imageRef = storageRef.child(payload.path)
      // Delete the file
      imageRef.delete().then(function () {
        console.log('Image deleted')
      }).catch(function (error) {
      // Uh-oh, an error occurred!
        console.log(error)
      })

      const db = firebase.firestore();
      db.collection('image').doc(payload.id).delete().then(function () {
        console.log('Document successfully deleted!')
      }).catch(function (error) {
        console.error('Error removing document: ', error)
      })
      dispatch('loadImage', userId)
    },
    deleteRestaurantGalleryImage({commit, dispatch}, payload){
      const userId = firebase.auth().currentUser.uid
      const db = firebase.firestore()

      let imageId = {};
      imageId[`image.gallery.${payload.imageId}`] = firebase.firestore.FieldValue.delete()      

      db.collection('restaurant').doc(payload.restaurantId).update(
        imageId 
      )
      .then(function() {
        dispatch('loadImage', userId)
        console.log("Document successfully updated!");
      });      
    },      
    loadImage({commit}, payload) {
      const db = firebase.firestore();
      db.collection("image").where("userid", "==", payload)
      .get()
      .then(function(querySnapshot) {
        const alldata = []
        querySnapshot.forEach(function(doc) {
          let data = doc.data()
          data.id = doc.id
          alldata.push(data)
        })
        commit('saveAllProfileImages', alldata)
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error)
      })        
    },
    updateRestaurantGalleryImage({commit, dispatch}, payload) {
      const userId = firebase.auth().currentUser.uid
      const db = firebase.firestore()   

      db.collection('restaurant').doc(payload.restaurantId).update(
        {"gallery": payload.gallery}
      )
      .then(function() {
        dispatch('loadImage', userId)
        console.log("Document successfully updated!");
      }); 
    }
  },
  getters: {
    loadCarouselImages (state) {
      return state.carouselImages
    }, 
    loadRestaurants (state) {
      return state.restaurants
    },   
    loadProfileImage (state) {
      return state.images.filter((val) => { return val.category === 'profile'})
    },
    loadGalleryImage (state) {
      return state.images.filter((val) => { return val.category === 'gallery'})
    },
    loadMenuImage (state) {
      return state.images.filter((val) => { return val.category === 'menu'})
    }    
  }
}
