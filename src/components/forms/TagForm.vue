<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Tag'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-form>
      <v-expansion-panels multiple v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>Selected Items</h3>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <v-col cols="auto" v-for="(item, index) in items" :key="item.name">
                <div class="item-tile">
                  <v-icon
                    class="delete-item"
                    @click="deleteItem(index)"
                    title="Delete"
                    >mdi-close</v-icon
                  >
                  <img
                    :src="item.texture"
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
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <BlockItemPickerDialog
      v-model="pickerDialog"
      :activeProject="projectName"
      @selected-item="addItem"
      @close-selectitemdialog="pickerDialog = false"
    />
  </v-container>
</template>

<script>
import BlockItemPickerDialog from "../dialogs/BlockItemPickerDialog.vue";

import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  components: {
    BlockItemPickerDialog,
    FormActions,
  },
  name: "TagForm",
  props: {
    projectName: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      panel: [0],
      pickerDialog: false,
      items: [],
      tagObject: {},
      defaultNodes: [],
      graph: null,
    };
  },
  computed: {
    valid() {
      return !!this.items.length;
    },
  },
  mounted() {
    this.fetchData();
  },
  mixins: [formActionHandlers],
  methods: {
    deleteEl() {
      this.deleteElement({
        projectName: this.projectName,
        name: this.name,
        type: "tags",
      });
    },
    saveEl() {
      const { items } = this;
      this.validateTag(items).then(value => {
        this.saveElement({
          formData: {
            projectName: this.projectName,
            arrayName: "tags",
            entryName: this.name,
            data: {
              ...this.tagObject,
              data: {
                items,
              },
            },
          },
          nodesData: {
            projectName: this.projectName,
            arrayName: "tags",
            entryName: this.name,
            data: {},
          },
        });
      }, reason => {
        console.log(reason);
      });
    },
    deleteItem(index) {
      this.items.splice(index, 1);
    },
    getImageSrc(item) {
      try {
        return require(`../../assets/img/icons/117/${item
          .slice(10)
          .toLowerCase()}.png`);
      } catch (error) {
        return require(`../../assets/img/item-placeholder.png`);
      }
    },
    async fetchData() {
      const projectData = await window.ipc.invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      });

      const { tags } = projectData;
      const tagObject = tags.find((tag) => tag.name === this.name);
      const items = tagObject.data.items;

      this.tagObject = tagObject;
      this.items = items || [];
    },
    addItem(item) {
      const uniqueItems = new Set(this.items);
      uniqueItems.add(item);
      this.items = [...uniqueItems];
      this.pickerDialog = false;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    }
  },
};
</script>
