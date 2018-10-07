<template>
  <v-footer
    dark
    height="auto"
  >
    <v-layout row wrap>
      <v-flex xs12>
        <v-card
          flat
          tile
          xs12
          class="grey darken-4 white--text text-xs-center"
        >
          <v-card-text>
            <v-btn
              v-for="(link, i) in links"
              :key="i"
              class="mx-3 white--text"
              :to="link.path"
            >
              {{ link.title }}
            </v-btn>
          </v-card-text>
          <v-card-text class="white--text pt-0">
            <v-btn
              v-for="(link, i) in socials"
              :key="i"
              class="mx-3 white--text"
              fab
              :href="link.address" 
              target="_blank"
            >
              <v-icon
                color="orange darken-3"
              >
              {{ link.icon }}
              </v-icon>
            </v-btn>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-text class="white--text">
            &copy;2018 <strong>{{ footerlogo }}</strong>
          </v-card-text>
        </v-card>
          
      </v-flex>            
    </v-layout>
  </v-footer>
</template>

<script>
  export default {
    data: () => ({
      links: [],
      footerlogo: 'AfroFoodMat',
      socials: []
    }),
    mounted () {
      this.routeMenu()
      this.$store.dispatch("loadSocial")
    },
    computed: {
      loadSocialSettings () {
        return this.$store.getters.loadSocialSettings
      }
    },
    watch: {
      loadSocialSettings (value) {
        this.socials = value
      }
    },   
    methods: {
      routeMenu () {
        let routes = []
        for (var i in this.$router.options.routes) {
          if (!this.$router.options.routes.hasOwnProperty(i)) {
            continue
          }
          var route = this.$router.options.routes[i]
          if (route.hasOwnProperty('title')) {
            routes.push(route)
          }
        }
        this.links = routes
      }
    }   
  }
</script>