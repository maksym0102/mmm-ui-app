<template>
  <div
    class="notification-center"
    :class="{ 'has-items': visibleNotifications.length }"
  >
    <v-alert
      v-for="notification in notifications"
      :key="notification.id"
      :type="notification.type"
      v-model="notification.show"
      :dismissible="true"
      :outlined="notification.outlined"
      transition="scroll-x-transition"
    >
      <div class="notification-message">{{ notification.message }}</div>
    </v-alert>
  </div>
</template>

<script>
import { v4 as uuid } from "uuid";
import { NOTIFICATION_ACTIONS } from "../modules/constants";

export const NOTIFICATION_TYPES = {
  INFO: "info",
  ERROR: "error",
  WARNING: "warning",
  SUCCESS: "success",
};

export const NOTIFICATION_DISPLAY_TIME = 4000;

export default {
  name: "NotificationCenter",
  data() {
    return {
      notifications: [],
    };
  },
  methods: {
    pushNotification(notification) {
      const notificationConfig = {
        ...this.getDefaultNotificationProps(),
        ...notification,
      };
      if (!this.notifications.find(n => n.message === notification.message))
      this.notifications.push(notificationConfig);

      if (notificationConfig.time) {
        this.setTimer(notificationConfig);
      }
    },
    getDefaultNotificationProps() {
      return {
        id: uuid(),
        type: NOTIFICATION_TYPES.INFO,
        show: true,
        time: NOTIFICATION_DISPLAY_TIME,
        timer: null,
        outlined: false,
      };
    },
    setTimer(notification) {
      const { id, time } = notification;
      notification.timer = setTimeout(
        () => this.hideNotificationById(id),
        time
      );
    },
    async hideNotificationById(id) {
      this.notifications = this.notifications.filter(n => n.id !== id);
    },
  },
  computed: {
    visibleNotifications() {
      return this.notifications.filter((n) => n.show);
    },
  },
  mounted() {
    this.$root.$on(NOTIFICATION_ACTIONS.PUSH, this.pushNotification);
  },
  beforeDestroy() {
    this.$root.$off(NOTIFICATION_ACTIONS.PUSH, this.pushNotification);
  },
};
</script>

<style>
.notification-center {
  position: fixed;
  bottom: 0;
  right: 0;
  z-index: 8;
  max-width: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.notification-center.has-items {
  padding: 15px;
}

.notification-center > * {
  pointer-events: all;
}

.notification-center .v-alert__content {
  max-width: calc(100% - 38px);
  word-break: break-word;
}

.notification-message {
  white-space: pre-wrap;
}
</style>
