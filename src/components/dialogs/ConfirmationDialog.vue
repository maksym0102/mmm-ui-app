<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    width="50%"
  >
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> {{ title || 'Delete' }} </v-card-title>
        <v-card-text> {{ text || 'Are you sure you want to delete this?' }} </v-card-text>
        <v-card-actions>
          <v-btn outlined @click="cancel">
            Cancel
          </v-btn>
          <v-btn outlined color="accent" @click="confirm">
            Confirm
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "ConfrimationDialog",
  props: {
    title: String,
    text: String,
  },
  methods: {
    cancel() {
      this.$emit('cancel');
    },
    confirm() {
      this.$emit('confirm');
    }
  },
};
</script>
