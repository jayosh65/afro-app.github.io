<template>
  <v-app>
    <toolbar></toolbar>
    <v-content>
      <v-container fluid fill-height pa-0>
        <v-layout align-center justify-center image-cover :style="{ backgroundImage: `url('${src[0] !== undefined ? src[0].path : null}')` }">
          <v-flex xs12 sm8 md4>
          <v-card ref="form">
            <v-toolbar dark color="orange darken-3">
              <v-toolbar-title>Contact us</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-tooltip bottom>
                <span>Source</span>
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
                  Message <small>(Please send type your message here.)</small>
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
              <v-btn color="orange darken-3 white--text" @click="submit">Submit</v-btn>
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
import Toolbar from '@/components/oscomponents/layout/Toolbar.vue'
import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'

export default {
  name: 'Contact',
  components: {
    Toolbar, AppFooter
  },
  data: () => ({
      errorMessages: '',
      name: null,
      phone: null,
      email: '',
      message: '',
      formHasErrors: false,
      src: ''
    }),
    mounted () {
      this.$store.dispatch("loadPageImage")
    },
    computed: {
      form () {
        return {
          name: this.name,
          phone: this.phone,
          email: this.email,
          message: this.message,
        }
      },
      images() {
        return this.$store.getters.loadCarouselImages
      }
    },
    watch: {
      name () {
        this.errorMessages = ''
      },
      images(value) {
        const result = value.filter(obj =>{return obj.category === 'Contact page'})
        this.src = result
      } 
    },
    methods: {
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
        if (!validated) {
          this.$store.dispatch("sendContactForm", this.form);
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