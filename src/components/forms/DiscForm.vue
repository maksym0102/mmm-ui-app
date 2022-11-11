<template>
  <v-container class="content-wrapper">
    <form-actions :name="name" :type="'Disc'" @save="saveEl" @delete="deleteEl" @help="help" />
    <v-form>
      <v-expansion-panels multiple v-model="panel">
        <v-expansion-panel>
          <v-expansion-panel-header>
            <h3>General</h3>
          </v-expansion-panel-header>

          <v-expansion-panel-content>
            <h4>Image</h4>
            <v-img
              @click="imagePickerDialog = true"
              style="image-rendering: pixelated;"
              :src="image.src"
              class="texture-image mt-2"
              height="128px"
              width="128px"
            />

            <h4 class="mt-2">Sound</h4>
            <v-chip
              v-if="sound.name"
              class="mt-2"
              close
              @click:close="removeSound"
            >
              {{ sound.name }}
            </v-chip>
            <v-btn v-else class="mt-2" @click="soundPickerDialog = true"
              >Choose sound</v-btn
            >
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-form>
    <texture-picker-dialog
      v-model="imagePickerDialog"
      :activeProject="projectName"
      @selected-texture="onTextureSelect"
    />
    <sound-picker-dialog
      v-model="soundPickerDialog"
      :activeProject="projectName"
      :current-sound="sound"
      @selected-sound="onSoundSelect"
      @close-dialog="soundPickerDialog = false"
    />
  </v-container>
</template>

<script>
import SoundPickerDialog from "../dialogs/SoundPickerDialog.vue";
import TexturePickerDialog from "../dialogs/TexturePickerDialog.vue";
import placeholder from "../../assets/img/placeholder.png";
import FormActions, {
  formActionHandlers,
} from "../form-components/FormActions";

export default {
  components: {
    TexturePickerDialog,
    SoundPickerDialog,
    FormActions,
  },
  name: "DiscForm",
  props: {
    projectName: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      imagePickerDialog: false,
      soundPickerDialog: false,
      panel: [0],
      discObject: {},
      image: {
        src: placeholder,
        name: "",
      },
      sound: {
        id: null,
        src: null,
        name: null,
      },
      defaultNodes: [],
      graph: null,
    };
  },
  computed: {
    valid() {
      return this.image.src && this.sound.src;
    },
  },
  mixins: [formActionHandlers],
  methods: {
    saveEl() {
      const { sound, image } = this;

      this.saveElement({
        formData: {
          projectName: this.projectName,
          arrayName: "discs",
          entryName: this.name,
          data: {
            ...this.discObject,
            data: {
              sound,
              image,
            },
          },
        },
        nodesData: {
          projectName: this.projectName,
          arrayName: "discs",
          entryName: this.name,
          data: {},
        },
      });
    },
    deleteEl() {
      this.deleteElement({
        projectName: this.activeProject,
        name: this.name,
        type: "discs",
      });
    },
    onTextureSelect(selected) {
      this.image = selected;
      this.imagePickerDialog = false;
    },
    onSoundSelect(selectedSound) {
      this.sound = selectedSound;
      this.soundPickerDialog = false;
    },
    removeSound() {
      this.sound = {
        id: "",
        src: "",
        name: "",
      };
    },
    async fetchData() {
      const projectData = await window.ipc.invoke("database", {
        func: "getProjectDataByName",
        data: this.projectName,
      });

      const { discs } = projectData;

      const discObject = discs.find((disc) => disc.name === this.name);
      const { sound, image } = discObject.data;

      this.discObject = discObject;

      if (sound && sound?.name) {
        this.sound = sound;
      }

      if (image && image?.src) {
        this.image = image;
      }
    },
    handlePickerDialogClose() {
      this.imagePickerDialog = false;
    },
    help() {
      const url = "https://modfoundry.app/docs/intro";
      this.openHelpLink(url);
    },
  },
  mounted() {
    this.fetchData();
    this.$root.$on("close-selecttexturedialog", this.handlePickerDialogClose);
  },
  beforeDestroy() {
    this.$root.$off("close-selecttexturedialog", this.handlePickerDialogClose);
  },
};
</script>
