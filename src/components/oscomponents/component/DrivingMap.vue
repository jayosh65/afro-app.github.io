<template>
  <v-card height="500px">
    <v-card-actions>
      <div id="map_canvas" style="width:100%;height:100%;"></div>
    </v-card-actions>
  </v-card>
</template>

<script>
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
      libraries: 'places' // necessary for places input
    }
  })

  export default {
    props: {
      address: { type: [Array, Number, String, Object]},
    },
    data () {
      return {

      }
    },
    computed: {
      isAddressLoaded () {
        return this.address
      }
    },
    watch: {
      isAddressLoaded (value) {
        this.loadDirectionMap(value)
      }
    },
    methods: {
      loadDirectionMap (value) {
        const currentLocation = JSON.parse(this.$store.getters.loadUserLocationResult)

        const deviceLocation = new google.maps.LatLng(currentLocation.location._lat, currentLocation.location._long)
        const mapOptions = {
          zoom:7,
          center: deviceLocation
        }
        const map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions)

        const directionsService = new google.maps.DirectionsService()
        const directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            draggable: true
        })

        directionsDisplay.setMap(map)
        this.calculateAndDisplayRoute(directionsService, directionsDisplay, value, currentLocation);
      }, 
      calculateAndDisplayRoute (directionsService, directionsDisplay, value, currentLocation) {
          directionsService.route({
              origin: new google.maps.LatLng(value.latitude, value.longitude),
              destination: new google.maps.LatLng(currentLocation.location._lat, currentLocation.location._long),
              avoidTolls: true,
              avoidHighways: false,
              travelMode: google.maps.TravelMode.DRIVING
          }, function (response, status) {
              if (status == google.maps.DirectionsStatus.OK) {
                  directionsDisplay.setDirections(response);
              } else {
                  window.alert('Directions request failed due to ' + status);
              }
          });
      }     
    }  
  }
</script>

<style  scoped>
  .search {
    background: #eeeded;
  }
</style>