<template>
  <v-app> 
    <v-container fluid :class="thisStyle">
      <v-layout row>
				<v-carousel>
					<v-carousel-item
						v-for="(item,i) in thisRestaurant.image.gallery"
						:key="i"
						:src="item.path"
					></v-carousel-item> 
				</v-carousel>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-card>
            <v-card-title primary-title>
              <div>
                <div class="headline text-sm-left">{{ thisRestaurant.name }}</div>
                <div class="subheading text-sm-left">{{ thisRestaurant.cuisinecountry }}</div>
                <div class="subheading text-sm-left">{{ thisRestaurant.address.full }}</div> 
              </div>
            </v-card-title>
          </v-card>
          <v-divider></v-divider>
          <v-tabs
            centered
          >
              <v-tabs-slider></v-tabs-slider>

              <v-tab href="#tab-1">
                Menu
              </v-tab>

              <v-tab href="#tab-2" @click="loadMap(thisRestaurant)">
                Info
              </v-tab>

              <v-tab-item
                id="tab-1"
              >
                <v-flex fill-height xs12>
                  <v-card height='100%'>
                    <v-container
                      fluid
                      grid-list-md
                    >
                    <v-layout row wrap>
                      <v-flex xs12 sm6 md4 v-for="card in thisRestaurant.image.menu" :key="card.id">
                        <v-card hover>
                          <v-card-title class="py-0" primary-title>
                            <div>
                              <h3 class="mb-0 text-sm-left">{{ card.title }}</h3>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn icon  @click="toggleItem(card.id)">
                              <v-icon>{{ toggle ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                            </v-btn>                        
                          </v-card-title>
                          <v-slide-y-transition>
                            <div v-show="toggle.indexOf(card.id) >= 0">
                              <v-img
                                :src="card.path"
                                height="200px"
                              >
                              </v-img>
                              <v-card-text class="mb-0 text-sm-left">
                                {{ card.description }}
                              </v-card-text>
                            </div>
                          </v-slide-y-transition>
                        </v-card>
                      </v-flex>
                    </v-layout>
                    </v-container>
                  </v-card>
                </v-flex>
              </v-tab-item>

              <v-tab-item
                id="tab-2"
              >
                <v-card>
                  <v-container
                    fluid
                    grid-list-lg
                  >
                    <v-layout row wrap>
                      <v-flex fill-height xs12>
                        <v-card hover>
                          <v-card-title primary-title>
                            <div class="headline" style="width: 400%;">About {{ thisRestaurant.name }}</div>
                            <div>{{ thisRestaurant.description }}</div>
                          </v-card-title>
                        </v-card>
                      </v-flex>
                      <v-flex xs12 md6>
                        <v-card hover>
                          <GmapMap
                            :center="center"
                            :zoom="16"
                            map-type-id="terrain"
                            style="width: 100%; height: 290px"
                          >
                            <GmapMarker
                              v-if="this.position"
                              label="★"
                              :clickable="true"
                              :position="position"
                              @click="center=position"
                            />
                          </GmapMap> 
                          <v-card-title primary-title v-if="thisRestaurant.name">
                            <div>
                              <h3 class="mb-0 text-sm-left">{{ thisRestaurant.name }}</h3>
                              <div class="text-sm-left">{{ thisRestaurant.address.full }}.</div>
                            </div>
                            <v-spacer></v-spacer>
                            <v-btn flat icon @click="dialogDirection = true, loadDirectionAddress(thisRestaurant.address)" color="orange darken-3">
                              <v-icon>directions</v-icon>
                            </v-btn>                          
                          </v-card-title>
                          <v-divider></v-divider>
                          <v-card-title primary-title v-if="thisRestaurant.phone">
                            <div>
                              <div class="text-sm-left">{{ thisRestaurant.phone }}.</div>
                            </div>
                          </v-card-title>                          
                        </v-card>
                      </v-flex>

                      <v-flex xs12 md6>
                        <v-card hover>
                          <v-card-title primary-title>
                            <div class="headline" style="width: 400%;">Opening times</div>
                          </v-card-title>
                          <v-card-actions>
                          <v-btn flat>Monday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.monday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.monday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.monday.closing) : thisRestaurant.OpeningTime.monday.isopened }}
                          </v-btn>
                        </v-card-actions>
                        <v-card-actions>
                          <v-btn flat>Tuesday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.tuesday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.tuesday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.tuesday.closing) : thisRestaurant.OpeningTime.tuesday.isopened }}
                          </v-btn>
                        </v-card-actions>
                        <v-card-actions>
                          <v-btn flat>Wednesday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.wednesday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.wednesday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.wednesday.closing) : thisRestaurant.OpeningTime.wednesday.isopened }}
                          </v-btn>
                        </v-card-actions>    
                        <v-card-actions>
                          <v-btn flat>Thursday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.thursday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.thursday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.thursday.closing) : thisRestaurant.OpeningTime.thursday.isopened }}
                          </v-btn>
                        </v-card-actions>
                        <v-card-actions>
                          <v-btn flat>Friday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.friday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.friday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.friday.closing) : thisRestaurant.OpeningTime.friday.isopened }}
                          </v-btn>
                        </v-card-actions>  
                        <v-card-actions>
                          <v-btn flat>Saturday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.saturday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.saturday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.saturday.closing) : thisRestaurant.OpeningTime.saturday.isopened }}
                          </v-btn>
                        </v-card-actions>
                        <v-card-actions>
                          <v-btn flat>Sunday</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat>
                            {{ thisRestaurant.OpeningTime.sunday.isopened === 'opened' ? $options.filters.timeformat(thisRestaurant.OpeningTime.sunday.opening) + ' - ' + $options.filters.timeformat(thisRestaurant.OpeningTime.sunday.closing) : thisRestaurant.OpeningTime.sunday.isopened }}
                          </v-btn>
                        </v-card-actions>                       
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>                      
                </v-card>
              </v-tab-item>
          </v-tabs>
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
  </v-app> 
</template>

<script>
  import Vue from 'vue'
  import firebase from 'firebase'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import DrivingMap from '@/components/oscomponents/component/DrivingMap.vue'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
      libraries: 'places' // necessary for places input
    }
  })

  export default {
    components: {
      DrivingMap
    },
    props: {
      thisRestaurant: { type: [Array, Number, String, Object]},
      thisStyle: {
        type: String,
        default: 'search'
      }, 
    },
    data () {
      return {
        currentPlace: '',
        center: {lat: 0, lng: 0},
        position: {lat: 0, lng: 0},
        markers: [{
          position: {lat: 0, lng: 0}
        }],
        toggle: [],
        dialogDirection: false,
        address: ''
      }
    },
    methods: {
      setPlace (place) {
        this.currentPlace = place
      },
      loadMap(value) {
        const coorValue = {lat: Number(value.address.latitude), lng: Number(value.address.longitude)}
        this.center = coorValue 
        this.position = coorValue
      },
      toggleItem: function (key) {
        let i = this.toggle.indexOf(key)
        if (i < 0) {
          this.toggle.push(key)
        } else {
          this.toggle.splice(i, 1)
        }
      },
      loadDirectionAddress(value) {
        this.address = value
      }   
    },
    filters: {
      timeformat: function (value) {
        let hour = value / 60
        hour = Math.floor(hour).toString()

        let minute = value % 60
        if (minute < 10) {
          minute = '0' + minute.toString()
        } else {
          minute = minute.toString()
        }

        return hour + ':' + minute
      }
    }     
  }
</script>

<style  scoped>
  .search {
    background: #eeeded;
  }
</style>