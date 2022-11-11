<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <h3>{{title}}</h3>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <v-row>
        <v-col cols="auto" v-for="(picture, index) in pictures" :key="`${picture.src}_${index}`">
          <div class="item-tile">
            <v-icon
              class="delete-item"
              @click="deletePicture(index)"
              title="Delete"
              >mdi-close</v-icon
            >
            <img
              :src="picture.src"
              class="texture-image"
              style="image-rendering: pixelated; height: 100%; width: 100%;"
            />
          </div>
        </v-col>
        <v-col cols="auto">
          <div class="item-tile">
            <button
              type="button"
              class="texture-image unstyled-btn add-item"
              @click="pickerDialog = true"
              >+</button
            >
          </div>
        </v-col>
      </v-row>
      <texture-picker-dialog
        v-model="pickerDialog"
        :activeProject="projectName"
        @selected-texture="addItem"
        @close-selecttexturedialog="pickerDialog = false"
      />
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import TexturePickerDialog from "../dialogs/TexturePickerDialog.vue";

export default {
  name: "MultiplePicture",
  components: {
    TexturePickerDialog,
  },
  props: {
    projectName: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "Pictures",
    },
    pictures: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      pickerDialog: false,
    };
  },
  methods: {
    addItem(item) {
      this.$emit("change", [...this.pictures, item]);
      this.pickerDialog = false;
    },
    deletePicture(index) {
      this.$emit(
        "change",
        this.pictures.filter((_, i) => i !== index)
      );
    },
  },
};
</script>
