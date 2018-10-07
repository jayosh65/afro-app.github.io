<template>
  <v-app>
    <v-layout justify-center image-cover :style="{ backgroundImage: `url('${src[0] !== undefined ? src[0].path : null}')` }">
      <v-flex xs12 sm10 md8 lg4 my-5>
        <v-card ref="form">
          <v-toolbar dark color="orange darken-3">
            <v-toolbar-title>Signup with us</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <span>Signup with us</span>
            </v-tooltip>
          </v-toolbar>  
          <v-card-text>
            <v-text-field
              ref="name"
              v-model="name"
              :rules="[() => !!name || 'This field is required']"
              :error-messages="errorMessages"
              label="Full Name"
              placeholder=""
              required
            ></v-text-field>
            <v-text-field
              ref="address"
              :rules="[
                () => !!address || 'This field is required',
                () => !!address && address.length <= 30 || 'Address must be less than 25 characters',
                addressCheck
              ]"
              v-model="address"
              label="Address Line"
              placeholder=""
              counter="30"
              required
            ></v-text-field>
            <v-text-field
              ref="city"
              :rules="[() => !!city || 'This field is required', addressCheck]"
              v-model="city"
              label="City"
              placeholder=""
              required
            ></v-text-field>
            <v-text-field
              ref="state"
              v-model="state"
              :rules="[() => !!state || 'This field is required']"
              label="State/Province/Region"
              required
              placeholder=""
            ></v-text-field>
            <v-text-field
              ref="zip"
              :rules="[() => !!zip || 'This field is required']"
              v-model="zip"
              label="ZIP / Postal Code"
              required
              placeholder=""
            ></v-text-field>
            <v-autocomplete
              ref="country"
              :rules="[() => !!country || 'This field is required']"
              :items="countries"
              v-model="country"
              label="Country"
              placeholder="Select..."
              required
            ></v-autocomplete>
            <v-text-field
              ref="phone"
              v-model="phone"
              :rules="[() => !!phone || 'This field is required']"
              label="Phone"
              required
              placeholder=""
            ></v-text-field> 
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
            <v-textarea
              ref="message"
              v-model="message"
              :rules="[
                () => !!message || 'This field is required',
                () => !!message && message.length <= 1000 || 'Message must be less than 1000 characters',
              ]"             
              color="indigo darken-2"
            >
              <div slot="label">
                Message <small>(optional)</small>
              </div>
            </v-textarea>                     
          </v-card-text>
          <v-divider class="mt-2"></v-divider>
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
            <v-btn 
              color="orange darken-3 white--text"  
              @click="submit"
              :loading="loading"
              :disabled="loading, successDone"
            >Submit</v-btn>
          </v-card-actions>
        </v-card>
          <v-alert
            v-model="alert"
            dismissible
            color="success"
            outline
          >
            Thank you, message has been sent.
        </v-alert>
      </v-flex>
    </v-layout>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      errorMessages: '',
      name: null,
      address: null,
      city: null,
      state: null,
      zip: null,
      country: null,
      countries: ['Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo-(Republic)', 'Congo-(Democratic)', 'Cote d Ivoire', 'Djibouti', 'Egypt', 'Equatorial Guinea', 'Eritrea', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea', 'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger', 'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Swaziland', 'Tanzania', 'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'],
      phone: null,
      email: '',
      message: '',
      formHasErrors: false,
      errorAlert: false,
      alert: false,
      successDone: true,
      loading: false,
      src: ""
    }),
    mounted () {
      this.$store.dispatch("loadPageImage")
    },
    computed: {
      form () {
        return {
          name: this.name,
          address: this.address,
          city: this.city,
          state: this.state,
          zip: this.zip,
          country: this.country,
          phone: this.phone,
          email: this.email,
          message: this.message,
        }
      },
      error() {
        return { ...this.$store.getters.error }
      },
      load() {
        return { ...this.$store.getters.loading }
      },
      images() {
        return this.$store.getters.loadCarouselImages
      }
    },
    watch: {
      name () {
        this.errorMessages = ''
      },
      error(value) {
        const error = value
        this.loading = false
        this.errorAlert = true
        // this.errorMessage = error.message
      },
      load(value) {
        this.alert = true
        this.loading = false
        this.successDone = true
        this.resetForm()
      },
      images(value) {
        const result = value.filter(obj =>{return obj.category === 'Membership page'})
        this.src = result
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
          this.$store.dispatch("sendRegistrationForm", this.form);
        }
      }
    }
  }
</script>

<style>
.image-cover {
  background-size: cover;
}
</style>