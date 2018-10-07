<template>
  <div class="home">
    <full-page-carousel
      :sitetitle="sitetitle"
      :titlefirst="titlefirst"
      :titlesecond="titlesecond"
      :titlethird="titlethird"
      :loadCarousel="loadCarouselObj"
    ></full-page-carousel>
    <v-layout row wrap justify-center pt-3>
      <v-flex v-for="card in featured" :key="card.id" xs12 sm10 md8 lg3 ma-1>
        <featured
          :link="card.id"
          :src="card.image.profile"
          :name="card.name" 
          :category="card.cuisinecountry"
          :author="card.address.full"
        >
        </featured>
      </v-flex>
    </v-layout> 
    <subscriber-form></subscriber-form>
    <app-footer></app-footer>
  </div>
</template>

<script>
import SubscriberForm from '@/components/oscomponents/form/SubscriberForm.vue'
import FullPageCarousel from '@/components/oscomponents/layout/FullPageCarousel.vue'
import Featured from '@/components/oscomponents/component/Featured.vue'
import AppFooter from '@/components/oscomponents/layout/AppFooter.vue'

export default {
  name: 'home',
  components: {
    FullPageCarousel, AppFooter, SubscriberForm, Featured,
  },
  data () {
    return {
      sitetitle: 'Afrofoodmat',
      titlefirst: 'Find',
      titlesecond: ' African Restaurants',
      titlethird: 'close to you.',
      loadCarouselObj: [],
      featured: []
    }
  },
  created() {
    this.$store.dispatch("fetchCarouselImage")
    this.$store.dispatch('getFeaturedRestaurant')
  },
  computed: {
    loadCarousel () {
      return this.$store.getters.loadCarouselImages
    },
    loadFeaturedRestaurant () {
      return this.$store.getters.loadThisRestaurantResult
    }
  },
  watch: {
    loadCarousel (value) {
      this.loadCarouselObj = value
    },
    loadFeaturedRestaurant (value) {
      this.featured = value
    }    
  }
}
</script>
