<template>
  <v-app>
    <member-toolbar></member-toolbar> 
    <v-content>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <v-flex xs12>
            <v-btn
              absolute
              right
              color="orange darken-3 white--text"
              to="/member-mail" 
            >
              back
            </v-btn>
          </v-flex>           
					<v-flex d-flex xs12 sm10 offset-sm1>
						<h1 class="headline mb-3 text-xs-left">Email</h1>
					</v-flex>          
          <v-flex 
            d-flex xs12 sm10 offset-sm1
            v-for="(mail,i) in loadMailObj" 
            :key="i"
          >
            <v-card>
              <v-card-title primary-title class="mb-0 pb-0">
                <div class="headline mt-0 pt-0">Unlimited music now</div>
                <v-spacer></v-spacer>
                <div>{{ mail.timesent.seconds|timestamptotime }}</div>
              </v-card-title>
              <v-card-title class="mb-0 pb-0">
                <div>{{ mail.message }}</div>
              </v-card-title>              
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn flat color="blue darken-2" @click="dialog = !dialog,loadReplyMailer(mail.id, mail.sender)">reply to<v-icon color="blue darken-2" right>reply</v-icon></v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content> 
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          Reply to {{ sender}}
        </v-card-title>
        <v-card-text>
          <v-flex xs12>
            <v-textarea
              v-model="replytoText"
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
          <v-btn 
            color="error"
            :loading="loadingm"
            @click="replyTo(),loader = 'loadingm'" 
            >
            Send
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>    
  </v-app>           
</template>

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import * as firebase from "firebase"

export default {
    components: { MemberToolbar },
    data () {
      return {
        dialog: false,
        sendtoText: '',
        replytoText: '',
        sender: '',
        loadMailObj: '',
        loadingm: false,
      }
    }, 
    created () {
      const mailId = this.$route.params.id
      const usermail  = this.$store.getters.loadAllMails
      const savedmail  = JSON.parse(this.$store.getters.loadSavedMails)
      if (usermail.length > 0) {
        let filterMail = usermail.filter(obj => {return obj.id === mailId || obj.mailGroup === mailId})
        this.loadMailObj = filterMail
      } else if (savedmail.length > 0) {
        let filterMail = savedmail.filter(obj => {return obj.id === mailId || obj.mailGroup === mailId})
        this.loadMailObj = filterMail
      } else {
        this.$store.dispatch("getSpecificMails")
      }
    },
    mounted () {
      const mailId = this.$route.params.id
      const userId = firebase.auth().currentUser
      if (userId.uid) {
        const recipient = this.loadMailObj
          .filter(obj => {return obj.recipient === userId.uid && obj.seen !== true})
          .filter(obj => {return obj.id === mailId || obj.mailGroup === mailId})
          .map(obj => {if (obj.seen !== true) { return obj.id}})
        if (recipient.length > 0) {
          this.$store.dispatch("mailSeen", recipient)
        }
      }
    },   
    computed: {
      loadMail () {
        return this.$store.getters.loadAllMails
      },
      mailSent () {
        return this.$store.getters.success      
      }
    },
    watch: {
      loadMail (value) {
        const mailId = this.$route.params.id
        this.loadMailObj = value.filter(obj => {return obj.id === mailId || obj.mailGroup === mailId})
      },
      mailSent (value) {
        if (value) {
          this.loadingm = false
          this.sendtoText = ''
          this.replytoText =''
          this.sender = ''    
        }  
      }
    },      
    methods: {
      loadReplyMailer (valueId,valueSender) {
        this.sendtoText = valueId
        this.sender = valueSender
      },
      replyTo(value) {
        this.loadingm = true
        const replyToMessage = {
          recipient: this.sender,
          message: this.replytoText,
          mailGroup: this.$route.params.id,
          seen: false
        }
        this.$store.dispatch('sendMessageToMember', replyToMessage)
      }
    } ,
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
}
</script>