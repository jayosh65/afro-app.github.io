import * as firebase from 'firebase'
import 'firebase/firestore'
import { GeoFirestore } from 'geofirestore'
import utility from '@/helpers/osutility.js'

export default {
  state: {
    located: [],
    thislocated: [],
    userlocation: null
  }, 
  mutations: {
    saveThisLocation (state, payload) {
      state.thislocated = payload
    },
    saveLocations (state, payload) {
      state.located = payload
    },
    saveSearchUserLocation (state, payload) {
      state.userlocation = payload
    },
  },
  actions: {
    searchLocation({commit, dispatch}, payload) {
      // Create a Firebase reference where GeoFirestore will store its information
      const db = firebase.firestore();
      const collectionRef = db.collection('geofiredata')

      // Create a GeoFirestore index
      const geoFirestore = new GeoFirestore(collectionRef)

      const userAddress = {
        address: payload.address,
        location: payload.location
      }
      sessionStorage.removeItem('restaurantAddress')
      sessionStorage.setItem('restaurantAddress', JSON.stringify(userAddress)) 

      const geoQuery = geoFirestore.query({
        center: payload.location,
        radius: 20,
      })

      var locatedResults = []

      geoQuery.on('key_entered', function (key, document, distance) {
        locatedResults.push({key, distance})
      }) 

      geoQuery.on('ready', () => {
        if (locatedResults.length > 0) {
          const locatedkey = locatedResults.map(a => db.collection('restaurant').doc(a.key).get())
          let restaurant

          Promise.all(locatedkey).then(function (querySnapshot) {
            // sessionStorage.clear()
            sessionStorage.removeItem('restaurant')
            querySnapshot.forEach(function (doc) {
              if (doc.data().approve === true) {
                let data = doc.data()
                data.id = doc.id
                data.distanceFromCenter = utility.filterByKey(doc.id, locatedResults)

                // Store result
                if (sessionStorage.restaurant)
                {
                  restaurant = JSON.parse(sessionStorage.getItem('restaurant'))
                } else {
                  restaurant = []
                }
                restaurant.push(data)
                sessionStorage.setItem('restaurant', JSON.stringify(restaurant))
              }
            })
            dispatch('loadSearchResult')
          })
          .catch((err) => {
            commit('setError', err)
          })
        }
      })      
    },
    loadSearchResult({commit}) {
      const restaurantAddress = sessionStorage.getItem('restaurantAddress')
      const restaurant = JSON.parse(sessionStorage.getItem('restaurant'))

      if(restaurant) {
        restaurant.sort(function (a, b) {
          return a.distanceFromCenter - b.distanceFromCenter
        })
      }
      commit('saveLocations', restaurant)
      commit('saveSearchUserLocation', restaurantAddress)
    },
    getThisLocation ({commit}, payload) {
      const db = firebase.firestore();
      var docRef = db.collection('restaurant').doc(payload);

      docRef.get().then(function(doc) {
        commit('saveThisLocation', doc.data())
      }).catch(function(error) {
        commit('setError', error)
      });
    },
    getFeaturedRestaurant({commit}, payload) {
      const db = firebase.firestore()
      console.log('This is lit')
      console.log(payload)
      db.collection("restaurant").where("feature", "==", true)
        .get()
        .then(function(querySnapshot) {
          const alldata = []
          querySnapshot.forEach(function(doc) {
            if (doc.data().approve === true) {
              let data = doc.data()
              data.id = doc.id
              alldata.push(data)
            }
          });
          commit('saveThisLocation', alldata)
        })
      .catch(function(error) {
        commit('setError', error)
      })     
    },
  },
  getters: {
    loadThisRestaurantResult (state) {
      return state.thislocated
    }, 
    loadAllRestaurantResult (state) {
      return state.located
    }, 
    loadUserLocationResult (state) {
      return state.userlocation
    }, 
  } 
}