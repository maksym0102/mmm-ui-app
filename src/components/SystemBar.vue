<template>
  <v-system-bar color="darkerblue" app height="32">
    <v-btn class="ma-2" plain @click="returnToProjectSelect">
      Exit
    </v-btn>
    <v-menu bottom left :offset-y="offset">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="ma-2" plain>
          Settings
        </v-btn>
      </template>
      <v-list>
        <v-list-item class="menu-item">
          <v-switch
            :input-value="$vuetify.theme.dark"
            inset
            label="Use dark theme"
            @click.stop
            @change="toggleTheme"
          />
        </v-list-item>
        <v-list-item>
          <v-btn width="100%" type="button" @click="showProjectFolder"
            >Open project files</v-btn
          >
        </v-list-item>
        <v-list-item>
          <v-btn width="100%" type="button" @click="exportProject">Export project</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn width="100%" type="button" @click="exportProjectData">Export project Data</v-btn>
        </v-list-item>
        <v-list-item>
          <v-btn width="100%" type="button" @click="toggleDevTools">Toggle Developer Tools</v-btn>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu bottom left :offset-y="offset">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="ma-2" plain>
          Help
        </v-btn>
      </template>
      <v-list>
        <v-list-item class="menu-item" @click="readDocumentation()">
          <v-list-item-title>Read Documentation</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu bottom left :offset-y="offset">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="ma-2" plain>
          Run
        </v-btn>
      </template>
      <v-list>
        <v-list-item class="menu-item"  @click="compileClient()">
          <v-list-item-title>
            <v-icon color="green">
              mdi-wrench
            </v-icon>
            Build Project</v-list-item-title
          >
        </v-list-item>
        <v-list-item class="menu-item" @click="runClient()" v-bind:disabled="isRunning">
          <v-list-item-title>
            <v-icon color="green">
              mdi-play
            </v-icon>
            Run Client</v-list-item-title
          >
        </v-list-item>
        <v-list-item class="menu-item" @click="stopClient()" v-if="isRunning">
          <v-list-item-title>
            <v-icon color="green">
              mdi-stop
            </v-icon>
            Stop Client</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
    <v-menu bottom left :offset-y="offset">
      <template v-slot:activator="{ on }">
        <v-btn v-on="on" class="ma-2" plain>
          Export
        </v-btn>
      </template>
      <v-list>
        <v-list-item
          @click="exportMenuClick(item.title)"
          v-for="(item, i) in exportMenuItems"
          :key="i"
          class="menu-item"
        >
          <v-list-item-title>
            <v-icon v-if="!item.isParent" color="green">
              {{ item.icon }}
            </v-icon>
            {{ item.title }}</v-list-item-title
          >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-system-bar>
</template>

<script>
import { IPC_FUNCTIONS, IPC_HANDLERS, NOTIFICATION_ACTIONS, STATUSES } from '../modules/constants';
import { NOTIFICATION_TYPES } from './NotificationCenter.vue';

export default {
  name: "SystemBar",
  props: ["activeProject"],
  data: () => ({
    items: [
      { title: "Build Project", icon: "mdi-wrench" },
      { title: "Run Client", icon: "mdi-play" },
      { title: "Stop Client", icon: "mdi-stop" },
    ],
    exportMenuItems: [
      { title: "Export Mod", icon: "mdi-export" },
    ],
    offset: true,
    isRunning: false
  }),
  methods: {
    returnToProjectSelect() {
      this.$router.push("/");
    },
    async runClient() {
      let tmp = this;
      tmp.isRunning = true;
      
      this.$root.$emit(NOTIFICATION_ACTIONS.BUILD_STARTED, {
        type: NOTIFICATION_TYPES.INFO,
        timer: null,
        message: 'New build has been triggered',
      });
      this.$root.$emit("build-project", this.activeProject);
      const { status, message, errors } = await window.ipc.invoke(IPC_HANDLERS.RUN, { func: IPC_FUNCTIONS.BUILD_PROJECT, data: this.activeProject });
      if (status === STATUSES.ERROR) {
        tmp.isRunning = false;
        this.$root.$emit(NOTIFICATION_ACTIONS.BUILD_ERROR, {
          type: status,
          message,
        });
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: "There was an issue. Check the Build Errors tab for more info." }
        );
      } else if (errors) {
        tmp.isRunning = false;
        for (const error of errors) {
          this.$root.$emit(NOTIFICATION_ACTIONS.BUILD_ERROR, {
            type: error.status,
            message: error.message,
          });
          this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: "There was an issue. Check the Build Errors tab for more info." }
        );
        }
      }
      else {
        tmp.isRunning = false;
        console.log("BUILD SUCCESS");
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.WARNING, message: "Client disconnected" }
        );
      }
      
    },
    async compileClient() {
      const { status, message, errors } = await window.ipc.invoke(IPC_HANDLERS.RUN, { func: IPC_FUNCTIONS.COMPILE_PROJECT, data: this.activeProject });
    },
    stopClient() {
      let tmp = this;
      tmp.isRunning = false;
      window.ipc.invoke(IPC_HANDLERS.RUN, { func: IPC_FUNCTIONS.STOP_CLIENT });
    },
    async exportMenuClick(name) {
      console.log("export menu name:", name);
    },
    async readDocumentation() {
      const error = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.OPEN_EXTERNAL_LINK,
        data: "https://modfoundry.app/docs/intro ",
      });

      if (error) {
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: error }
        );
      }
    },
    toggleTheme() {
      const isDarkMode = this.$vuetify.theme.dark;
      this.$vuetify.theme.dark = !isDarkMode;
      localStorage.setItem("isDarkMode", !isDarkMode);
    },
    async showProjectFolder() {
      const error = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
        func: IPC_FUNCTIONS.OPEN_DIRECTORY,
        data: ["projects", this.activeProject],
      });

      if (error) {
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: STATUSES.ERROR, message: error }
        );
      }
    },
    async exportProject() {
      try {
        const { status, message } = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.EXPORT_PROJECT,
          data: this.activeProject,
        });
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: status, message }
        );
      } catch (error) {
        console.log(error);
      }
    },
    async exportProjectData() {
      try {
        const { status, message } = await window.ipc.invoke(IPC_HANDLERS.FILE_SYSTEM, {
          func: IPC_FUNCTIONS.EXPORT_PROJECT_DATA,
          data: this.activeProject,
        });
        this.$root.$emit(
          NOTIFICATION_ACTIONS.PUSH, 
          { type: status, message }
        );
      } catch (error) {
        console.log(error);
      }
    },
    async toggleDevTools() {
      try {
        await window.ipc.invoke(IPC_HANDLERS.DEV_TOOLS, {
          func: IPC_FUNCTIONS.TOGGLE_DEV_TOOLS
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
</script>
