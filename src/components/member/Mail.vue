<template>
  <v-app>
  <member-toolbar></member-toolbar> 
    <v-content>
      <v-container grid-list-md>
        <v-layout row wrap>
          <v-flex d-flex xs12>
            <v-btn
              absolute
              right
              color="orange darken-3 white--text"
              to="member" 
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
          <v-flex d-flex xs12>
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
                  <td class="text-xs-left truncate">{{ props.item.message }}</td>
                  <td class="text-xs-left">{{ props.item.timesent.seconds|timeformat }}</td>                  
                  <td class="justify-start layout px-0  mr-2">
                    <v-btn 
                      :color="props.item.seen === true ? 'green darken-1' : 'green darken-4'" 
                      flat
                      dark
                      :to="{name: 'Member view mail', params: { id: props.item.id }}"
                    >View mail
                      <v-icon dark right v-if="props.item.seen === true">visibility</v-icon>
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
  </v-app>           
</template>

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import * as firebase from "firebase";

export default {
  components: { MemberToolbar },
  mounted () {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('getSpecificMails')
      }
    })
  },
  computed: {
    mails () {
      return this.$store.getters.loadAllMails
    }
  },
  watch: {
    mails (value) {
      const userId = firebase.auth().currentUser
      this.mailObj = value.filter(obj => {return obj.recipient === userId.uid})
    }
  },  
  data:  function () {
    return {
      search: '',
      mailObj: [],
      headers: [
            {
              text: 'Sender',
              align: 'left',
              sortable: false,
              value: 'sender'
            },
            { text: 'Message', sortable: false, value: 'message' },
            { text: 'Time sent', value: 'timesent' },
          ],
      hover: true,
      dialog: false,
      messageRecipient: '',
      sendTo: '',
      sendtoText: ''
      };
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
}
</script>