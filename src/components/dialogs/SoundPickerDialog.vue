<template>
  <v-dialog width="50%" v-bind="$attrs" v-on="$listeners">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> Select sound </v-card-title>
        <v-container class="mb-5">
          <v-radio-group v-model="selectedSoundIndex">
            <v-radio
              v-for="(sound, index) in sounds"
              :key="sound.id"
              :label="sound.name"
              :value="index"
            ></v-radio>
          </v-radio-group>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text color="accent" @click="uploadSound">
            Upload sound
          </v-btn>
          <v-spacer />
          <v-btn outlined @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn outlined color="accent" @click="submitSelected">
            Select
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "SoundPickerDialog",
  props: {
    activeProject: {
      required: true,
      type: String,
    },
    currentSound: {
      type: Object,
      default: () => ({}),
    },
  },
  data: () => ({
    selectedSoundIndex: 0,
    sounds: [],
  }),
  methods: {
    async uploadSound() {
      await window.ipc.invoke("sound", {
        func: "openFilePicker",
        data: this.activeProject,
      });
      this.getSounds();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    submitSelected() {
      this.$emit("selected-sound", this.sounds[this.selectedSoundIndex]);
      this.closeDialog();
    },
    async getSounds() {
      const result = await window.ipc.invoke("sound", {
        func: "getSounds",
        data: this.activeProject,
      });
      this.sounds = result;
    },
  },
  async mounted() {
    await this.getSounds();
    if (this.currentSound?.name) {
      const selectedSoundIndex = this.sounds.findIndex(
        (sound) => sound.name === this.currentSound.name
      );
      
      if (selectedSoundIndex >= 0) {
        this.selectedSoundIndex = selectedSoundIndex;
      }
    }
  },
};
</script>
