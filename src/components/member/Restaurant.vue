<template>
  <v-app>
    <member-toolbar></member-toolbar> 
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12>
            <v-carousel>
              <v-carousel-item
                v-for="(item,i) in resObj.image.gallery"
                :key="i"
                :src="item.path"
              ></v-carousel-item>
              <v-btn
                fab
                small
                color="cyan accent-2"
                class="mt-5"
                top
                right
                absolute
                @click="dialogImageEdit = !dialogImageEdit, loadGalleryImage()"
              >
                <v-icon>edit</v-icon>
              </v-btn>
            </v-carousel>
            <v-card>
              <v-card-title >
                <span class="headline">{{ resObj.name }}</span>
                <v-spacer></v-spacer>
                <v-btn dark icon>
                  <v-icon>chevron_left</v-icon>
                </v-btn>
                <v-btn dark icon>
                  <v-icon>edit</v-icon>
                </v-btn>
                <v-btn dark icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </v-card-title>

                <v-list>
                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon>location_on</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ resObj.address.full }}</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                  <v-divider inset></v-divider>                  
                  <v-list-tile >
                    <v-list-tile-action>
                      <v-icon>restaurant_menu</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>{{ resObj.cuisinecountry }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>

                      <v-icon>chat</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>

                  <v-divider inset></v-divider>

                  <v-list-tile >
                    <v-list-tile-action>
                      <v-icon>phone</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>(323) 555-6789</v-list-tile-title>
                    </v-list-tile-content>

                    <v-list-tile-action>
                      <v-icon>chat</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>

                  <v-divider inset></v-divider>

                  <v-list-tile>
                    <v-list-tile-action>
                      <v-icon>mail</v-icon>
                    </v-list-tile-action>

                    <v-list-tile-content>
                      <v-list-tile-title>mcbeal@example.com</v-list-tile-title>
                    </v-list-tile-content>
                  </v-list-tile>
                </v-list>

                <!-- <v-img
                  src="https://picsum.photos/700?image=996"
                  height="200px"
                ></v-img> -->
              </v-card>

              <v-tabs
                centered
                icons-and-text
                class="mt-4 elevation-2"
              >
                <v-tabs-slider color="yellow"></v-tabs-slider>

                <v-tab href="#tab-1">
                  Info
                  <v-icon>priority_high</v-icon>
                </v-tab>

                <v-tab href="#tab-2">
                  Menu
                  <v-icon>receipt</v-icon>
                </v-tab>

                <v-tab href="#tab-3">
                  Nearby
                  <v-icon>account_box</v-icon>
                </v-tab>

                <v-tab-item
                  v-for="i in 3"
                  :id="'tab-' + i"
                  :key="i"
                >
                  <v-card flat>
                    <v-card-text>{{ resObj.description }}</v-card-text>
                  </v-card>
                </v-tab-item>
              </v-tabs>


            </v-flex>

            <v-dialog v-model="dialogImageEdit" persistent max-width="500px">
                <v-card>
                  <v-card-title>
                    <span class="headline">Edit images</span>
                  </v-card-title>
                  <v-card-text>
                    <v-container grid-list-md>

                      <v-layout wrap>        

                        <v-flex xs10>
                          <v-autocomplete
                            :items="gallery"
                            @select="loadGalleryImage"
                            :disabled="isUpdating"
                            label="Select and add gallery images"
                            item-text="id"
                            item-value="id"
                            background-color="white"
                            no-data-text="No gallery images available"
                            box              
                            chips
                            v-model="galleryimage"
                            multiple
                          >
                            <template
                              slot="selection"
                              slot-scope="data"                                  
                            >
                              <v-chip
                                :selected="data.selected"
                                class="chip--select-multi"
                                @input="data.parent.selectItem(data.item)"
                                close
                              >
                                <v-avatar>
                                  <img :src="data.item.path">
                                </v-avatar>
                                {{ data.item.category }}
                              </v-chip>
                            </template>
                          </v-autocomplete>
                        </v-flex>           
                        <v-flex xs2>      
                          <v-btn color="orange darken-3" fab small dark @click="addGalleryImage">
                            <v-icon>add</v-icon>
                          </v-btn>
                        </v-flex> 
                        <v-flex v-for="{id, path, description} in resObj.image.gallery" :key="id" xs12 sm6>
                          <v-card hover>
                            <v-card-media
                              :src="path"
                              height="200px"
                            ></v-card-media>
                            <v-card-actions>
                              <v-btn icon @click="show = !show">
                                <v-icon>{{ show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}</v-icon>
                              </v-btn>                             
                              <v-spacer></v-spacer>
                              <v-btn color="error" fab small dark  @click="removeGalleryImageFromRestaurant(id)">
                                <v-icon>remove</v-icon>
                              </v-btn>
                            </v-card-actions>
                            <v-slide-y-transition>
                              <v-card-text v-show="show">
                                {{ description }}
                              </v-card-text>
                            </v-slide-y-transition>                            
                          </v-card>
                        </v-flex>

                        <v-flex v-for="{id, path} in gallerypicture" :key="id" v-if="showGalleryImage" xs12 sm6>
                          <v-card hover>
                            <v-card-media
                              :src="path"
                              height="200px"
                            ></v-card-media>
                            <v-card-actions>
                              <v-spacer></v-spacer>
                              <v-btn color="error" fab small dark  @click="removeGalleryImage(id)">
                                <v-icon>remove</v-icon>
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-flex> 

                      </v-layout>

                    </v-container>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="dialogImageEdit = false">Close</v-btn>
                    <v-btn color="primary" @click="updateGalleryImage">Update</v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-layout>
      </v-container>
    </v-content>  
  </v-app>           
</template>

<script>
import MemberToolbar from "@/components/oscomponents/layout/MemberToolbar"
import utility from '@/helpers/osutility.js'

export default {
  components: { MemberToolbar },
  props: [ 'id' ],
  mounted() {
    const id = this.$route.params.id
    this.resObj = this.$store.getters.loadRestaurants.find(obj => {return obj.id === id})
  }, 
  computed: {
    // restaurant() {
    //   this.resObj = this.$store.getters.loadRestaurants.find(obj => {return obj.id === id})
    // }
  },
  data: () => ({
    resObj: [],
    dialogImageEdit: false,
    show: false,
    gallery: [],
    isUpdating: false,
    galleryimage: [],
    gallerypicture: []
  }),
  methods: {
    removeGalleryImageFromRestaurant (val) {
      const editImage = {
        restaurantId: this.$route.params.id,
        imageId: val
      }
      if (confirm("Do you want to delete this image from gallery!")) {
        this.$store.dispatch("deleteRestaurantGalleryImage", editImage)
      }  
    },
    loadGalleryImage() {
      this.gallery = this.$store.getters.loadGalleryImage
      console.log(this.$store.getters.loadGalleryImage)
    },
    addGalleryImage() {
      const galleryId = this.galleryimage
      let image = galleryId.map((val) => {
      let value = this.gallery.find(el => el.id == val)
        return value
      })
      this.gallerypicture = image
      this.showGalleryImage = true      
    },
    updateGalleryImage() {
      const galleryImage = []
      for (var i of this.gallerypicture) {
        galleryImage.push(i)
      }
      const gallery = {
        restaurantId: this.$route.params.id,
        gallery: utility.arrayToObject(galleryImage)  
      }
      this.$store.dispatch("updateRestaurantGalleryImage", gallery)
      console.log(gallery)
    }
  }
};
</script>