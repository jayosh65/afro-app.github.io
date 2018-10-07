<template>
  <v-app>
    <toolbar></toolbar>
      <v-content>
        <v-container fluid grid-list-md >
          <v-layout row wrap>
            <v-flex xs12 sm6 class="py-1">
              <div class="text-xs-left">
                <div id="location-search" class="elevation-2">
                  <gmap-autocomplete
                    @place_changed="setPlace">
                  </gmap-autocomplete>
                  <!-- <v-btn @click="searchCurrentLocation" icon>
                    <v-icon class="mb-1">my_location</v-icon>
                  </v-btn> -->
                </div>
              </div>
            </v-flex> 
            <v-flex xs12 sm2 hidden-xs-and-down class="py-0 text-xs-left">
              <v-btn large @click="searchButton" class=" deep-orange accent-4 white--text" style="margin-top: 4px;">Search</v-btn>
            </v-flex>           
            <v-spacer></v-spacer>
            <v-flex xs12 sm12 md4 lg3 v-if="showSwitch">
              <v-switch :label="switch1 === true ? 'Hide map' : 'Show map'" v-model="switch1" @change="showMap"></v-switch>
            </v-flex>             
          </v-layout>
          <v-layout row>
            <v-flex xs12 sm12 md4 lg3>
              <!-- <v-switch :label="switch1 === true ? 'Hide map' : 'Show map'" v-model="switch1" @change="showMap"></v-switch> -->
              <h5 class="headline text-sm-left text--black">{{ restaurantResult > 1 ? `${restaurantResult} restaurants found` : `${restaurantResult} restaurant found` }}</h5>
            </v-flex> 
          </v-layout>
          <v-layout row wrap>
            <v-flex xs12 :md6="switch1" d-flex>
              <v-container fluid grid-list-md px-0>
                <v-layout id="card-display" row wrap>
                  <v-flex
                    v-for="result in loadResult"
                    :key="result.id"
                    xs12
                    sm6
                    md4
                    lg3
                    invisbleDiv
                    :id="result.id"
                  >
                      <!-- <div :data-src="result.image.profile"></div> -->
                      <v-card  hover>
                        <router-link :to="{name: 'Restaurant', params: { id: result.id  }}" style="text-decoration: none;">
                          <v-img
                            :src="result.image.profile"
                            aspect-ratio="2.25"
                          ></v-img>
                        </router-link>
                        <v-card-text
                          style="position: relative;"
                        >
                          <v-btn
                            absolute
                            color="orange"
                            class="white--text"
                            fab
                            right
                            top
                            small
                            @click="dialogDirection = true, loadDirectionAddress(result.address)"
                          >
                            <v-icon>directions_car</v-icon>
                          </v-btn>
                          <h3 class="title font-weight-bold text-sm-left text-truncate">{{ result.name }}</h3>
                          <div class="font-weight-light body-2 text-sm-left text-truncate">{{ result.address.full }}</div>
                          <div class="text-sm-left font-weight-light"><span class="body-2 orange--text text-sm-left">{{ result.cuisinecountry }}</span> . <span class="body-2 grey--text">{{ result.distanceFromCenter|distanceformat }}</span></div>
                        </v-card-text>
                      </v-card>                
                  </v-flex>
                </v-layout>
                <v-layout row wrap>
                  <v-flex xs12 hidden-xs-and-down class="py-4 text-xs-center">
                    <v-btn 
                      large
                      class=" deep-orange accent-4 white--text" 
                      style="margin-top: 4px;"
                      v-if="showButton"
                      v-model="moreRestaurant"
                      @click="showMoreRestaurant"
                    >
                      Show more
                    </v-btn>
                  </v-flex> 
                </v-layout>
              </v-container>
            </v-flex> 
            <v-flex v-if="switch1" d-flex elevation-2 ml-3>
              <GmapMap
                :center="center"
                :zoom="12"
                map-type-id="terrain"
                style="width: 100%; height: 100%"
              >
                <gmap-info-window :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
                  <p class="subheading">{{ infoContent }}</p>
                  {{ addressContent }}
                </gmap-info-window>
                <GmapMarker
                  :key="index"
                  v-for="(m, index) in markers"
                  :position="m.position"
                  :clickable="true"
                  :draggable="true"
                  @click="center=m.position, toggleInfoWindow(m, index)"
                />
                <GmapMarker
                  v-if="this.position"
                  label="★"
                  :clickable="true"
                  :position="position"
                  @click="center=position"
                />
              </GmapMap>              
            </v-flex>
          </v-layout>
          <v-dialog v-model="dialogDirection" max-width="90vw" scrollable persistent>
            <driving-map :address="address"></driving-map>
            <v-fab-transition>
              <v-btn 
                fab
                small
                color="white"
                class="mt-5"
                top
                right
                absolute
                @click.native="dialogDirection = false"
              >
                <v-icon>close</v-icon>
              </v-btn>             
            </v-fab-transition>        
          </v-dialog>         
        </v-container>
      </v-content>  
    <app-footer></app-footer>
  </v-app>
