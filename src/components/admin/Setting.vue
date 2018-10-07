<template>
  <v-app>
    <admin-toolbar></admin-toolbar>
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
					<v-flex d-flex xs12 sm10 offset-sm1>
						<h1 class="headline mb-3 text-xs-left">Setting</h1>
					</v-flex>          
          <v-flex d-flex xs12 sm10 offset-sm1>
            <v-expansion-panel popout>
              <v-expansion-panel-content
                hide-actions
              >
                <v-layout
                  slot="header"
                  align-center
                  row
                  spacer
                >
                  <v-flex xs4 sm2 md1>
                    <v-avatar
                      slot="activator"
                      size="36px"
                    >
                      <v-icon
                        color="red"
                      >image</v-icon>
                    </v-avatar>
                  </v-flex>

                  <v-flex sm5 md3 hidden-xs-only>
                    <span
                      class="title"
                    >
                      Carousel image
                    </span>
                  </v-flex>
                </v-layout>

                <v-card>
                  <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn class="ma-3" color="primary" to="/admin/image-setting" dark>
                        <v-icon left dark>settings</v-icon>
                        Update image
                      </v-btn>
                    </v-card-actions>
                </v-card>
              </v-expansion-panel-content>

              <v-expansion-panel-content
                hide-actions
              >
                <v-layout
                  slot="header"
                  align-center
                  row
                  spacer
                >
                  <v-flex xs4 sm2 md1>
                    <v-avatar
                      slot="activator"
                      size="36px"
                    >
                      <v-icon
                        color="red"
                      >photo_library</v-icon>
                    </v-avatar>
                  </v-flex>

                  <v-flex sm5 md3 hidden-xs-only>
                    <span
                      class="title"
                    >
                      Page background image
                    </span>
                  </v-flex>
                </v-layout>

                <v-card>
                  <v-divider></v-divider>
                    <v-card-actions>
                      <v-btn class="ma-3" color="primary" to="/admin/background-setting" dark>
                        <v-icon left dark>settings</v-icon>
                        Update image
                      </v-btn>
                    </v-card-actions>
                </v-card>
              </v-expansion-panel-content>
              <v-expansion-panel-content
                hide-actions
              >
                <v-layout
                  slot="header"
                  align-center
                  row
                  spacer
                >
                  <v-flex xs4 sm2 md1>
                    <v-avatar
                      slot="activator"
                      size="36px"
                    >
                      <v-icon
                        color="red"
                      >people</v-icon>
                    </v-avatar>
                  </v-flex>

                  <v-flex sm5 md3 hidden-xs-only>
                    <span
                      class="title"
                    >
                      Social media
                    </span>
                  </v-flex>
                </v-layout>

                <v-card>    
                  <v-divider></v-divider>
                  <v-card-actions>
                    <v-flex xs12 sm4 ml-3 mt-3>
                      <v-select
                        v-model="socialType"
                        :items="socialSelection"
                        label="Social media"
                        solo
                      ></v-select>
                    </v-flex>
                    <v-flex xs12 sm4 mt-3>
                      <v-text-field
                        v-model="socialAddress"
                        label="Enter social media address"
                        solo
                      ></v-text-field>
                    </v-flex>  
                    <v-spacer></v-spacer>                  
                    <v-btn color="primary" @click="addSocial()" fab small dark>
                      <v-icon>add</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
                <v-card v-for="card in socialObj" :key="card.id">
                  <v-divider></v-divider>
                    <v-card-actions>
                      <v-flex xs4 sm2 md1>
                        <v-avatar
                          slot="activator"
                          size="36px"
                        >
                          <v-icon
                            color="red"
                          >{{ card.icon }}</v-icon>
                        </v-avatar>
                      </v-flex>

                      <v-flex sm5 md9 hidden-xs-only>
                        <span
                          class="title"
                        >
                          {{ card.address }}
                        </span>
                      </v-flex>
                      <v-flex sm5 md2 text-xs-right hidden-xs-only>
                        <v-btn icon class="mx-0" @click="deleteSocial(card.id)"><v-icon color="red darken-3">delete</v-icon></v-btn>
                      </v-flex>
                    </v-card-actions>
                </v-card>
              </v-expansion-panel-content>             
            </v-expansion-panel>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
  </v-app>           
</template>

<script>
import AdminToolbar from "@/components/oscomponents/layout/AdminToolbar"
import * as firebase from "firebase"
import RestaurantDisplay from '@/components/oscomponents/component/RestaurantDisplay'

export default {
  components: { AdminToolbar },
  data: () => ({
     socialSelection: ['Facebook', 'Instagram', 'Twitter'],
     socialType: '',
     socialAddress: '',
     socialObj: []
  }),
  mounted () {
    this.$store.dispatch('loadSocial')
  },
  computed: {
    socialAdded () {
      return this.$store.getters.loadSocialSettings
    }
  },
  watch: {
    socialAdded (value) {
      this.socialObj = value
    }
  },
  methods: {
    addSocial () {
      const type = this.socialType
      const address = this.socialAddress

      let value
      if (
        type === 'Facebook' &&
        address !== '' 
      ) {
        value = { type, address, icon: 'public' }
        this.socialAddress = ""
      } else if (
        type === 'Instagram' &&
        address !== ''
      ) {
        value = { type, address, icon: 'share' }
        this.socialAddress = ""
      } else if (
        type === 'Twitter' &&
        address !== ''
      ) {
        value = { type, address, icon: 'thumb_up_alt' }
        this.socialAddress = ''
      } else {
        return
      }
      this.$store.dispatch('addSocial', value)
    },
    deleteSocial (value) {
      const local = this
      function socialToDelete () {
        local.$store.dispatch("deleteSocial", value)
      }
      confirm('Are you sure you want to delete this social information?') && socialToDelete()
    }
  }
}
</script>