import store from '@/store'

export default (to, from, next) => {
  if (store.getters.user || store.getters.userLoggedIn) {
    next()
  } else {
    next('/sign-in')
  }
}