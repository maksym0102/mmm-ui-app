<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Loot Table'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-expansion-panels multiple v-model="panel">
      <v-expansion-panel>
        <v-expansion-panel-header><h3>General</h3></v-expansion-panel-header>
        <v-expansion-panel-content>
            <v-container>
                <v-alert
                    border="top"
                    light
                    color="blue-grey darken-4"
                    type="info"
                    elevation="2"
                >
                    You can use the following site to generate the loot table JSON: https://misode.github.io/loot-table/?version=1.18.2 .
                    This loot table can be associated with a block by going to the "loot" section of the block page.
                </v-alert>
                <v-textarea
                  v-model="lootObject.data.lootTableJSON"
                  label="Loot Table JSON"
                  color="accent"
                  filled
                  type="json"
                  rows="15"
                  ></v-textarea>
            </v-container>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>
<script>
import FormActions, { formActionHandlers } from "../form-components/FormActions";

export default {
  name: "StructureForm",
  components: { FormActions },
  props: ["name", "projectName"],
  data: () => ({
    panel: [0],
    pickerDialog: false,
    selectedTexture: "",
    lootObject: {
      data: {
        lootTableJSON: ""
      },
    },
  }),
  computed: {
    registryName() {
      return this.name.replace(/ /g, "_").toLowerCase();
    }
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl: function() {
      this.validateJSON(this.lootObject.data.lootTableJSON).then(value => {
        this.lootObject.data.registryName = this.registryName;
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "loot",
            entryName: this.name,
            data: this.lootObject,
          }
        });
      }, reason => {
        console.log(reason);
      });
    },
    deleteEl: function() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "loot",
      });
    },
    onTextureSelect(selected) {
      this.pickerDialog = false;
      this.lootObject.data.texture = selected;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  mounted() {
    window.ipc
      .invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      })
      .then((result) => {
        this.lootObject = result.loot.find(
          (b) => b.name === this.name
        );
      });

    this.$root.$on("close-selecttexturedialog", () => {
      this.pickerDialog = false;
    });
  },
};
</script>
