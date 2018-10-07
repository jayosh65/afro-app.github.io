<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <!-- <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list> -->
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <router-link 
        :to="{name: item.name}" 
        style="text-decoration: none;"
        v-for="item in items"
        :key="item.title"        
        >
        <v-list-tile>         
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title style="color: black;">{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>          
        </v-list-tile>
        </router-link>       
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      dark color="orange darken-3"
    >
      <v-toolbar-side-icon
        @click.stop="drawer = !drawer"
      ></v-toolbar-side-icon>
      <v-toolbar-title>AfroFoodMat</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat><v-icon>notification_important</v-icon></v-btn>

        <div class="text-xs-center">
          <v-menu
            v-model="menu"
            :close-on-content-click="false"
            :nudge-width="200"
            offset-x
          >
            <v-btn
              slot="activator"
              dark
              flat
              class="py-3"
            >
              <v-icon>notification_important</v-icon>
            </v-btn>

            <v-card>
              <v-list>
                <v-list-tile avatar>
                  <v-list-tile-avatar>
                    <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
                  </v-list-tile-avatar>

                  <v-list-tile-content>
                    <v-list-tile-title>John Leider</v-list-tile-title>
                    <v-list-tile-sub-title>Founder of Vuetify.js</v-list-tile-sub-title>
                  </v-list-tile-content>

                  <v-list-tile-action>
                    <v-btn
                      :class="fav ? 'red--text' : ''"
                      icon
                      @click="fav = !fav"
                    >
                      <v-icon>favorite</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>

              <v-divider></v-divider>

              <v-list>
                <v-list-tile>
                  <v-list-tile-action>
                    <v-switch v-model="message" color="purple"></v-switch>
                  </v-list-tile-action>
                  <v-list-tile-title>Enable messages</v-list-tile-title>
                </v-list-tile>

                <v-list-tile>
                  <v-list-tile-action>
                    <v-switch v-model="hints" color="purple"></v-switch>
                  </v-list-tile-action>
                  <v-list-tile-title>Enable hints</v-list-tile-title>
                </v-list-tile>
              </v-list>

              <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn flat @click="menu = false">Cancel</v-btn>
                <v-btn color="primary" flat @click="menu = false">Save</v-btn>
              </v-card-actions>
            </v-card>
          </v-menu>
        </div>

        <v-btn v-if="username" flat>Welcome {{ username }}</v-btn>
        <!-- <v-btn flat><v-icon>mail_outline</v-icon></v-btn> -->
        <v-btn flat @click="onSignOut"><v-icon dark left>account_circle</v-icon>Sign out</v-btn>              
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
export default {
    data() {
      return {
        drawer: null,
        items: [
          { title: "Home", icon: "dashboard",  name: "member"},
          { title: "Image", icon: "photo", name: "Member Images"},
          { title: "Mail", icon: "email", name: "Member mails"},
          { title: "Setting", icon: "settings", name: "changeinfo"},
        ],
        fav: true,
        menu: false,
        message: false,
        hints: true
      }
    },
    props: {
      username: {
        type: String,
        default: ''
      }
    },
    computed: {
      userSignOut () {
        return this.$store.getters.user
      }
    },
    watch: {
      userSignOut () {
        const userId = this.$store.getters.user
        if (userId === null || userId === undefined) {
          this.$router.push({ path: 'sign-in' }) 
        }
      }
    },     
    methods: {
      onSignOut () {
        this.$store.dispatch('signUserOut')
      }
    }  
}
</script>