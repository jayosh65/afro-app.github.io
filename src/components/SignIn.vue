<template>
  <v-app>
    <toolbar></toolbar>
    <v-content>
      <v-container fluid fill-height pa-0>
        <v-layout align-center justify-center image-cover :style="{ backgroundImage: `url('${src[0] !== undefined ? src[0].path : null}')` }">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-2">
              <v-toolbar dark color="orange darken-3">
                <v-toolbar-title>Login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-alert
                  v-model="errorAlert"
                  dismissible
                  outline
                  icon="warning"
                >
                  {{ errorMessage }}
                </v-alert>
                <v-form @submit.prevent="onSignIn">
                  <v-text-field prepend-icon="person" name="login" label="Login" type="email" v-model="login"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                  <v-btn 
                    type="submit" 
                    color="orange darken-3 white--text"
                    :loading="loading"
                    :disabled="loading"
                  >
                    Login
                    <span slot="loader">Loading...</span>
                  </v-btn>
                  <v-card-actions>
                    <v-btn :to="{name: 'Request password'}" flat color="orange">Forgot password?</v-btn>
                  </v-card-actions>                  
                </v-form>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
    <app-footer></app-footer>
  </v-app>             
</template>

<script>
import Toolbar from "@/components/oscomponents/layout/Toolbar"
import AppFooter from '@/components/oscomponents/layout/AppFooter'

export default {
  components: { 
    Toolbar, AppFooter 
  },
  data() {
    return {
      login: "",
      password: "",
      errorAlert: false,
      loading: false,
      errorMessage: '',
      src: ''
    }
  },  
  mounted () {
    this.$store.dispatch("loadPageImage")
  }, 
  computed: {
    user() {
      const login = { ...this.$store.getters.firstLogin }
      return { user: this.$store.getters.user, loginHistory: login }
    },
    error() {
      return { ...this.$store.getters.error }
    },
    images() {
      return this.$store.getters.loadCarouselImages
    }   
  },
  watch: {
    user(value) {
      this.loading = false
      if (
        value.user.id !== null &&
        value.user.id !== undefined &&
        value.loginHistory.IsfirstTime === true
      ) {     
        this.$router.push({ path: "change-info" })
      } else if (
        value.user.id !== null &&
        value.user.id !== undefined &&
        value.loginHistory.IsfirstTime === false
      ) {
        this.$router.push({ path: "member" })
      } else {
        this.$router.push({ path: "sign-in" })
      }
    },
    error(value) {
      const error = value
      this.loading = false
      this.errorAlert = true
      this.errorMessage = error.message
    },
    images(value) {
      const result = value.filter(obj =>{return obj.category === 'Signin page'})
      this.src = result
    }   
  },
  methods: {
    onSignIn() {
      this.loading = true
      this.$store.dispatch("signUserIn", {
        email: this.login,
        password: this.password
      })
    }
  }
};
</script>

<style>
.image-cover {
  background-size: cover;
}
</style>