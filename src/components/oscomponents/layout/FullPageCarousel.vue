<template>
  <v-app> 
    <v-carousel
      :class="carouselStyle" 
      hide-delimiters 
      hide-controls
    >
      <v-carousel-item
        v-for="(item,i) in loadCarousel"
        :key="i"
        :src="item.path"
        reverse-transition="fade"
        transition="fade"
      ></v-carousel-item>
    </v-carousel>
    <v-container fluid :id="overlayStyle" :class="carouselStyle">
      <v-layout row wrap>
        <v-flex xs12 class="py-0">
          <h1 :id="titleStyle">{{ sitetitle }}</h1>
          <h2 :id="subtitleStyle" class="mb-3">{{ titlefirst }}<span :class="titlecolourStyle">{{ titlesecond }}</span> {{ titlethird }}</h2>          
        </v-flex>
      </v-layout>
      <v-container fluid>
        <v-layout row wrap justify-center>
          <v-flex xs12 sm12 md4 lg4 class="py-1">
            <div class="text-xs-left">
              <div id="location-search">
                <gmap-autocomplete
                  @place_changed="setPlace">
                </gmap-autocomplete>
                <!-- <v-btn @click="searchCurrentLocation" icon>
                  <v-icon class="mb-1">my_location</v-icon>
                </v-btn> -->
              </div>
            </div>
          </v-flex>
          <v-flex xs12 sm12 md1 lg1 hidden-md-and-down class="py-0 text-xs-left">
            <v-btn large @click="searchButton" class=" deep-orange accent-4 white--text" style="margin-top: 4px;"
              :loading="loading"
              :disabled="loading"
            >
              Search
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-flex>
          <v-flex xs12 sm12 md1 hidden-lg-and-up class="py-0 text-xs-left">
            <v-btn large block @click="searchButton" class="py-0 deep-orange accent-4 white--text" style="margin-top: 4px;"
              :loading="loading"
              :disabled="loading"
            >
              Search
              <span slot="loader">Loading...</span>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-container> 
    </v-container> 
  </v-app> 
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as VueGoogleMaps from 'vue2-google-maps'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
      libraries: 'places' // necessary for places input
    }
  })

  export default {
    props: {
      carouselStyle: {
        type: String,
        default: 'os-full-screen'
      }, 
      overlayStyle: {
        type: String,
        default: 'os-overlay'
      },           
      sitetitle: String,
      titlefirst: String,
      titlesecond: String,
      titlethird: String,
      titleStyle: {
        type: String,
        default: 'os-title'
      }, 
      subtitleStyle: {
        type: String,
        default: 'os-sub-title'
      },  
      titlecolourStyle: {
        type: String,
        default: 'siteColor'
      }, 
      loadCarousel: Array               
    },
    data() {
      return {
        loading: false,
      }
    },
    computed: {
      user() {
        const login = { ...this.$store.getters.firstLogin }
        return { user: this.$store.getters.user, loginHistory: login }
      },
      error() {
        return { ...this.$store.getters.error }
      },
      located() {
        return { ...this.$store.getters.loadAllRestaurantResult }
      }
    },
    watch: {
      located(value) {
        if (value !== '') {
          this.loading = false
          this.$router.push('locate')
        }
      }
    },
    methods: {
      setPlace (place) {
        this.currentPlace = place
      },
      searchButton () {
        let _this = this
        if (_this.currentPlace) {
          this.loading = true
          const address = _this.currentPlace.address_components[0].long_name ? _this.currentPlace.address_components[0].long_name : 'Cannot locate address'
          const location = new firebase.firestore.GeoPoint(this.currentPlace.geometry.location.lat(), this.currentPlace.geometry.location.lng())
          const searchData = {
            address:  address,
            location: location
          }
          this.$store.dispatch("searchLocation", searchData)
        }
      }
    }
  }
</script>

<style  scoped>
  .os-full-screen {
    min-height: 100vh;
  }
  #os-overlay {
    position: absolute;
    z-index: 199;
    top: 0;
    background: rgba(5, 5, 5, 0.6);
  }  
  #os-title {
    font-family: "Playfair Display", serif;
    font-weight: 700;
    font-style: italic;
    color: #fff;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s;
  }
  #os-sub-title {
    margin: 0;
    margin-bottom: 0px;
    padding: 0;
    font-family: "Merriweather", serif;
    font-weight: 300;
    font-size: 40px;
    letter-spacing: 2px;
    color: #fff;
    -webkit-transition: 0.3s;
    -o-transition: 0.3s;
    transition: 0.3s;
  }
  @media screen and (min-width: 320px) {
    #os-title {
      font-size: calc(48px + 6 * ((100vw - 320px) / 680));
    }
    #os-sub-title {
      font-size: calc(16px + 6 * ((100vw - 320px) / 680));
    }
  }
  @media screen and (min-width: 1000px) {
    #os-title {
      font-size: 150px;
    }
    #os-sub-title {
      font-size: 40px;
    }
  }
  .siteColor {
    color: #d18958 !important;
  }
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

