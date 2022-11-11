<template>
  <v-expansion-panels multiple v-model="panel">
    <multiple-picture
      title="Selected textures"
      :pictures="pictures"
      :projectName="projectName"
      @change="(newPictures) => (pictures = newPictures)"
    />
  </v-expansion-panels>
</template>

<script>
import MultiplePicture from './form-components/MultiplePicture.vue'
import placeholder from '../assets/img/placeholder.png'
export default {
  name: "MultiplePicture",
  components: {
    MultiplePicture
  },
  data() {
    return {
      pictures: [
        {
          src: placeholder,
          name: "",
        }
      ]
    }
  }
}
</script>
