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
					<v-flex d-flex>
						<h1 class="headline mb-3 text-xs-left">Email</h1>
					</v-flex> 
        </v-layout>
        <v-divider></v-divider>
        <v-layout row wrap mt-3>         
          <v-flex d-flex xs12 sm10 offset-sm1>
            <v-card>
              <v-card-title>
                Members mail
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
                :items="mailObj"
                :search="search"
              >
                <template slot="items" slot-scope="props">
                  <td class="text-xs-left">{{ props.item.sender }}</td>
                  <td class="text-xs-left">{{ props.item.timesent.seconds|timeformat }}</td>                  
                 <!--  <td class="text-xs-left">{{ props.item.address.full }}</td>
                  <td class="text-xs-left">{{ props.item.timecreated.seconds|timeformat }}</td> -->
                  <td class="justify-start layout px-0  mr-2">
                    <v-btn 
                      :color="props.item.seen === true ? 'green darken-1' : 'green darken-4'" 
                      flat
                      dark
                      :to="{name: 'Admin view mail', params: { id: props.item.id }}"
                    >View mail
                      <v-icon dark right  v-if="props.item.seen === true">visibility</v-icon>
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
          <!-- Send message to {{ messageRecipient }} -->
        </v-card-title>
        <v-card-text>
          <v-flex xs12>
            <v-textarea
              v-model="sendtoText"
              color="teal"
            >
              <div slot="label">
                Bio <small>(optional)</small>
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
              text: 'Sender',
              align: 'left',
              sortable: false,
              value: 'sender'
            },
            { text: 'Time sent', value: 'timesent' },
            // { text: 'Address', value: 'addresst' },
            // { text: 'Posted', value: 'posted' },
            // { text: 'Action', value: 'action' }
          ],
      hover: true,
      dialog: false,
      messageRecipient: '',
      sendTo: '',
      sendtoText: '',
      mailObj: []
      };
  },
  mounted() {
    this.$store.dispatch("getAdminMail")
  },
  computed: {
    mails() {
      // this.restaurants = this.$store.getters.loadAllRestaurants
      return this.$store.getters.loadAllMails;
    }
  },
  watch: {
    mails(value) {
      console.log(value)
      if (value.length > 0) {
        this.mailObj = value
      }
    }
  },
  methods: {
    approve (value, value2) {
      const approve = !value2
      const data = {
        id: value,
        approve: approve
      }
      console.log(data)
      this.$store.dispatch("restaurantApproval", data)
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