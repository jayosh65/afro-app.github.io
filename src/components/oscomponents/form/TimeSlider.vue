<template>
  <v-card flat color="transparent">
    <v-card-text class="px-0 mx-0">
      <v-layout row>
        <v-flex shrink>
          <v-chip>{{ value[0] | timeformat }}</v-chip>
        </v-flex>
        <v-flex shrink>
          <v-range-slider
            :value="value" 
            v-on:input="$emit('input', $event)"
            :max="max"
            :min="min"
            :step="10"              
          ></v-range-slider>
        </v-flex>
        <v-flex shrink>
          <v-chip>{{ value[1] | timeformat }}</v-chip>
        </v-flex>       
      </v-layout>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    props: {
        min: Number,
        max: Number,
        value: { type: [Array, Number, String]}
    },
    filters: {
      timeformat: function (value) {
        let hour = value / 60
        hour = Math.floor(hour).toString()

        let minute = value % 60
        if (minute < 10) {
          minute = '0' + minute.toString()
        } else {
          minute = minute.toString()
        }

        return hour + ':' + minute
      }
    }     
  }
</script>