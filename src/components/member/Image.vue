<template>
  <v-app>
    <member-toolbar></member-toolbar> 
    <v-content>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <v-btn
              absolute
              right
              color="orange darken-3 white--text"
              to="member" 
            >
              back
            </v-btn>
          </v-flex> 
					<v-flex d-flex>
						<h1 class="headline mb-3 text-xs-left">Image</h1>
					</v-flex>
        </v-layout> 
        <v-divider></v-divider>  
        <v-layout row wrap mt-3>             
          <v-flex xs12>
            <v-btn-toggle v-model="toggle_multiple" multiple>
              <v-tooltip top>
                <v-btn flat slot="activator" color="orange darken-3" @click="toggleProfileImage(profile)">
                  <v-icon>image</v-icon>
                </v-btn>
                <span>Profile image</span>
              </v-tooltip> 
              <v-tooltip top>
                <v-btn flat slot="activator" color="orange darken-3" @click="toggleGalleryImage(gallery)">
                  <v-icon>photo_album</v-icon>
                </v-btn>
                <span>Gallery image</span>
              </v-tooltip> 
              <v-tooltip top>              
                <v-btn flat slot="activator" color="orange darken-3" @click="toggleMenuImage(menu)">
                  <v-icon>restaurant_menu</v-icon>
                </v-btn>
                <span>Menu image</span>
              </v-tooltip> 
            </v-btn-toggle>
          </v-flex> 
        </v-layout>  
        <v-layout row wrap>   
          <v-flex 
            xs12 
            sm6 
            md3             
            v-for="card in images"
            :key="card.id"
          >
          <v-card class="ma-2" hover>
            <v-img :src="card.path" aspect-ratio="2.75">
              <v-container fill-height fluid v-if="card.category !== 'profile'">
                <v-layout fill-height>
                  <v-flex xs12 align-end flexbox>
                    <span v-if="card.category === 'menu'" class="headline white--text">{{ card.title }}</span>
                  </v-flex>
                </v-layout>
              </v-container>                    
            </v-img>
            <v-card-actions>                    
              <v-btn icon  v-if="card.category !== 'profile'" @click="toggleItem(card.id)">
                <v-icon>{{ toggle ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
              </v-btn>  
              <v-spacer></v-spacer>
              <div class="orange--text">{{ card.category }}</div>
              <v-btn icon class="mx-0" @click="deleteImage(card.id, card.pathname)"><v-icon color="red darken-3">delete</v-icon></v-btn>
            </v-card-actions>

            <v-slide-y-transition>
              <v-card-text class="text-sm-left" v-if="card.category !== 'profile'" v-show="toggle.indexOf(card.id) >= 0">
                {{ card.description }}
              </v-card-text>
            </v-slide-y-transition>
          </v-card>
        </v-flex>
          <v-fab-transition>
            <v-btn
              color="orange darken-3 white--text"
              fab
              fixed
              bottom
              right
              @click.stop="dialog = true"
            >
              <v-icon>add</v-icon>
            </v-btn>
          </v-fab-transition>
          <v-dialog v-model="dialog" max-width="90vw" persistent>
            <add-image></add-image>
            <v-fab-transition>
              <v-btn 
                fab
                small
                color="white"
                class="mt-5"
                top
                right
                absolute
                @click.native="dialog = false"
              >
                <v-icon>close</v-icon>
              </v-btn>             
            </v-fab-transition>            
          </v-dialog>            
        </v-layout>
      </v-container>
    </v-content>  
  </v-app>           
</template>  

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import AddImage from "@/components/oscomponents/form/AddImage"
import * as firebase from "firebase"

export default {
    components: { MemberToolbar, AddImage },  
    data: () => ({
      dialog: false,
      show: false,
      toggle_multiple: [0, 1, 2],
      profile: true,
      gallery: true,
      menu: true,
      toggle: [],
    }), 
    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch("loadImage", user.uid);
        }
      })
    },
    computed: {
      images() {
        var imageData = []
        const profileData = this.$store.getters.loadProfileImage
        const galleryData = this.$store.getters.loadGalleryImage
        const menuData = this.$store.getters.loadMenuImage
        
        if (this.profile){
          profileData.map(obj => imageData.push(obj))        
        } 
        if (this.gallery){
          galleryData.map(obj => imageData.push(obj))        
        } 
        if (this.menu){
          menuData.map(obj => imageData.push(obj))        
        } 
        // Sort result by distance
        const result = imageData.sort((a, b) => {
          return b.timecreated - a.timecreated
        })   
        return result 
      }
    },
    methods: {
      deleteImage (a, b) {
        const local = this
        const imageData = {
          id: a,
          path: b
        }
        function imageToDelete () {
          local.$store.dispatch("deleteUserImage", imageData)
        }
        confirm('Are you sure you want to delete this item?') && imageToDelete()
      },
      toggleProfileImage (image) {
        this.profile = !image
      },
      toggleGalleryImage (image) {
        this.gallery = !image
      },
      toggleMenuImage (image) {
        this.menu = !image     
      },
      toggleItem: function (key) {
        let i = this.toggle.indexOf(key)
        if (i < 0) {
          this.toggle.push(key)
        } else {
          this.toggle.splice(i, 1)
        }
      },            
    } 
}
</script>