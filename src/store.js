import Vue from 'vue'
import Vuex from 'vuex'

import user from '@/store/user'
import restaurants from '@/store/restaurants'
import form from '@/store/form'
import admin from '@/store/admin'
import locate from '@/store/locate'
import shared from '@/store/shared'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user: user,
    restaurants: restaurants,
    form: form,
    admin: admin,
    locate: locate,
    shared: shared  
  }
})
