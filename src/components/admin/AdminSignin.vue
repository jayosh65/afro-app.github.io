<template>
  <v-app>
    <toolbar></toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-2">
              <v-toolbar dark color="orange darken-3">
                <v-toolbar-title>Admin login</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-tooltip bottom>
                  <span>Source</span>
                </v-tooltip>
              </v-toolbar>
              <v-card-text>
                <v-form @submit.prevent="onSignIn">
                  <v-text-field prepend-icon="person" name="login" label="Login" type="email" v-model="login"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="Password" id="password" type="password" v-model="password"></v-text-field>
                  <v-btn type="submit" color="orange darken-3 white--text">Login</v-btn>
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
import Vue from 'vue'
import Toolbar from "@/components/oscomponents/layout/Toolbar"
import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'

export default {
  components: { 
    Toolbar, AppFooter 
  },
  computed: {
    user() {
      const login = { ...this.$store.getters.firstLogin };
      return { user: this.$store.getters.user, loginHistory: login };
    }
  },
  watch: {
    user(value) {
      if (
        value.user.id !== null &&
        value.user.id !== undefined &&
        value.loginHistory.IsfirstTime === true
      ) {
        this.$router.push({ path: "change-info" });
      } else if (
        value.user.id !== null &&
        value.user.id !== undefined &&
        value.loginHistory.IsfirstTime === false
      ) {
        this.$router.push({ path: "admin" });
      } else {
        this.$router.push({ path: "home" });
      }
    }
  },
  data() {
    return {
      login: "",
      password: ""
    };
  },
  methods: {
    onSignIn() {
      this.$store.dispatch("signUserIn", {
        email: this.login,
        password: this.password
      });
    }
  }
};
</script>