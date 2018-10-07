<template>
  <v-app>
    <member-toolbar :username="profileName"></member-toolbar>
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12 >
						<h1 v-if="profileName" class="headline mb-3 text-xs-left">Welcome {{ profileName }}</h1>
            <v-spacer></v-spacer>
            <div class="text-xs-right">
              <v-btn icon color="grey lighten-4" @click.stop="dialogChangeInfo = true">
                <v-icon>settings</v-icon>
              </v-btn>
            </div>
					</v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap mt-3>
          <v-flex d-flex xs12 sm6 md4>
            <v-card>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text">Total Restaurant created</v-card-title>
              <v-card-text class="caption py-1 px-2 text-uppercase orange darken-3 white--text">
                <v-layout class="pa-0" row>
                  <v-flex xs7>
                    <v-card-title primary-title class="pa-0">
                      <v-layout class="py-2">
                        <span class="group pa-2 left">
                          <v-icon x-large class="white--text">info</v-icon>
                        </span>
                      </v-layout>
                    </v-card-title>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-title primary-title class="py-2 justify-end">
                      <div class="display-1 text-right">{{ restaurantCount }}</div>
                    </v-card-title>
                  </v-flex>
                </v-layout>               
              </v-card-text>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text">View more...</v-card-title>
            </v-card>
          </v-flex>
          <v-flex d-flex xs12 sm6 md4>
            <v-card>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text">Restaurant approved</v-card-title>
              <v-card-text class="caption py-1 px-2 text-uppercase orange darken-3 white--text">
                <v-layout class="pa-0" row>
                  <v-flex xs7>
                    <v-card-title primary-title class="pa-0">
                      <v-layout class="py-2">
                        <span class="group pa-2 left">
                          <v-icon x-large class="white--text">info</v-icon>
                        </span>
                      </v-layout>
                    </v-card-title>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-title primary-title class="py-2 justify-end">
                      <div class="display-1 text-right">{{ restaurantApproved }}</div>
                    </v-card-title>
                  </v-flex>
                </v-layout>               
              </v-card-text>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text">View more...</v-card-title>
            </v-card>
          </v-flex>
          <v-flex d-flex xs12 sm6 md4>
            <router-link :to="{name: 'Member mails'}" style="text-decoration-line: none;" >
            <v-card>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text">Total Messages</v-card-title>
              <v-card-text class="caption py-1 px-2 text-uppercase orange darken-3 white--text">
                <v-layout class="pa-0" row>
                  <v-flex xs7>
                    <v-card-title primary-title class="pa-0">
                      <v-layout class="py-2">
                        <span class="group pa-2 left">
                          <v-icon x-large class="white--text">mail_outline</v-icon>
                        </span>
                      </v-layout>
                    </v-card-title>
                  </v-flex>
                  <v-flex xs5>
                    <v-card-title primary-title class="py-2 justify-end">
                      <div class="display-1 text-right">{{ mailCount }}</div>
                    </v-card-title>
                  </v-flex>
                </v-layout>               
              </v-card-text>
              <v-card-title class="caption py-1 px-2 text-uppercase orange darken-1 white--text"> {{ mailUnreadCount }} Unread</v-card-title>
            </v-card>
            </router-link>
          </v-flex>

            <!-- <v-layout row wrap>
              <v-flex d-flex> -->
                <!-- <v-layout row wrap>
                  <v-flex
                    d-flex
                    xs12
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                    >
                      <v-card-text>
                        <div class="display-1 text-md-center font-weight-bold">{{ restaurantCount }}</div>
                        <div class="text-md-center">Restaurant created</div>
                      </v-card-text>                    
                    </v-card>
                  </v-flex> -->
                  <!-- <v-flex
                    d-flex
                    xs12
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                    >
                      <v-card-text>
                        <div class="display-1 text-md-center font-weight-bold">{{ restaurantNotApproved }}</div>
                        <div class="text-md-center">Restaurant not approved</div>
                      </v-card-text> 
                    </v-card>
                  </v-flex> -->
                <!-- </v-layout>
              </v-flex> -->
            <!-- </v-layout>
          </v-flex>
         <v-flex d-flex xs12 sm6 md3>
            <v-layout row wrap>
              <v-flex d-flex>
                <v-layout row wrap>
                  <v-flex
                    d-flex
                    xs12
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                    >
                      <v-card-text>
                        <div class="display-1 text-md-center font-weight-bold">{{ restaurantCount }}</div>
                        <div class="text-md-center">Restaurant created</div>
                      </v-card-text>                    
                    </v-card>
                  </v-flex>
                  <v-flex
                    d-flex
                    xs12
                  >
                    <v-card
                      color="red lighten-2"
                      dark
                    >
                      <v-card-text>
                        <div class="display-1 text-md-center font-weight-bold">{{ restaurantApproved }}</div>
                        <div class="text-md-center">Restaurant approved</div>
                      </v-card-text> 
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-flex>
            </v-layout>
          </v-flex>
          <v-flex d-flex xs12 sm6 md2 child-flex>
              <v-card color="green lighten-2" dark>
                <v-card-text>{{ lorem.slice(0, 90) }}</v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex xs12 sm6 md4>
              <v-card color="blue lighten-2" dark>
                <v-card-text>{{ lorem.slice(0, 100) }}</v-card-text>
              </v-card> -->
        </v-layout>
      </v-container> 

      <v-container fluid> 
        <v-layout row wrap> 
          <v-flex d-flex xs12 md8 pr-1 mb-3>
          <div>
            <v-toolbar flat>
              <v-btn icon>
                <v-icon>list_alt</v-icon>
              </v-btn>
              <v-toolbar-title class="ml-0 subheading">Restaurant listing</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>

            <v-data-table
                :headers="headers"
                :items="restaurantObj"
                hide-actions
                class="elevation-1"
            >
              <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.address.full }}</td>
                  <td class="justify-start pl-0">
                    <v-btn flat :color="props.item.approve === true ? 'green darken-2' : ''">
                      <v-icon dark>{{ props.item.approve === true ? 'check_circle' : '' }}</v-icon>
                    </v-btn>
                  </td>
                  <td class="text-xs-left">{{ props.item.timecreated.seconds|timeformat }}</td>
                  <td class="justify-start pl-0">
                    <v-btn color="green darken-3" :to="{name: 'Member Restaurant', params: { id: props.item.id, carddata: props.item}}" flat small dark>
                      <v-icon
                        class="mr-2"
                      >
                        visibility
                      </v-icon>
                    </v-btn>
                  </td>
                  <td class="justify-center px-0">
                    <v-icon
                      small
                      color="orange darken-3"
                      @click="deleteRestaurant(props.item.id)"
                    >
                      delete
                    </v-icon>
                  </td>
                </template>
              </v-data-table>
            </div>          
          </v-flex> 
          <v-flex d-flex xs12 md4 pl-1>
            <div>
              <v-toolbar flat>
                <v-btn icon>
                  <v-icon>email</v-icon>
                </v-btn>
                <v-toolbar-title class="ml-0 subheading">Mail unread</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-data-table
                :headers="Mailheaders"
                :items="mailObj"
                hide-actions
                class="elevation-1"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.sender }}</td>
                  <td class="text-xs-left truncate">{{ props.item.message }}</td>
                  <td class="text-xs-left">{{ props.item.timesent.seconds|timeformat }}</td>                  
                  <td class="justify-start layout px-0  mr-2">
                    <v-btn 
                      :color="props.item.seen === true ? 'green darken-1' : 'green darken-4'" 
                      flat
                      dark
                      :to="{name: 'Member view mail', params: { id: props.item.id }}"
                    >
                      <v-icon dark right v-if="props.item.seen === true">visibility</v-icon>
                    </v-btn>
                  </td>                  
                </template>
              </v-data-table>
            </div>  
          </v-flex>
        </v-layout>
      </v-container> 
      
      
      <v-container
        fluid
        grid-list-md
      >
          <v-layout row wrap>
            <!-- <v-flex
              v-for="card in restaurantObj"
              xs12 sm6 md4
              :key="card.id"
            >
              <v-card hover>
                <router-link :to="{name: 'Member Restaurant', params: { id: card.id, carddata: card}}" style="text-decoration: none;">
                <v-img
                  v-if="card.image.profile"
                  :src="card ? card.image.profile : './placeholder-image.png'"
                  height="200px"
                >
                </v-img>
                <v-img
                  v-else
                  :src="card ? card.image.profile : './placeholder-image.png'"
                  height="200px"
                >
                </v-img>
                </router-link>
                <v-card-actions>
                  <span class="headline white--text orange darken-3 truncate pa-2"  v-text="card.name"></span>
                  <v-btn flat :color="card.approve === true ? 'green darken-2' : ''">
                      <v-icon dark>{{ card.approve === true ? 'check_circle' : '' }}</v-icon>
                  </v-btn>
                  <v-spacer></v-spacer>                  
                  <v-btn color="orange darken-3" :to="{name: 'Member Restaurant', params: { id: card.id, carddata: card}}" fab small dark>
                    <v-icon>edit</v-icon>
                  </v-btn>                 
                  <v-btn color="grey lighten-1" @click="deleteRestaurant(card.id)" fab small dark>
                    <v-icon>delete</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-flex> -->
            <v-fab-transition>
              <v-btn
                color="orange darken-3 white--text"
                fab
                fixed
                bottom
                right
                @click.stop="dialog = true"
              >
                <v-icon>add</v-icon>
              </v-btn>
              </v-fab-transition>
              <v-dialog v-model="dialog" max-width="50vw" scrollable persistent>
                <add-restaurant-form></add-restaurant-form>
                <v-fab-transition>
                  <v-btn 
                    fab
                    small
                    color="white"
                    class="mt-5"
                    top
                    right
                    absolute
                    @click.native="dialog = false"
                  >
                    <v-icon>close</v-icon>
                  </v-btn>             
                </v-fab-transition>
              </v-dialog>
              <v-dialog v-model="dialogChangeInfo" max-width="50vw" scrollable persistent>
                <v-fab-transition>
                  <v-btn 
                    fab
                    small
                    color="white"
                    class="mt-5"
                    top
                    right
                    absolute
                    @click.native="dialogChangeInfo = false"
                  >
                    <v-icon>close</v-icon>
                  </v-btn>             
                </v-fab-transition>
              </v-dialog>
          </v-layout>
        </v-container>
    </v-content> 
  </v-app>           
