<template>
  <v-app>
    <toolbar></toolbar>
    <v-content>
      <restaurant-display :thisRestaurant="restaurant"></restaurant-display>
      <v-fab-transition>
        <v-btn
          color="orange darken-3 white--text"
          fab
          fixed
          bottom
          right
          @click.stop="dialog = true, loadPreviousSearch()"
        >
          <v-icon>search</v-icon>
        </v-btn>
      </v-fab-transition>
      <v-dialog v-model="dialog" max-width="50vw" scrollable persistent>

        <div
            id="e3"
            style="margin: auto;"
            class="grey lighten-3"
          >
            <v-toolbar
              color="orange darken-3 white--text"
              dark
            >
              <v-toolbar-title>{{ previousSearchCount }}{{ previousSearchCount > 1 ? ' restaurants' : ' restaurant' }} found</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>search</v-icon>
              </v-btn>
            </v-toolbar>

            <v-card>
              <v-container
                fluid
                grid-list-lg
              >
                <v-layout row wrap>

                  <v-flex v-for="card in previousSearch" :key="card.id" xs12>
                    <v-card  hover class="white--text mb-2" :color="thisPage === card.id ? 'orange lighten-4' : 'orange lighten-5'">
                      <router-link :to="{name: 'Restaurant', params: { id: card.id  }}" style="text-decoration: none;">
                      <v-layout align-start justify-start row>
                        <v-flex xs12 md4 class="text-sm-left">
                          <v-img
                            :src="card.image.profile"
                            height="125px"
                            contain
                          ></v-img>
                        </v-flex>
                        <v-flex xs12 md8>
                          <v-card-title class="pa-0" primary-title>
                            <div>
                              <div class="headline text-sm-left">{{ card.name }}</div>
                              <div class="text-sm-left">{{ card.cuisinecountry }}</div>
                              <div class="text-sm-left">{{ card.address.full }}</div>
                              <div class="text-sm-left">{{ card.distanceFromCenter|distanceformat }}</div>
                            </div>
                          </v-card-title>
                        </v-flex>
                      </v-layout>
                      </router-link>
                    </v-card>
                  </v-flex>

                </v-layout>
              </v-container>
            </v-card>
          </div>
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
    </v-content> 
    <app-footer></app-footer>
  </v-app>             
</template>

<script>
  import Toolbar from '@/components/oscomponents/layout/Toolbar.vue'
  import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'
  import RestaurantDisplay from '@/components/oscomponents/component/RestaurantDisplay.vue'
  export default {
  components: {
    Toolbar, AppFooter, RestaurantDisplay
  },
  props: {
    thisRestaurant: Object
  },
  data () {
    return {
      restaurant: '',
      dialog: false,
      previousSearch: [],
      thisPage: '',
      previousSearchCount: 0
    }
  },
  created () {
    const id = this.$route.params.id
    const isRestaurantAvailable = this.$store.getters.loadAllRestaurantResult.filter(obj => {return obj.id === id}) ? this.$store.getters.loadAllRestaurantResult.filter(obj => {return obj.id === id}) : 0
    const isThisRestaurantAvailable = this.$store.getters.loadThisRestaurantResult.filter(obj => {return obj.id === id}) ? this.$store.getters.loadThisRestaurantResult.filter(obj => {return obj.id === id}) : 0
    if (isRestaurantAvailable.length > 0) { 
      let value = {...isRestaurantAvailable[0]}
      this.restaurant = value
    } else if (isRestaurantAvailable.length > 0) {
      let value = {...isThisRestaurantAvailable[0]}
      this.restaurant = value
    } else {
      this.$store.dispatch('getThisLocation', id)
    }
  },
  computed: {
    loadSearchResults () {
      return {...this.$store.getters.loadThisRestaurantResult}
    },
    hasUrlChanged () {
      return this.$route.params.id
    }
  },
  watch: {
    loadSearchResults (value) {
     if (value !== '') {
       this.restaurant = value
     }
    },
    hasUrlChanged (value) {
      const search = this.$store.getters.loadAllRestaurantResult.filter(obj => {return obj.id === value})
      this.restaurant = search[0]
      this.thisPage = value
    }   
  },
  methods: {
    loadPreviousSearch () {
      const previoussearch = this.$store.getters.loadAllRestaurantResult
      this.previousSearch = previoussearch
      this.previousSearchCount = previoussearch.length
      this.thisPage = this.$route.params.id
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

