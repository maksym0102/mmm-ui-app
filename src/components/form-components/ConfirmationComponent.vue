<template>
  <span>
    <v-btn 
      width="100%" 
      color="error" 
      :title="buttonTitle" 
      @click="show = true"
      >X</v-btn
    >
    <confirmation-dialog
      v-model="show"
      :title="title"
      :text="text"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />
  </span>
</template>

<script>
import ConfirmationDialog from "../dialogs/ConfirmationDialog.vue";
export default {
  components: { ConfirmationDialog },
  name: "ConfirmationComponent",
  data() {
    return {
      show: false,
    };
  },
  props: {
    title: String,
    text: String,
    buttonTitle: String,
  },
  methods: {
    handleConfirm() {
      this.show = false;
      this.$emit("confirm");
    },
    handleCancel() {
      this.show = false;
      this.$emit("cancel");
    },
  },
};
</script>
