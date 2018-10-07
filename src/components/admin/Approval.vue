<template>
  <v-app>
    <admin-toolbar></admin-toolbar>
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <v-btn
              absolute
              right
              color="orange darken-3 white--text"
              to="/admin" 
            >
              back
            </v-btn>
          </v-flex> 
					<v-flex d-flex xs12>
						<h1 class="headline mb-3 text-xs-left">Restaurant waiting for approval</h1>
					</v-flex>  
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap mt-3>          
          <v-flex d-flex xs12 sm10 offset-sm1>
            <v-card>
              <v-card-title>
                Restaurants
                <v-spacer></v-spacer>
                <v-text-field
                  v-model="search"
                  append-icon="search"
                  label="Search"
                  single-line
                  hide-details
                ></v-text-field>
              </v-card-title>
              <v-data-table
                :headers="headers"
                :items="restaurantObj"
                :search="search"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.cuisinecountry }}</td>                  
                  <td class="text-xs-left">{{ props.item.address.full }}</td>
                  <td class="text-xs-left">{{ props.item.timecreated.seconds|timeformat }}</td>
                  <td class="text-xs-left">
                    <v-btn flat @click="dialogcheck = true, checkRestaurant(props.item)"><v-icon dark right>visibility</v-icon></v-btn>
                  </td>
                  <td class="text-xs-left">
                    <v-btn 
                    flat 
                    :color="props.item.feature === true ? 'green' : 'amber accent-5'" 
                    @click="feature(props.item.id, props.item.feature)" 
                    dark
                    >
                      <v-icon dark>{{ props.item.feature === true ? 'star' : '' }}</v-icon>
                    </v-btn>
                  </td> 
                  <td class="text-xs-left">
                    <v-btn 
                    :color="props.item.approve === true ? 'green' : 'amber accent-5'" 
                    @click="approve(props.item.id, props.item.approve)" 
                    dark
                    >{{ props.item.approve === true ? 'Approved' : 'Unapproved' }}
                      <v-icon dark right>{{ props.item.approve === true ? 'check_circle' : 'query_builder' }}</v-icon>
                    </v-btn>
                  </td> 
                  <td class="text-xs-left">  
                    <v-btn color="green darken-2" @click="sendMessage(props.item.id, props.item.userid), dialog = true" dark>Send mail
                      <v-icon dark right>contact_mail</v-icon>
                    </v-btn>                    
                  </td>                  
                </template>
                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                  Your search for "{{ search }}" found no results.
                </v-alert>
              </v-data-table>
            </v-card> 
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Send message to {{ messageRecipient }}
        </v-card-title>
        <v-card-text class="py-0">
          <v-flex xs12>
            <v-textarea
              v-model="sendtoText"
              color="teal"
            >
              <div slot="label">
                <small>Message</small>
              </div>
            </v-textarea>
          </v-flex>    
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" flat @click="dialog=false">Close</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="sendMessageTo(sendTo)" >Send</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 
    <v-dialog v-model="dialogcheck">
      <restaurant-display v-if="showRes" :thisRestaurant="restaurant"></restaurant-display> 
        <v-fab-transition>
          <v-btn 
            fab
            small
            color="white"
            class="mt-5"
            top
            right
            absolute
            @click.native="dialogcheck = false"
          >
            <v-icon>close</v-icon>
          </v-btn>             
        </v-fab-transition>    
    </v-dialog>   
  </v-app>           
</template>

<script>
import AdminToolbar from "@/components/oscomponents/layout/AdminToolbar"
import * as firebase from "firebase"
import RestaurantDisplay from '@/components/oscomponents/component/RestaurantDisplay'

export default {
  components: { AdminToolbar, RestaurantDisplay },
  data:  function () {
    return {
      search: '',
      headers: [
            {
              text: 'Name',
              align: 'left',
              sortable: false,
              value: 'name'
            },
            { text: 'Cuisine', value: 'cuisine' },
            { text: 'Address', value: 'addresst' },
            { text: 'Posted', value: 'posted' },
            { text: 'View restaurant', value: 'seen' },
            { text: 'Feature restaurant', value: 'feature' },
            { text: 'Approval', value: 'approval' },
            { text: 'Message', value: 'message' }
          ],
      hover: true,
      dialog: false,
      messageRecipient: '',
      sendTo: '',
      sendtoText: '',
      dialogcheck: false,
      restaurant: '',
      restaurantObj: [],
      showRes: false
    }
  },
  mounted() {
    this.$store.dispatch("getAllRestaurants")
  },
  computed: {
    restaurants () {
      return this.$store.getters.loadAllRestaurants
    }
  },
  watch: {
    restaurants (value) {
      this.restaurantObj = value
    }
  },
  methods: {
    approve (value, value2) {
      let approve = !value2
      const data = {
        id: value,
        approve: approve
      }
      this.$store.dispatch("restaurantApproval", data)
    },
    feature (value, value2) {
      let feature = !value2
      const data = {
        id: value,
        feature: feature
      }
      this.$store.dispatch("restaurantFeature", data)
    },
    sendMessage (value, userId) {
      this.messageRecipient = userId
      this.sendTo = userId
    },
    sendMessageTo (value) {
      console.log(value)
      if (value)
      {
        const message = {
          id: value,
          message: this.sendtoText
        } 
        this.$store.dispatch("sendMessageToMember", message)
      }
    },
    checkRestaurant(value) {
      this.showRes = true
      const res = this.$store.getters.loadAllRestaurants.filter(obj => {return obj.id === value.id})
      this.restaurant = {...res[0]}
    }
  },
  filters: {
    timeformat: function (value) {
      if (!value) return ''
      const currenttime = Date.now() / 1000
      const timeDiff = currenttime - value
      let valueResult
      switch (true)
      {
        case (timeDiff <= 3599):
          valueResult = `${(timeDiff / 60).toFixed(0)} minutes ago`
          break;
        case (timeDiff >=3600 && timeDiff <= 86399):
          valueResult = `${(timeDiff / 3600).toFixed(0)} hours ago`
          break; 
        case (timeDiff >= 86399):
          valueResult = `${(timeDiff / 86399).toFixed(0)} days ago`
          break; 
      }
      return valueResult
    }
  } 
};
</script>