<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    width="50%"
  >
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> Edit </v-card-title>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  label="Name"
                  v-model="name"
                  :rules="nameRules"
                  color="accent"
                  @keyup.enter="updateElement"
                  validate-on-blur
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="closeDialog">
            Cancel
          </v-btn>
          <v-btn outlined color="accent" @click="updateElement">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "EditModElementDialog",
  props: {
    activeItem: {
      type: Object,
      required: true
    },
    blockList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      name: '',
      type: '',
      valid: false,
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => (v == this.activeItem.name || !this.currentBlockList
          .map(item => this.getLowercasedStr(item))
          .includes(this.getLowercasedStr(v))) || `${this.type} named "${v}" already exists. You must use unique name`
      ],
    }
  },
  computed: {
    nameLabel() {
      return this.type + " Name";
    },
    currentBlockList() {
      const current = this.blockList.find(blockList => this.getLowercasedStr(blockList.type) === `${this.type}`);
      return current ? current.list : [];
    }
  },
  watch: {
    activeItem(value) {
      this.name = value.name;
      this.type = value.type;
    }
    
  },
  methods: {
    closeDialog: function() {
      this.$root.$emit("close-editmodelementdialog");
    },
    updateElement: function() {      
      if (this.$refs.form.validate()) {
        this.$emit('submit-editmodelementdialog', this.name);
      }
    },
    resetValidation() {
      this.$refs.form.reset();
    },
    getLowercasedStr(str) {
      return str && typeof str === 'string' ? str.toLowerCase() : ''
    }
  },
};
</script>
