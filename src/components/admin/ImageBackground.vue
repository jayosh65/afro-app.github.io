<template>
  <v-app>
    <admin-toolbar></admin-toolbar>
    <v-content>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12>
						<v-btn
							absolute
							right
							color="orange darken-3 white--text"
							to="/admin/setting" 
						>
							back
						</v-btn>
          </v-flex> 
        </v-layout>  
        <v-layout row wrap> 
        <v-flex d-flex xs12 sm10>
					<h1 class="headline mb-3 text-xs-left">Frontpage carousel image setting</h1>
				</v-flex>     
        <v-spacer></v-spacer>
        <v-flex
          v-for="card in cards"
          :key="card.id"
          xs12
          sm6
          md4
        >
          <v-card>
            <v-img
              :src="card.path"
              height="300px"
            >
            </v-img>
            <v-card-actions class="white justify-center"> 
              <h3 class="title mb-0 text-truncate">{{ card.title }}</h3>             
              <v-spacer></v-spacer>
              <div class="orange--text">{{ card.category }}</div>
              <v-btn icon class="mx-0" @click="deleteImage(card.id, card.pathname)"><v-icon color="red darken-3">delete</v-icon></v-btn>
            </v-card-actions>
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
            <add-page-image></add-page-image>
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
import AdminToolbar from "@/components/oscomponents/layout/AdminToolbar"
import AddPageImage from "@/components/oscomponents/form/AddPageImage"
import * as firebase from "firebase";

export default {
    components: { AdminToolbar, AddPageImage },  
    data: () => ({
      dialog: false,
      show: false,
			toggle: [],
			cards: ''
    }), 
    created () {
      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
          this.$store.dispatch("loadPageImages")
        }
      })
    },
    computed: {
      images() {
        return this.$store.getters.loadCarouselImages
      }
    },
    watch: {
      images(value) {
        this.cards = value
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
          local.$store.dispatch("deleteBackgroundImage", imageData)
        }
        confirm('Are you sure you want to delete this item?') && imageToDelete()
      },            
    } 
}
</script>