</template>

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import AddRestaurantForm from "@/components/oscomponents/form/AddRestaurant"
import * as firebase from "firebase"

export default {
  components: { MemberToolbar, AddRestaurantForm },
  data: () => ({
    lorem: `Lorem ipsum dolor sit amet, mel at clita quando. Te sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`,
    dialog: false,
    dialog3: false,
    restaurantObj: [],
    restaurantCount: 0,
    restaurantApproved: 0,
    restaurantNotApproved: 0,
    profileName: '',
    dialogChangeInfo: false,
    headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Address', value: 'address' },
        { text: 'Approve', value: 'approve', sortable: true},
        { text: 'Date created', value: 'created', sortable: true},
        { text: 'View', value: 'view', sortable: false },
        { text: 'Actions', value: 'name', sortable: false }
      ],
    Mailheaders: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Messages', value: 'message' },
        { text: 'Time', value: 'time', sortable: true},
        { text: 'View', value: 'view', sortable: false }
      ],
    mailObj: [],
    mailCount: 0,
    mailUnreadCount: 0
  }),
  mounted () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {       
        const userProfile = this.$store.getters.userLoggedIn ? this.$store.getters.userLoggedIn : null
        if (userProfile !== '') {
          this.$store.dispatch("fetchAllUsersRestaurants", user.uid)
          this.$store.dispatch('getSpecificMails')
          this.$router.push({ path: "member" })

          if (user.displayName !== null) {
            this.profileName = user.displayName
          } else {

          }
          console.log('profile')
          console.log(userProfile)
        } else {
          console.log('no profile')
        }

      }
    })
  },
  computed: {
    restaurants () {
      return this.$store.getters.loadRestaurants
    },
    mails () {
      return this.$store.getters.loadAllMails
    }
  },
  watch: {
    restaurants (values) {
      const user = this.$store.getters.user
      const userId = firebase.auth().currentUser
      const isUserLockedIn = this.$store.getters.userLoggedIn
      if (userId.uid === user.id) {
        this.restaurantObj = values
        this.restaurantCount = values ? values.length : 0
        const isApproveCount = values.filter(obj => {return obj.approve === true})
        this.restaurantApproved = isApproveCount ? isApproveCount.length : 0
        const notApproveCount = values.filter(obj => {return obj.approve !== true})
        this.restaurantNotApproved = this.notApproveCount ? this.notApproveCount.length : 0     
      }
    },
    mails (value) {
      const user = this.$store.getters.user
      const userId = firebase.auth().currentUser
      const isUserLockedIn = this.$store.getters.userLoggedIn
      if (userId.uid === user.id) {
        this.mailCount = value ? value.length : 0
        const mailUnread = value.filter(obj => {return obj.seen === false})
        this.mailUnreadCount = mailUnread ? mailUnread.length : 0
        this.mailObj = value.filter(obj => {return obj.recipient === userId.uid})
      }

      // 
      //   
      //   // const mailCount = values.filter(obj => {return obj.approve === true})
      //   // this.restaurantApproved = isApproveCount ? isApproveCount.length : 0
      //   this.mailObj = value.filter(obj => {return obj.recipient === userId.uid})
      // }
    }
  },
  methods: {
    deleteRestaurant (value) {
      if (confirm("Do you want to delete this listing!")) {
        this.$store.dispatch("deleteUserRestaurant", value);
      }     
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
