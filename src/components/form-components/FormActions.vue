<template>
  <div class="fixed-tools-bar">
    <v-container>
      <v-row justify="space-between">
        <v-col cols="auto" class="text-left">
          <v-btn color="accent" type="button" outlined @click="$emit('help')">
            Help
          </v-btn>
        </v-col>
        <v-col cols="auto" class="text-right">
          <v-btn
            class="mr-5"
            color="danger"
            type="button"
            outlined
            @click="showDialog = true"
          >
            Delete
          </v-btn>
          <v-btn color="accent" type="button" outlined @click="$emit('save')">
            Save
          </v-btn>
          <confirmation-dialog
            v-model="showDialog"
            title="Confirm delete"
            :text="`Are you sure you want to delete ${name || ''}?`"
            @confirm="$emit('delete')"
            @cancel="showDialog = false"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0">
          <h2>{{ type }}: {{ name }}</h2>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { NOTIFICATION_TYPES } from "../NotificationCenter";
import {
  IPC_HANDLERS,
  IPC_FUNCTIONS,
  ROOT_EVENTS,
  STATUSES,
  NOTIFICATION_ACTIONS,
} from "../../modules/constants";
import ConfirmationDialog from "../dialogs/ConfirmationDialog";

export const formActionHandlers = {
  data() {
    return {
      tootip: []
    }
  },
  created () {
    this.initializeTooltip();
  },
  methods: {
    async initializeTooltip() {
      this.tooltip = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.GET_TOOLTIP_VALUE
      });
    },
    tooltipTitle(key) {
      if (this.tooltip !== undefined) {
        const content = this.tooltip.filter(item => item.key.includes(key));
        const value = content[0].value;
        return value;
      }
    },
    async deleteElement({ projectName, type, name }) {
      const args = {
        projectName: projectName,
        arrayName: type,
        entryName: name,
      };
      const { status, ...response } = await window.ipc.invoke(
        IPC_HANDLERS.DATABASE,
        {
          func: IPC_FUNCTIONS.REMOVE_MOD_ELEMENT,
          data: args,
        }
      );

      this.$root.$emit(ROOT_EVENTS.DELETE_ELEMENT, {
        name,
        type,
      });
      if (status === STATUSES.SUCCESS) {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.SUCCESS,
          timer: null,
          message: `${this.name} has been deleted`,
        });
      } else {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.ERROR,
          timer: null,
          message: `${this.name} could not be deleted. Try again later`,
        });
        console.error(response.message);
      }
    },
    async saveElement({ formData, nodesData }) {
      const { status: dataStatus, ...dataResponse } = await window.ipc.invoke(
        IPC_HANDLERS.DATABASE,
        {
          func: IPC_FUNCTIONS.UPDATE_PROJECT_ARRAY_ENTRY,
          data: formData,
        }
      );

      let nodesStatus;
      let nodesResponse;

      if (nodesData) {
        const { status, ...response } = await window.ipc.invoke(
          IPC_HANDLERS.DATABASE,
          {
            func: IPC_FUNCTIONS.UPDATE_NODES_ARRAY_ENTRY,
            data: nodesData,
          }
        );
        nodesStatus = status;
        nodesResponse = response;
      }

      if (
        dataStatus === STATUSES.SUCCESS && nodesStatus
          ? nodesStatus === STATUSES.SUCCESS
          : true
      ) {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.SUCCESS,
          show: true,
          timer: null,
          message: `${this.name} has been saved`,
        });
      } else {
        this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
          type: NOTIFICATION_TYPES.ERROR,
          show: true,
          timer: null,
          message: `${this.name} could not be saved. Try again later`,
        });
        console.error(dataResponse.message);
        console.error(nodesResponse.message);
      }
    },
    async validateElement({ formRef }) {
      return new Promise((resolve, reject) => {
        let formValid = formRef.validate();
        if (!formValid) {
          this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
            type: NOTIFICATION_TYPES.ERROR,
            show: true,
            timer: null,
            message: `Element could not be saved. Ensure all required fields are populated with valid values.`,
          });
          reject("Element could not be saved");
        }
        resolve(true);
      });
    },
    async validateRecipe(recipeObject) {
      return new Promise((resolve, reject) => {
        let recipeType = recipeObject.data.recipeType;
        let itemKey, resultKey;
        if (recipeType === 'Shaped Recipe') {
          itemKey = "recipeItem";
          resultKey = "resultItem";
        } else if (recipeType === 'Shapeless Recipe') {
          itemKey = "recipeItemShapeless";
          resultKey = "resultItemShapeless";
        } else {
          itemKey = "furnaceItem";
          resultKey = "furnaceResult";
        }

        const items = Object.keys(recipeObject.data)
          .filter((key) => key.includes(itemKey))
          .reduce((obj, key) => {
            const value = recipeObject.data[key]["name"];
            if (value !== "") {
              Object.assign(obj, {
                [key]: recipeObject.data[key]["name"]
              });
            }
            return obj;
          }, {});

        if (Object.keys(items).length === 0 || recipeObject.data[resultKey] === undefined || recipeObject.data[resultKey]["name"] ===  "") {
          this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
            type: NOTIFICATION_TYPES.ERROR,
            show: true,
            timer: null,
            message: `Element could not be saved. Ensure the item is selected to be valid.`,
          });
          reject("Element could not be saved");
        }

        resolve(true);
      });
    },
    async validatePainting(paintingObject) {
      return new Promise((resolve, reject) => {
        if (paintingObject.data.texture["name"] === undefined || 
            paintingObject.data.texture["name"] ===  null || 
            paintingObject.data.texture["name"] ===  "ItemPlaceholder"
          ) 
        {
          this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
            type: NOTIFICATION_TYPES.ERROR,
            show: true,
            timer: null,
            message: `Element could not be saved. Ensure the item texture is selected to be valid.`,
          });
          reject("Element could not be saved");
        }

        resolve(true);
      });
      
    },
    async validateTag(items) {
      return new Promise((resolve, reject) => {
        if (items.length === 0) {
          this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
            type: NOTIFICATION_TYPES.ERROR,
            show: true,
            timer: null,
            message: `Element could not be saved. Ensure the item is selected to be valid.`,
          });
          reject("Element could not be saved");
        }
        resolve(true);
      });
    },
    async validateJSON(jsonStr) {
      return new Promise((resolve, reject) => {
        try {
          JSON.parse(jsonStr);
        } catch (e) {
            this.$root.$emit(NOTIFICATION_ACTIONS.PUSH, {
              type: NOTIFICATION_TYPES.ERROR,
              show: true,
              timer: null,
              message: `Element could not be saved. Ensure the input string is JSON to be valid.`,
            });
            reject("Element could not be saved");
        }
        resolve(true);
      });
    },
    async openHelpLink(url) {
      if (!url) {
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: 'URL not found' }
        );
      }

      const error = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
        data: url,
      });

      if (error) {
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: error }
        );
      }
    }
  },
};

export default {
  components: { ConfirmationDialog },
  name: "FormActions",
  props: {
    name: String,
    type: String
  },
  data() {
    return {
      showDialog: false
    };
  },
  mounted () {
    document.addEventListener('keyup', this.keyupHandler)
  },
  destroyed () {
    document.removeEventListener('keyup', this.keyupHandler)
  },
  methods: {
    keyupHandler (event) {
      if (event.ctrlKey && event.code === 'KeyS') {
        this.$emit('save');
      } else if (event.ctrlKey && event.code === 'Delete') {
        this.showDialog = true;
      } 
    },
  }
};
</script>
<style scoped>
.fixed-tools-bar {
  position: fixed;
  z-index: 2;
  background-color: rgba(35, 35, 35, 0.9);
  top: 62px;
  width: calc(100% - 256px);
  left: 256px;
}
</style>
