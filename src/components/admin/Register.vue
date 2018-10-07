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
						<h1 class="headline mb-3 text-xs-left">Register users</h1>
					</v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap mt-3>         
        	<v-flex d-flex xs12 sm10 offset-sm1>
            <v-card>
              <v-card-title>              
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
                :items="resgisterObj"
                :search="search"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.name }}</td>
                  <td class="text-xs-left">{{ props.item.email }}</td>                  
                  <td class="text-xs-left">{{ props.item.address }}</td>
                  <td class="text-xs-left">{{ props.item.timecreated.seconds|timestamptotime }}</td>
                  <td class="justify-end layout px-0  mr-2">
										<v-btn flat icon color="blue lighten-2" @click="showJoinForm(props.item), dialog = true">
											<v-icon>message</v-icon>
										</v-btn>	
                  </td> 
                  <td class="text-xs-left"> 									
                    <v-btn 
                    :color="props.item.approval === false ? 'orange darken-3' : 'green'" 
                    @click="register(props.item.email, props.item.id, props.item.approval)" 
                    dark
                    >{{ props.item.approval === true ? 'Register' : 'Unregister' }}
                      <v-icon dark right>check_circle</v-icon>
                    </v-btn> 
                  </td> 
                  <td class="text-xs-left"> 	                   
                    <v-btn color="red darken-1" class="white--text" @click="deleteJoin(props.item.id)">
											Delete  <v-icon right>delete_forever</v-icon>
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
        <v-card-title primary-title>
          <div>
            <h3 class="text-xs-left headline mb-0">{{ joinName }}</h3>
						<div class="text-xs-left">{{ joinEmail }}</div>
						<div class="text-xs-left">{{ joinPhone }}</div>
						<div class="text-xs-left">{{ joinAddress }}, {{ joinCity }}, {{ joinState }}, {{ joinCountry }}, {{ joinZip }}</div>
            <div class="text-xs-left">{{ joinMessage }}</div>
						<div class="text-xs-left">Sent: {{ joinTimeCreated.seconds|timestamptotime }}</div>
          </div>
        </v-card-title>				
        <v-card-actions>
					<v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog=false">Close</v-btn>        
        </v-card-actions>
      </v-card>
    </v-dialog>   		
  </v-app>           
</template>

<script>
import AdminToolbar from "@/components/oscomponents/layout/AdminToolbar";
import * as firebase from "firebase";

export default {
  components: { AdminToolbar },
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
            { text: 'Email', value: 'email' },
            { text: 'Address', value: 'addresst' },
            { text: 'Time sent', value: 'timesent' },
          ],
        hover: true,
        dialog: false,
        joinName: '',
        joinMessage: '',
        joinEmail: '',
        joinPhone: '',
        joinAddress: '',
        joinCity: '',
        joinState: '',
        joinCountry: '',
        joinZip: '',
        joinTimeCreated: '',
        resgisterObj: []
      };
  },
  mounted() {
    this.$store.dispatch("getAllRegistrationRequest")
  },
  computed: {
    registers() {
      return this.$store.getters.loadAllRegistrationRequest
    }
  },
  watch: {
    registers(value) {
      this.resgisterObj = value
    }
  },
  methods: {
		register (valueEmail,valueId, registered) {
      if (!registered) {
        const data = {
          email: valueEmail,
          id: valueId
        }
        this.$store.dispatch("registrationUser", data)
      } 
		},
		showJoinForm(value) {
			this.joinName = value.name
			this.joinMessage = value.message
			this.joinEmail = value.email
			this.joinPhone = value.phone
      this.joinAddress = value.address
      this.joinCity = value.join
      this.joinState = value.state
      this.joinCountry = value.country
      this.joinZip = value.zip
			this.joinTimeCreated = value.timecreated
    },
    deleteJoin(a) {
      const local = this
      const joinData = {
        id: a
      }
      function imageToDelete () {
        local.$store.dispatch("deleteRegistrationForm", joinData)
      }
      confirm('Are you sure you want to delete this user?') && imageToDelete()
    }
  },
  filters: {
    timestamptotime: function Unix_timestamp(t)
    {
      // Unixtimestamp
      const unixtimestamp = t;

      // Months array
      const months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

      // Convert timestamp to milliseconds
      const date = new Date(unixtimestamp*1000);

      // Year
      const year = date.getFullYear();

      // Month
      const month = months_arr[date.getMonth()];

      // Day
      const day = date.getDate();

      // Hours
      const hours = date.getHours();

      // Minutes
      const minutes = "0" + date.getMinutes();

      // Seconds
      const seconds = "0" + date.getSeconds();

      // Display date time in MM-dd-yyyy h:m:s format
      const convdataTime = day+'-'+month+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
      return convdataTime;
    }
  }  
};
</script>