<template>
  <v-dialog
    v-bind="$attrs"
    v-on="$listeners"
    @click:outside="resetValidation"
    width="50%"
  >
    <v-sheet outlined color="accent" rounded>
      <v-card>
        <v-card-title> New {{ type }} </v-card-title>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  filled
                  :label="nameLabel"
                  v-model="elementName"
                  :rules="nameRules"
                  color="accent"
                  @keyup.enter="addNewElement"
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
          <v-btn outlined color="accent" @click="addNewElement">
            Add
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-sheet>
  </v-dialog>
</template>

<script>
export default {
  name: "AddModElementDialog",
  props: {
    type: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      default: () => [],
    },
    blockList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
    elementName: "",
    valid: false,
    nameRules: [
      (v) => !!v || "Name is required",
      (v) => !this.currentBlockList
        .map(item => this.getLowercasedStr(item))
        .includes(this.getLowercasedStr(v)) || `${this.type} named "${v}" already exists. You must use unique name`
    ],
  }
  },
  computed: {
    nameLabel() {
      return this.type + " Name";
    },
    currentBlockList() {
      const current = this.blockList.find(blockList => blockList.type === `${this.type}s`);
      return current ? current.list : [];
    }
  },
  methods: {
    closeDialog: function() {
      this.$root.$emit("close-addmodelementdialog");
      this.$refs.form.reset();
    },
    addNewElement: function() {      
      if (this.$refs.form.validate()) {
        this.$emit('submit-addmodelementdialog', this.elementName);
        this.$refs.form.reset();
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
