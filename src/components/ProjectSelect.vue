<template>
  <v-main :style="{ background: $vuetify.theme.themes[theme].componentmain }">
    <v-container fluid class="text-center">
      <div class="d-flex justify-center">
        <h1>ModFoundry</h1>
        <img :src="require('../assets/img/logo.png')" width="45" height="45" class="ml-1" />
      </div>
      <v-row>
        <v-col cols="12" sm="2"> </v-col>
        <v-col cols="12" sm="8">
          <v-divider></v-divider>
          <v-alert
            border="bottom"
            colored-border
            type="warning"
            elevation="2"
            class="mt-5"
          >
            This is an alpha build of ModFoundry. 
                The alpha is intended to allow for users to help contribute to the development of the app by submitting ideas and feedback.
                The app may not be very useful for mod creation just yet. You can help shape the development roadmap by suggesting features/ideas on the Discord!
          </v-alert>

          <!-- Dialog for creating a new project -->
          <v-dialog v-model="dialog" width="50%">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mt-5 mx-1"
                outlined
                color="accent"
                v-bind="attrs"
                v-on="on"
              >
                Create New Project
              </v-btn>
            </template>
            <v-sheet outlined color="accent" rounded>
              <v-card>
                <v-form
                  v-model="newProjectIsValid"
                  ref="newProjectForm"
                  @submit.prevent="validate"
                >
                  <v-card-title>
                    New Project
                  </v-card-title>
                  <v-container>
                    <v-text-field
                      v-model="projectname"
                      :rules="nameRules"
                      label="Project Name"
                      color="accent"
                      filled
                      required
                    ></v-text-field>
                    <v-select
                      v-model="defaultVersion"
                      :items="versions"
                      label="Target Minecraft Version"
                      color="accent"
                      filled
                      item-color="accent"
                    ></v-select>
                  </v-container>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn outlined @click="dialog = false">
                      Cancel
                    </v-btn>
                    <v-btn color="accent" type="submit" outlined>
                      Create
                    </v-btn>
                  </v-card-actions>
                </v-form>
              </v-card>
            </v-sheet>
          </v-dialog>

          <v-btn
            class="mx-1 mt-5"
            outlined
            color="accent"
            @click="importProject"
            >Import project</v-btn
          >

          <!-- Dialog for confirming the deletion of a project -->
          <v-dialog v-model="confirmDeletion" width="50%">
            <v-sheet outlined color="accent" rounded>
              <v-card class="text-left">
                <v-card-title>
                  Are you sure?
                </v-card-title>

                <v-card-text>
                  Deleting this project is permanent and cannot be undone.
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn outlined @click="confirmDeletion = false">
                    Cancel
                  </v-btn>
                  <v-btn color="danger" outlined @click="deleteProject">
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-sheet>
          </v-dialog>

          <!-- Data table to show all projects -->
          <v-data-table
            v-if="atLeastOneProject"
            :headers="headers"
            :items="projects"
            :items-per-page="5"
            class="elevation-1 ma-4"
          >
            <template v-slot:no-data>
              Created projects will be shown here
            </template>
            <template v-slot:item="row">
              <tr>
                <td>{{ row.item.name }}</td>
                <td>{{ row.item.version }}</td>
                <td>{{ row.item.date }}</td>
                <td>
                  <v-btn
                    class="ma-2 text-capitalize"
                    outlined
                    small
                    color="accent"
                    @click="openProject(row.item)"
                  >
                    Open
                  </v-btn>
                </td>
                <td>
                  <v-btn
                    class="ma-2 text-capitalize"
                    outlined
                    small
                    color="danger"
                    @click="attemptDeletion(row.item)"
                  >
                    Delete
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
          <v-divider class="my-4" />
          <tip-card />
        </v-col>
        <v-col cols="12" sm="2"> </v-col>
      </v-row>
    </v-container>
    <notification-center />
  </v-main>
</template>

<script>
import NotificationCenter from "./NotificationCenter.vue";
import TipCard from "./TipCard.vue";
import logo from "../assets/img/logo.png";

export default {
  components: { TipCard, NotificationCenter },
  name: "ProjectSelect",

  data() {
    return {
      projects: [],
      dialog: false,
      confirmDeletion: false,
      newProjectIsValid: false,
      projectname: "",
      projectToDelete: null,
      defaultVersion: "1.18",
      versions: ["1.18"],
      nameRules: [
        (v) => !!v || "Name is required",
        (v) => v.length <= 30 || "Name must be less than 30 characters",
        (v) =>
          /^[a-z_]+$/.test(v) ||
          "Name should be in snake_case (you can use only lowercase letters and underscores)",
        (v) =>
          !this.projects.find((project) => project.name === v) ||
          `Project "${v}" already exists. You must use a unique name`,
      ],
      headers: [
        { text: "Name", value: "name" },
        { text: "Minecraft Version", value: "version" },
        { text: "Creation Date", value: "date" },
        { text: "", value: "edit" },
        { text: "", value: "delete" },
      ],
    };
  },

  computed: {
    atLeastOneProject: function() {
      return this.projects.length > 0;
    },
    theme() {
      return this.$vuetify.theme.dark ? "dark" : "light";
    },
  },
  created() {
    this.fetchProjects();
  },
  methods: {
    fetchProjects: function() {
      window.ipc.invoke("database", { func: "getProjects" }).then((result) => {
        this.projects = result;
      });
    },
    validate() {
      let formValid = this.$refs.newProjectForm.validate();
      if (formValid) {
        this.addNewProject();
        this.dialog = false;
      }
    },
    addNewProject() {
      // Get date
      let today = new Date();
      let dd = String(today.getDate()).padStart(2, "0");
      let mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
      let yyyy = today.getFullYear();
      today = mm + "/" + dd + "/" + yyyy;

      let newProject = {
        name: this.projectname,
        version: this.defaultVersion,
        date: today,
      };
      this.projects.push(newProject);
      window.ipc.invoke("database", {
        func: "writeProjects",
        data: this.projects,
      });
      window.ipc.invoke("database", {
        func: "initializeProjectDirectories",
        data: this.projectname,
      });
      window.ipc.invoke("database", {
        func: "initializeNewProjectData",
        data: this.projectname,
      });
      this.$refs.newProjectForm.reset();
      this.projectname = "";
    },
    deleteProject() {
      let removeIndex = this.projects
        .map((item) => item.name)
        .indexOf(this.projectToDelete.name);
      removeIndex >= 0 && this.projects.splice(removeIndex, 1);
      window.ipc.invoke("database", {
        func: "writeProjects",
        data: this.projects,
      });
      window.ipc.invoke("database", {
        func: "removeProjectDataByName",
        data: this.projectToDelete.name,
      });
      this.confirmDeletion = false;
      this.projectToDelete = null;
    },
    attemptDeletion(item) {
      this.projectToDelete = item;
      this.confirmDeletion = true;
    },
    openProject(item) {
      this.$router.push({ name: "Editor", params: { data: item.name } });
    },
    async importProject() {
      try {
        const { status, message } = await window.ipc.invoke("fileSystem", {
          func: "importProject",
        });

        if (status === "success") {
          this.fetchProjects();
        }

        this.$root.$emit("push-notification", { type: status, message });
      } catch (error) {
        this.$root.$emit("push-notification", {
          type: "error",
          message: error.message,
        });
      }
    },
  },
};
</script>
