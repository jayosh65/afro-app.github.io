<template>
     <v-layout justify-center>
      <v-flex xs12 sm10 md8 lg4 my-5>
        <transition>
          <v-card flat v-if="seen" ref="form">
            <div class="display-1 text-xs-center pa-2">Sign up for our Newsletter</div>
            <v-card-text>
              <v-text-field
                ref="name"
                v-model="name"
                :rules="[() => !!name || 'This field is required']"
                :error-messages="errorMessages"
                label="Name"
                placeholder="Enter your name!"
                required
              ></v-text-field>
              <v-text-field
                ref="email"
                v-model="email"
                :rules="[
                  () => !!email || 'This field is required',
                  () => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'Invalid e-mail',
                  emailCheck(email)
                ]"
                label="Email"
                placeholder="Enter email"
                required
              ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-layout row>
                  <v-flex justify-center>
                    <v-btn color="primary" 
                      :loading="loading"
                      :disabled="loading"
                      @click="sendSubscriber"
                    >
                      Send
                      <span slot="loader">Loading...</span>
                    </v-btn>
                  </v-flex>
                </v-layout>
              </v-card-actions>
          </v-card>	
          <div class="title text-xs-center pa-2 green--text" v-else>Thanks {{ name }}! Expect our newsletter at afrofoodmat.com</div>
        </transition>			
			</v-flex>
    </v-layout>       
</template>

<script>
export default {
  data: () => ({
    seen: true,
    name: null,
    email: null,
    errorMessages: [],
    formHasErrors: false,
    loading: false,
    hide: true
  }),
  computed: {
    form () {
      // loading: false,
      return {
        name: this.name,
        email: this.email
      }
    },
    error() {
      return { ...this.$store.getters.error }
    },
     load() {
      return { ...this.$store.getters.loading }
    }   
  },
  watch: {
    name () {
      this.loading = false,
      this.errorMessages = []
    },
    error(value) {
      const error = value
      this.loading = false
      this.errorAlert = true
      // this.errorMessage = error.message
    },
    load (value) {
      this.loading = false
      this.seen = false
    }
  },
  methods: {
    emailCheck (value) {
      return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
    },
    sendSubscriber () {
      this.loading = true,
      this.formHasErrors = false
      console.log('hello test')
      Object.keys(this.form).forEach(f => {
        if (!this.form[f]) this.formHasErrors = true
        // this.$refs[f].validate(true)
      })
      var fromComplete = this.formHasErrors
      if (!fromComplete) {
        const data = {
          'name': this.name,
          'email': this.email,
        }
        this.$store.dispatch('sendSubscriberForm', data)
      }
    }
  }
}
</script>

<style>
  .siteColor {
    color: #d18958 !important;
  }
  .form {
    width: 100%;
    position: absolute;
    z-index: 10;
    bottom: 60px;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
</style>