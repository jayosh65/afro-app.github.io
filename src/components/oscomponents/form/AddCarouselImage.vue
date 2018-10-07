<template>
  <v-app>
    <v-content>
      <v-container grid-list-md text-xs-center>
        <v-layout row wrap>
          <v-flex xs12 sm6 md4 lg4 pa-1>
            <v-card xs12 max-width="240px">
              <v-card-text>
                <div class="text-center">
                  <croppa v-model="cropimage"
                          accept="image/*"
                          :file-size-limit="102400"
                          @file-type-mismatch="onFileTypeMismatch"
                          @file-size-exceed="onFileSizeExceed">
                  </croppa>
                </div>
              </v-card-text>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">Click to upload image</h3>
                  <div>Drag image to position</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn
                  color="primary"
                  @click="dataUrl = cropimage.generateDataUrl(); checkPreview();"
                >Preview</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
          <v-flex xs12 sm6 md8 lg8 pa-1>
            <v-card v-show="urlContent" >
              <v-img
              :src="dataUrl">
              </v-img>
              <v-card-text>
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-layout align-center>
                      <v-text-field
                        ref="iname"
                        label="Image title"
                        placeholder="Title for image"
                        v-model="iname"
                        :rules="[
                          v => !!v || 'Name is required',
                          v =>  v.length <= 40 || 'Name must be less than 40 characters'
                        ]"
                        v-if="imagetitlefield"
                      ></v-text-field>
                    </v-layout>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :disabled="!valid" @click="upload">Upload</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>          
        </v-layout>
      </v-container>
    </v-content>  
  </v-app>           
</template>  

<script>
  import Vue from 'vue'
  import Croppa from 'vue-croppa'
  import 'vue-croppa/dist/vue-croppa.css'

  Vue.use(Croppa)
  export default {
    data: () => ({
      cropimage: {},
      imagedatas: [],
      dataUrl: '',
      urlContent: false,
      iname: '',
      imagetype: null,
      valid: false,
      imagetitlefield: false,
    }),
    mounted () {
      this.imagetitlefield = true
    },
    methods: {
      uploadCroppedImage () {
        this.cropimage.generateBlob((blob) => {
        // write code to upload the cropped image file (a file is a blob)
        }, 'image/jpeg', 0.8) // 80% compressed jpeg file
      },
      onFileTypeMismatch (file) {
        alert('Invalid file type. Please choose an image file.')
      },
      onFileSizeExceed (file) {
        alert('File size exceeds. Please choose a file smaller than 100kb.')
      },
      checkPreview: function () {
        let url = this.dataUrl

        if (url) {
          this.urlContent = true
        } else {
          this.urlContent = false
        }
      },
      upload () {
        if (this.$refs.form.validate()) {
          const local = this
          if (!this.cropimage.hasImage()) {
            alert('no image to upload')
          }

          const category = this.imagetype
          const title = this.iname
          
          this.cropimage.generateBlob((blob) => {
            var metadata = {
              contentType: blob.type
            }

            let blobtype = blob.type
            let blobimage = blobtype.split('/') 
            let imagetype = blobimage[1]
            
            const imageData = {
              metaData: metadata,
              type: imagetype,
              content: blob,
              title: (title ? title : 'no title'),
            }
            local.$store.dispatch("addCarouselImage", imageData)
          })      
        }
      }     
    }       
  }
</script>
