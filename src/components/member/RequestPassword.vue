<template>
  <v-app>
    <toolbar></toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm10 md4>
            <v-alert
              :value="errorObj"
              type="error"
              transition="scale-transition"
            >
              {{ errorMessage }}
            </v-alert>            
            <v-alert
              :value="alert"
              type="success"
              transition="scale-transition"
            >
              {{ message }}
            </v-alert>
            <v-card ref="form">
              <v-card-title primary-title>
                <div class="text-sm-left headline">Forgot your password?</div>
                <div class="text-sm-left">Enter the email associated with your account in the field below and we'll email you a link to reset your password.</div>
              </v-card-title>
              <v-card-text class="py-3">
                <v-text-field
                  ref="email"
                  v-model="email"
                  :rules="[
                    () => !!email || 'This field is required',
                    () => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email) || 'Invalid e-mail',
                    emailCheck(email)
                  ]"
                  label="E-mail"
                ></v-text-field>  
              </v-card-text>
              <v-divider class="mt-3"></v-divider>
              <v-card-actions>
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
                <v-btn color="primary" class="mr-2" @click="submit">Submit</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
    <app-footer></app-footer>
  </v-app>             
</template>

<script>
import Toolbar from "@/components/oscomponents/layout/Toolbar";
import AppFooter from '@/components/oscomponents/layout/AppFooter.vue';

export default {
  components: { 
    Toolbar, AppFooter 
  },
     data: () => ({
      errorMessages: '',
      email: '',
      formHasErrors: false,
      errorAlert: false,
      alert: false,
      successDone: true,
      loading: false,
      message: '',
      errorObj: false,
      errorMessage: false
    }),
    computed: {
      form () {
        return {
          email: this.email,
        }
      },
      error () {
        return { ...this.$store.getters.error }
      },
      load () {
        return { ...this.$store.getters.loading }
      },
      success () {
        return { ...this.$store.getters.success }
      }
    },
    watch: {
      name () {
        this.errorMessages = ''
      },
      error(value) {
        const error = value
        this.loading = false
        this.errorObj = true
        this.alert = false
        this.errorMessage = error.message
      },
      load(value) {
        this.alert = true
        this.loading = false
        this.successDone = true
        this.resetForm()
      },
      success (value) {
        if (value) {
          this.alert = true
          this.errorObj = false
          this.message = 'Please check your email to reset password.'
          this.loading = false
        }
      }    
    },
    methods: {
      addressCheck () {
        this.errorMessages = this.address && !this.name
          ? 'Hey! I\'m required'
          : ''

        return true
      },
      emailCheck (value) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)
      },      
      resetForm () {
        this.errorMessages = []
        this.formHasErrors = false

        Object.keys(this.form).forEach(f => {
          this.$refs[f].reset()
        })
      },
      submit () {
        this.formHasErrors = false

        const validation = Object.keys(this.form).map(f => {
          if (!this.form[f]) this.formHasErrors = true
          return this.$refs[f].validate(true)
        })
 
        const validated = validation.includes(false)
        console.log(validated)
        if (!validated) {
          console.log(this.form)
          this.loading = true
          this.$store.dispatch("requestEamilReset", this.form);
        }
      }
    }
}
</script>