</template>

<script>
  import Vue from 'vue'
  import Toolbar from '@/components/oscomponents/layout/Toolbar.vue'
  import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'
  import firebase from 'firebase'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import utility from '@/helpers/osutility.js'
  import DrivingMap from '@/components/oscomponents/component/DrivingMap.vue'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
      libraries: 'places' // necessary for places input
    }
  })

  export default {
  components: {
    Toolbar, AppFooter, DrivingMap
  },
  props: {             
    searchStyle: {
      type: String,
      default: 'location-search'
    }
  },
  data () {
    return {
      takeit: [],
      switch1: false,
      rowsPerPageItems: [4, 8, 12],
      pagination: {
        rowsPerPage: 4
      },
      center: {lat: 0, lng: 0},
      position: {lat: 0, lng: 0},
      infoContent: '',
      infoWindowPos: null,
      infoWinOpen: false,
      infoOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      }, 
      addressContent: '', 
      markers: [{
        position: {lat: 0, lng: 0}
      }],
      showButton: false,
      restaurantResult: 0,  
      loadResult: [],
      moreRestaurant: [],
      showSwitch: false,
      dialogDirection: false,
      address: ''
    }
  }, 
  created () {   
    const result = utility.chunkSlice(this.$store.getters.loadAllRestaurantResult, 2)
    this.loadResult = result[0]
    result.shift()
    this.moreRestaurant = result
    this.restaurantResult = this.$store.getters.loadAllRestaurantResult.length
  }, 
  computed: {
    loadSearchResults () {
      const result = utility.chunkSlice(this.$store.getters.loadAllRestaurantResult, 2)
      return result
    },
    showMapIf () {
      return this.loadResult
    }
  },
  watch: {
    loadSearchResults (value) {
      const result = value
      this.loadResult = result[0]
      this.restaurantResult = this.$store.getters.loadAllRestaurantResult.length 
      result.shift()
      this.moreRestaurant = result 
    },
    moreRestaurant (value) {
      if(value.length > 0) {
        this.showButton = true
      } else {
        this.showButton = false
      }
    },
    showMapIf (value) {
      const val = value || 0
      if(val.length > 0) {
        this.showSwitch = true
      } else{
        this.showSwitch = false
      }
    }    
  },
  methods: {
    setPlace (place) {
      this.currentPlace = place
    }, 
    searchButton () {
      const _this = this
      if (_this.currentPlace.geometry.location.lat() !== '' && this.currentPlace.geometry.location.lng() !== '') {
        const address = _this.currentPlace.address_components[0].long_name ? _this.currentPlace.address_components[0].long_name : 'Cannot locate address'
        const location = new firebase.firestore.GeoPoint(this.currentPlace.geometry.location.lat(), this.currentPlace.geometry.location.lng())
        const searchData = {
          address:  address,
          location: location
        }
        this.$store.dispatch("searchLocation", searchData)
      }
    },  
    showMap () {
      this.loadUserMap()
    },
    loadUserMap () {
      const currentposition = JSON.parse( this.$store.getters.loadUserLocationResult)
      this.center = {lat: Number(currentposition.location._lat), lng: Number(currentposition.location._long)}
      this.position = {lat: Number(currentposition.location._lat), lng: Number(currentposition.location._long)}

      let docData = this.$store.getters.loadAllRestaurantResult
      if (docData) {

        const markerResult = docData.map((obj) => {
            let markerResult = {
              position: {
                lat: Number(obj.address.latitude),
                lng: Number(obj.address.longitude)
              },
              infoText: obj.name,
              addressText: obj.address.full
            }
            return markerResult
          })
          this.markers = markerResult
        }
    }, 
    showMoreRestaurant () {
      const resultArray = this.moreRestaurant
      const popped = resultArray[0]
      this.loadResult.push(...popped)
      resultArray.shift()
      this.moreRestaurant = resultArray
    },
    loadDirectionAddress(value) {
      this.address = value
    }   
  },
  filters: {
    distanceformat: function (value) {
      if (!value) return ''
      value = parseFloat(value)
       return value.toFixed(1) + ' km'
    }
  } 
}
</script>

<style  scoped>
  #location-search {
    background: #ffffff;
    height: 44px;
    border-radius: 2px;
  }
  #location-search input{
    padding: 10px;
    width: 100%;
  }
</style>