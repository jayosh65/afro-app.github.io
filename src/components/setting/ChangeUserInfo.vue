<template>
  <v-app>
    <member-toolbar></member-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md8 lg6>
            <v-card ref="form">
              <v-toolbar
                card
              >
                <v-icon>person</v-icon>
                <v-toolbar-title class="font-weight-light">Update Profile</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>              
              <v-card-text>
                <v-layout fill-height>
                  <v-flex xs10 align-end flexbox>
                    <v-text-field
                      v-model="username"
                      :rules="[
                        () => !!username || 'This field is required',
                        () => !!username && username.length >= 5 || 'Password must be more than 5 characters',
                        () => !!username && username.length <= 20 || 'Password must be less than 20 characters'
                      ]"
                      :error-messages="errorMessages"
                      label="Username"
                      placeholder="Enter user name for display"
                      solo
                      required
                      v-on:keyup="userNameCheck"
                      v-if="nameDoesExist"
                    ></v-text-field>
                    <v-card-title v-else class="pa-0 headline mb-3" primary-title>{{ userNameDisplay }}</v-card-title>
                    <v-card-title v-if="showIt" class="pa-0 red--text" primary-title>User name exist</v-card-title>
                  </v-flex>
                  <v-flex xs2 align-end flexbox>
                    <v-btn v-if="allowUserUpdate ? 'disabled' : ''" color="primary" @click="addUserName()">
                      <v-icon>autorenew</v-icon>
                    </v-btn>
                  </v-flex>
                </v-layout>
                <v-text-field
                  ref="password"
                  :rules="[
                    () => !!password || 'This field is required',
                    () => !!password && password.length >= 5 || 'Password must be more than 5 characters'
                  ]"
                  v-model="password"
                  label="Password"
                  placeholder="Enter password"
                  required
                ></v-text-field>
                <v-text-field
                  ref="confirmPassword"
                  :rules="[
                    () => !!confirmPassword || 'This field is required',
                    () => !!confirmPassword && confirmPassword.length >= 5 || 'Password must be more than 5 characters'
                  ]"
                  v-model="confirmPassword"
                  label="confirmPassword"
                  placeholder="Enter confirmation password"
                  required
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn flat>Cancel</v-btn>
                <v-spacer></v-spacer>
                <v-slide-x-reverse-transition>
                  <v-tooltip
                    v-if="formHasErrors"
                    left
                  >
                    <v-btn
                      slot="activator"
                      icon
                      class="my-0"
                      @click="resetForm"
                    >
                      <v-icon>refresh</v-icon>
                    </v-btn>
                    <span>Refresh form</span>
                  </v-tooltip>
                </v-slide-x-reverse-transition>
                <v-btn color="primary" v-if="showButton" @click="submit">Submit</v-btn>
              </v-card-actions>
            </v-card>
            <v-alert
              :value="updatePasswordSuccess"
              color="success"
              icon="check_circle"
              outline
            >
              Your password has been updated
            </v-alert>
            <v-alert
              :value="updatePasswordError"
              color="error"
              icon="warning"
              outline
            >
              There has been an error during password update. Please try again.
            </v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
    </v-app>           
</template>

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import * as firebase from 'firebase'

 export default {
    components: { MemberToolbar },
    data: () => ({
      errorMessages: '',
      username: null,
      password: null,
      confirmPassword: null,
      formHasErrors: false,
      showIt: false,
      showButton: false,
      nameDoesExist: true,
      allowUserUpdate: false,
      userNameDisplay: '',
      updatePasswordSuccess: false,
      updatePasswordError: false
    }),
    mounted () {
      const user = firebase.auth().currentUser
      const local = this
      if (user != null) {
        this.userNameDisplay = user.displayName
        user.providerData.forEach(function (profile) {
          const profileExist = profile.displayName ? true : false
          if (profileExist) {
            local.nameDoesExist = false
          } else {
            local.nameDoesExist = true
          }
        })
      }
    },
    computed: {
      form () {
        return {
          password: this.password,
          confirmPassword: this.confirmPassword
        }
      },
      passwordError () {
        return this.$store.getters.error
      },
      passwordSuccess () {
        return this.$store.getters.success
      },
    },
    watch: {
     form (value) {
       if (value.password !== null && value.confirmPassword !== null && (value.password === value.confirmPassword)) {
         this.showButton = true
       } else {
         this.showButton = false
       }
      },
      passwordError (value) {
        if (value) {
          this.updatePasswordError = true
          this.updatePasswordSuccess = false
        }        
      },
      passwordSuccess (value) {
        if (value) {
          this.updatePasswordSuccess = true
          this.updatePasswordError = false
        }
      },
    },
    methods: {
      addUserName () {
        const name = this.username
        const db = firebase.firestore()
        const user = firebase.auth().currentUser
        const collectionReference = db.collection('users').where("username", "==", name)
        collectionReference.get().then(function(querySnapshot) {
          if (querySnapshot.empty) {
            user.updateProfile({
              displayName: name,
            }).then(function() {
              this.nameDoesExist = true
              this.allowUserUpdate = false
            }).catch(function(error) {
              
            })

            var userNames = db.collection("users").doc(user.uid)
            .update({
              username: name
            })
            .then(function() {
                console.log("Document successfully updated!");
            })
            .catch(function(error) {
                // The document probably doesn't exist.
                console.error("Error updating document: ", error);
            })
            // this.addUsername = true
          } else {
            console.log('This is a not test')
            // this.addUsername = false
          }
        })
      },
      userNameCheck: function () {
        const name = this.username
        if (name.length > 5 && name.length < 20) {
          this.allowUserUpdate = true
        } else {
          this.allowUserUpdate = false
        }
      },      
      submit () {
        const password = this.password
        if (password) {
          this.$store.dispatch('updatePassword', password)
        }
      }
    }
  }
</script>