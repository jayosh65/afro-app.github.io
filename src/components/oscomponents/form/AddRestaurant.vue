<template>
  <v-card>
    <v-card-title>
      <span class="headline" color="orange darken-3">Add Restaurant</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text style="height: 70vh;">

    <v-tabs
      dark
      color="orange darken-3"
      show-arrows
    >
      <v-tabs-slider color="yellow"></v-tabs-slider>
      <v-tab
        :href="'#tab-0'"
      >
        Information
      </v-tab>
      <v-tab
        :href="'#tab-1'"
        @click="loadRestaurantImages"
      >
        Images
      </v-tab>
      <v-tab
        :href="'#tab-2'"
      >
        Opening Times
      </v-tab>      
      <v-tabs-items>
        <v-tab-item
          :id="'tab-0'"
        >
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>      
                <v-text-field
                  ref="name-confirmation"
                  v-model="name"
                  :rules="nameRules"
                  label="Restaurants Name"
                  required
                ></v-text-field>
              </v-flex>  
              <v-flex xs12>
                <v-autocomplete
                  v-model="country"
                  :items="countries"
                  label="Country"
                  required
                ></v-autocomplete>             
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  ref="info-confirmation"
                  v-model="info"
                  name="info"
                  label="Restaurant Information"
                  :rules="infoRules"
                ></v-textarea>
              </v-flex>
              <v-flex xs12>
                  <v-toolbar
                    dense
                    flat
                  >
                  <gmap-autocomplete
                    @place_changed="setPlace"
                    style="width: 70vh;"
                  >
                  </gmap-autocomplete>
                </v-toolbar>
              </v-flex> 
              <v-flex xs12>      
                <v-text-field
                  v-model="userlocation"
                  label="Address"
                >{{ userlocation }}</v-text-field>
              </v-flex> 
              <v-flex xs6>      
                <v-text-field
                  v-model="userCoordinateLat"
                  label="Latitude"
                >{{ userCoordinateLat }}</v-text-field>
              </v-flex>
              <v-flex xs6>      
                <v-text-field
                  v-model="userCoordinateLong"
                  label="Longitude"
                >{{ userCoordinateLong }}</v-text-field>
              </v-flex>                       
                  
              <!-- <v-flex xs10>      
                <v-text-field
                  ref="phone"
                  label="Phone Number"
                ></v-text-field>
              </v-flex> 
              <v-flex xs2>      
                <v-btn color="orange darken-3" fab small dark>
                  <v-icon>add</v-icon>
                </v-btn>
              </v-flex> 
              <v-flex xs12>      
                <v-text-field
                  ref="website"
                  label="Website Name"
                ></v-text-field>
              </v-flex> 
              <v-flex xs12>      
                <v-text-field
                  ref="facebook"
                  label="Facebook"
                ></v-text-field>
              </v-flex>
              <v-flex xs12>      
                <v-text-field
                  ref="twitter"
                  label="Twitter"
                ></v-text-field>
              </v-flex>  -->
            </v-layout>
          </v-container>  

        </v-tab-item>
        <v-tab-item
          :id="'tab-1'"
        >
          <v-container grid-list-md>
            <v-layout wrap>        

            <v-flex xs10>
              <v-autocomplete
                ref="profile-confirmation"
                :items="profile"
                @select="loadProfileImage"
                :rules="profileImageRules"
                :disabled="isUpdating"
                label="Select a profile image"
                no-data-text="No profile images available"
                item-text="path"
                item-value="path"              
                chips
                v-model="profileimage"
              >
                <template
                  slot="selection"
                  slot-scope="data"
                >
                  <v-chip
                    :selected="data.selected"
                    class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                  >
                    <v-avatar>
                      <img :src="data.item.path">
                    </v-avatar>
                    {{ data.item.category }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-flex>
            <v-flex xs2>      
              <v-btn color="orange darken-3" fab small dark @click="addProfileImage">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex> 
            <v-flex v-if="showProfileImage" xs12 sm4 offset-sm4>
              <v-card>
                <v-card-media
                  :src="profilepicture"
                  height="200px"
                ></v-card-media>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" fab small dark  @click="removeImage">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex> 

            <v-flex xs10>
              <v-autocomplete
                :items="gallery"
                @select="loadGalleryImage"
                :disabled="isUpdating"
                label="Select and add gallery images"
                item-text="id"
                item-value="id"
                background-color="white"
                no-data-text="No gallery images available"
                box              
                chips
                v-model="galleryimage"
                multiple
              >
                <template
                  slot="selection"
                  slot-scope="data"                                  
                >
                  <v-chip
                    :selected="data.selected"
                    class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                    close
                  >
                    <v-avatar>
                      <img :src="data.item.path">
                    </v-avatar>
                    {{ data.item.category }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-flex>           
            <v-flex xs2>      
              <v-btn color="orange darken-3" fab small dark @click="addGalleryImage">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex> 
            <v-flex v-for="{id, path} in gallerypicture" :key="id" v-if="showGalleryImage" xs12 sm4>
              <v-card hover>
                <v-img
                  :src="path"
                  height="200px"
                ></v-img>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" fab small dark  @click="removeGalleryImage(id)">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex> 

            <v-flex xs10>
              <v-autocomplete
                :items="menu"
                @select="loadMenuImage"
                :disabled="isUpdating"
                label="Select and add menu images"
                item-text="id"
                item-value="id"
                background-color="white"
                no-data-text="No menu images available"
                box              
                chips
                v-model="menuimage"
                multiple
              >
                <template
                  slot="selection"
                  slot-scope="data"                                  
                >
                  <v-chip
                    :selected="data.selected"
                    class="chip--select-multi"
                    @input="data.parent.selectItem(data.item)"
                    close
                  >
                    <v-avatar>
                      <img :src="data.item.path">
                    </v-avatar>
                    {{ data.item.category }}
                  </v-chip>
                </template>
              </v-autocomplete>
            </v-flex>           
            <v-flex xs2>      
              <v-btn color="orange darken-3" fab small dark @click="addMenuImage">
                <v-icon>add</v-icon>
              </v-btn>
            </v-flex> 
            <v-flex v-for="{id, path} in menupicture" :key="id" v-if="showMenuImage" xs12 sm4>
              <v-card hover>
                <v-card-media
                  :src="path"
                  height="200px"
                ></v-card-media>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" fab small dark  @click="removeMenuImage(id)">
                    <v-icon>remove</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex> 

            </v-layout>
          </v-container>               
        </v-tab-item>
        <v-tab-item
          :id="'tab-2'"
        >
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h4 class="mt-3"><span><v-checkbox v-model="checkMonday" label="Monday:"></v-checkbox></span></h4></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkMonday" v-model="monday.value" :max="monday.max" :min="monday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkMonday">Closed</h4>
              </v-flex>  
            </v-layout>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkTuesday" label="Tuesday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkTuesday" v-model="tuesday.value" :max="tuesday.max" :min="tuesday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkTuesday">Closed</h4>
              </v-flex>  
            </v-layout>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkWednesday" label="Wednesday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkWednesday" v-model="wednesday.value" :max="wednesday.max" :min="wednesday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkWednesday">Closed</h4>
              </v-flex>  
            </v-layout>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkThursday" label="Thursday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkThursday" v-model="thursday.value" :max="thursday.max" :min="thursday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkThursday">Closed</h4>
              </v-flex>  
            </v-layout> 
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkFriday" label="Friday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkFriday" v-model="friday.value" :max="friday.max" :min="friday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkFriday">Closed</h4>
              </v-flex>  
            </v-layout>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkSaturday" label="Saturday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkSaturday" v-model="saturday.value" :max="saturday.max" :min="saturday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkSaturday">Closed</h4>
              </v-flex>  
            </v-layout>
            <v-layout wrap>
              <v-flex xs2 class="py-0 my-0 text-xs-center"><h3 class="mt-3"><span><v-checkbox v-model="checkSunday" label="Sunday:"></v-checkbox></span></h3></v-flex>        
              <v-flex xs10 class="py-0 my-0">
                <time-slider v-if="checkSunday" v-model="sunday.value" :max="sunday.max" :min="sunday.min"></time-slider>
                <h4 class="mt-4 red--text text-xs-left" v-if="!checkSunday">Closed</h4>
              </v-flex>  
            </v-layout>                                       
          </v-container>               
        </v-tab-item>        
      </v-tabs-items>
    </v-tabs> 

    </v-card-text> 
    <v-divider></v-divider>   
    <v-card-actions>
      <!-- <v-btn color="green darken-1" flat @click.native="dialog = false">Close</v-btn>
      <v-btn flat color="orange">Share</v-btn> -->
      <v-spacer></v-spacer>
      <v-btn
        color="primary"
        class="white--text"
        @click="addRestaurant()" 
      >
        Upload
    </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  import TimeSlider from "./TimeSlider";
  import Vue from 'vue'
  import * as VueGoogleMaps from 'vue2-google-maps'
  import { mapActions, mapGetters } from 'vuex'
  import * as firebase from "firebase"
  import utility from '@/helpers/osutility.js'

  Vue.use(VueGoogleMaps, {
    load: {
      key: 'AIzaSyAv_L4utOkpFLav6mE4N3qH0zkVBdXz_rY',
      libraries: 'places' // necessary for places input
    }
  })

  export default {
    components: { TimeSlider },
    data: () => ({
      name: '',
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 40) || 'Name must be less than 40 characters'
      ],
      countries: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo-(Republic)', 'Congo-(Democratic)', 'Cote d Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
      dialog: false,
      country: '',
      info: '',
      infoRules: [
        v => (v.length <= 500) || 'Info must be less than 500 characters'
      ],
      userlocation: '',
      userCoordinateLat: '',
      userCoordinateLong: '',
      addressRules: [
        v => (v.length <= 300) || 'Info must be less than 300 characters'
      ],
      profileImageRules: [
        v => !!v || 'Profile image is required'
      ],
      profile: [],
      gallery: [],
      menu: [],
      isUpdating: false,
      profileimage: [],
      profilepicture: '',
      showProfileImage: false,
      galleryimage: [],
      gallerypicture: [],
      showGalleryImage: false,
      menuimage: [],
      menupicture: [],
      showMenuImage: false,
      monday: { value: [360, 1080], min: 0, max: 1440 },
      checkMonday: true,
      tuesday: { value: [360, 1080], min: 0, max: 1440 },
      checkTuesday: true,
      wednesday: { value: [360, 1080], min: 0, max: 1440 },
      checkWednesday: true,
      thursday: { value: [360, 1080], min: 0, max: 1440 },
      checkThursday: true,
      friday: { value: [360, 1080], min: 0, max: 1440 },
      checkFriday: true,
      saturday: { value: [360, 1080], min: 0, max: 1440 },
      checkSaturday: true,
      sunday: { value: [360, 1080], min: 0, max: 1440 },
      checkSunday: true                    
    }), 
    methods: {
      setPlace (place) {
        this.currentPlace = place
        this.userlocation = place.formatted_address
        this.userCoordinateLat = place.geometry.viewport.f.b
        this.userCoordinateLong = place.geometry.viewport.b.b
      },
      addRestaurant () {
        const local = this
        const user = firebase.auth().currentUser;
        const galleryImage = []
        const menuImage = []
        for (var i of this.gallerypicture) {
          galleryImage.push(i)
        }
        // console.log(galleryImage)
        for (var j of this.menupicture) {
          menuImage.push(j)
        }       
        const data = {
          name: this.name,
          cuisinecountry: this.country,
          description: (this.info ? this.info : 'no info'),
          address: { 
            full: this.userlocation,
            latitude: this.userCoordinateLat,
            longitude: this.userCoordinateLong
          },
          image: {
            profile: (this.profilepicture ? this.profilepicture : 'no image'),
            gallery: utility.arrayToObject(galleryImage), 
            menu: utility.arrayToObject(menuImage)
          },
          OpeningTime: {
            monday: {
              opening: (this.checkMonday ? this.monday.value[0] : 'closed'),
              closing: (this.checkMonday ? this.monday.value[1] : 'closed'),
              isopened: (this.checkMonday ? 'opened' : 'closed')
            },
            tuesday: {
              opening: (this.checkTuesday ? this.tuesday.value[0] : 'closed'),
              closing: (this.checkTuesday ? this.tuesday.value[1] : 'closed'),
              isopened: (this.checkTuesday ? 'opened' : 'closed')
            },
            wednesday: {
              opening: (this.checkWednesday ? this.wednesday.value[0] : 'closed'),
              closing: (this.checkWednesday ? this.wednesday.value[1] : 'closed'),
              isopened: (this.checkWednesday ? 'opened' : 'closed')
            },
            thursday: {
              opening: (this.checkThursday ? this.thursday.value[0] : 'closed'),
              closing: (this.checkThursday ? this.thursday.value[1] : 'closed'),
              isopened: (this.checkThursday ? 'opened' : 'closed')
            },
            friday: {
              opening: (this.checkFriday ? this.friday.value[0] : 'closed'),
              closing: (this.checkFriday ? this.friday.value[1] : 'closed'),
              isopened: (this.checkFriday ? 'opened' : 'closed')
            },
            saturday: {
              opening: (this.checkSaturday ? this.saturday.value[0] : 'closed'),
              closing: (this.checkSaturday ? this.saturday.value[1] : 'closed'),
              isopened: (this.checkSaturday ? 'opened' : 'closed')
            }, 
            sunday: {
              opening: (this.checkSunday ? this.sunday.value[0] : 'closed'),
              closing: (this.checkSunday ? this.sunday.value[1] : 'closed'),
              isopened: (this.checkSunday ? 'opened' : 'closed')
            }                                
          },
          timecreated: firebase.firestore.FieldValue.serverTimestamp(),
          userid: user.uid
        }
        if(!this.$refs['name-confirmation'].hasError && !this.$refs['info-confirmation'].hasError) {
          local.$store.dispatch("addUserRestaurant", data)
        }
        // console.log(this.$refs['profile-confirmation'].hasError)
      },
      loadRestaurantImages() {
        const user = firebase.auth().currentUser
        this.$store.dispatch("loadImage", user.uid)
      },  
      loadProfileImage () {
        this.profile = this.$store.getters.loadProfileImage
      },
      loadGalleryImage () {
        this.gallery = this.$store.getters.loadGalleryImage
      },
      loadMenuImage () {
        this.menu = this.$store.getters.loadMenuImage
      },      
      addProfileImage () {
        this.profilepicture = this.profileimage
        this.showProfileImage = true
      },
      addGalleryImage () {
        const galleryId = this.galleryimage
        let image = galleryId.map((val) => {
          let value = this.gallery.find(el => el.id == val)
          return value
        })
        this.gallerypicture = image
        this.showGalleryImage = true
      },
      addMenuImage () {
        const menuId = this.menuimage
        let image = menuId.map((val) => {
          let value = this.menu.find(el => el.id == val)
          return value
        })
        this.menupicture = image
        this.showMenuImage = true
      },      
      removeImage () {
        this.showProfileImage = false  
        this.profilepicture = ''      
      },
      removeGalleryImage (val) {
        const result = this.gallerypicture.filter(obj => val.indexOf(obj.id) === -1);
        this.gallerypicture = result    
      },
      removeMenuImage (val) {
        const result = this.menupicture.filter(obj => val.indexOf(obj.id) === -1);
        this.menupicture = result    
      }      
    }
  }
</script>

