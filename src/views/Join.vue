<template>
  <v-app>
    <toolbar></toolbar>
    <join-form></join-form>
    <app-footer></app-footer>
  </v-app>
</template>

<script>
import Toolbar from '@/components/oscomponents/layout/Toolbar.vue'
import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'
import JoinForm from '@/components/oscomponents/form/JoinForm.vue'

export default {
  name: 'home',
  components: {
    Toolbar, AppFooter, JoinForm
  },
  data () {
    return {
    }
  }
}
</script>