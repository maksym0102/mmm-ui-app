<template>
  <v-dialog width="50%" v-bind="$attrs" v-on="$listeners">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> Select a texture </v-card-title>
        <v-container class="mb-5">
          <v-row class="ml-4">
            <v-img
              v-for="(t, idx) in textures"
              :class="{ activeTexture: t.name == selected.name }"
              class="mr-2 texture-picker-image"
              style="image-rendering: pixelated;"
              :src="t.src"
              max-height="32px"
              max-width="32px"
              v-bind:key="idx"
              @click.stop="textureSelected(t, idx)"
            />
          </v-row>
        </v-container>
        <v-container v-if="selected.name"> Selected: {{ selected.name }} </v-container>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn text color="accent" @click="uploadNewTexture">
            Upload New Texture
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn type="button" outlined @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn type="button" outlined color="accent" :disabled="!selected.name" @click="submitSelected">
            Select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "TexturePickerDialog",
  props: ["activeProject"],
  data: () => ({
    textures: [],
    selected: {
      name: null,
      index: null,
      src: null
    },
    selectedIndex: null,
    selectedBase64: null
  }),
  computed: {},
  methods: {
    closeDialog: function() {
      this.$root.$emit("close-selecttexturedialog");
      this.$emit('close-selecttexturedialog');
      this.selected = {
        name: null,
        index: null,
        src: null
      };
    },
    textureSelected: function(selected, idx) {
      this.selected.name = selected.name;
      this.selected.src = selected.src;
      this.selected.index = idx;
    },
    submitSelected: function() {
      if (!this.selected.name) return;
      this.$emit("selected-texture", this.selected);
      this.selected = {
        name: null,
        index: null,
        src: null
      };
    },
    uploadNewTexture: function() {
      window.ipc
        .invoke("image", { func: "openFilePicker", data: this.activeProject }) // TODO validate image type and size
        .then((result) => {
          window.ipc
            .invoke("image", { func: "getTextures", data: this.activeProject })
            .then((result) => {
              this.textures = result;
            });
        });
    }
  },
  mounted() {
    window.ipc.invoke("image", { func: "getTextures", data: this.activeProject }).then((result) => {
      this.textures = result;
    });
  }
};
</script>
