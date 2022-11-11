<template>
  <v-dialog width="50%" v-bind="$attrs" v-on="$listeners">
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> Select a model </v-card-title>
        <v-container class="mb-5">
          <v-row>
            <v-col>
              <v-select
                :items="models"
                label="Model"
                v-model="selected"
                filled
                color="accent"
                item-color="accent"
            ></v-select>
            </v-col>
          </v-row>
        </v-container>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn text color="accent" @click="uploadNewModel">
            Upload New Model
          </v-btn>
          <v-spacer></v-spacer>
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
  name: "ModelPickerDialog",
  components: {  },
  props: {
    activeProject: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    selected: "",
    models: [],
  }),
  methods: {
    async uploadNewModel() {
      await window.ipc.invoke("model", {
        func: "openFilePicker",
        data: this.activeProject,
      });
      this.getModels();
    },
    closeDialog() {
      this.$emit("close-dialog");
    },
    submitSelected() {
      this.$emit("selected-model", this.selected);
      this.closeDialog();
    },
    handleSelectModel(isChecked, model) {
      this.selected = model;
    },
    async getModels() {
      const result = await window.ipc.invoke("model", {
        func: "getModels",
        data: this.activeProject,
      });
      this.models = result;
    },
  },
  async mounted() {
    await this.getModels();
    if (!this.selected) {
      this.selected = this.models[0];
    }
  }
};
</script>
