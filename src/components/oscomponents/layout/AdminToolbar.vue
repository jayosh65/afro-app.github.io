<template>
  <div>
    <v-navigation-drawer
      v-model="drawer"
      absolute
      temporary
    >
      <v-list class="pa-1">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg">
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>John Leider</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
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
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
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
        <v-btn flat>Link One</v-btn>
        <v-btn flat>Link Two</v-btn>
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
          { title: "Dashboard", icon: "dashboard",  name: "admin"},
          { title: "Register", icon: "how_to_reg", name: "register"},
          { title: "Restaurant", icon: "restaurant", name: "approval"},
          { title: "Internal Mail", icon: "email", name: "Admin mail"},
          { title: "Setting", icon: "settings", name: "Admin setting"},
        ]
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
          this.$router.push({ path: 'home' }) 
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