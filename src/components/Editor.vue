<template>
  <v-app>
    <system-bar v-bind:activeProject="this.activeProject"></system-bar>
    <v-navigation-drawer permanent app floating left color="componentmain">
      <LeftDrawer v-bind:activeProject="activeProject" />
    </v-navigation-drawer>
    <v-main>
      <TabWrapper v-bind:activeProject="activeProject" :style="{ overflow: 'hidden', paddingBottom: 'var(--console-height)' }" />
    </v-main>
    <v-footer fixed app inset>
      <BuildConsole style="width: 100%;" />
    </v-footer>
    <notification-center />
  </v-app>
</template>

<script>
import LeftDrawer from "./LeftDrawer";
import SystemBar from "./SystemBar";
import TabWrapper from "./TabWrapper";
import BuildConsole from "./BuildConsole";
import NotificationCenter from './NotificationCenter.vue';
export default {
  name: "Editor",

  components: {
    LeftDrawer,
    TabWrapper,
    SystemBar,
    BuildConsole,
    NotificationCenter
  },

  data: () => ({
    activeProject: null
  }),
  created() {
    let data = this.$route.params.data;
    this.activeProject = data;
  },
};
</script>
