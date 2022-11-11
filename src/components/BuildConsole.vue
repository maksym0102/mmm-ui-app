<template>
    <div class="console-container" ref="consoleContainer">
        <div
            class="console-resize-handle"
            :class="{
                purple: isDragging && $vuetify.theme.dark,
                accent: isDragging && !$vuetify.theme.dark,
                'darken-4': $vuetify.theme.dark,
                'lighten-2': !$vuetify.theme.dark,
            }"
            @mousedown.stop="handleMouseDown"
            @dragstart.prevent
        ></div>
        <v-tabs
            dark
            ref="header"
            background-color="blue-grey darken-4"
            show-arrows
            height="30"
            v-model="tabname"
        >
            <v-tabs-slider color="blue-grey darken-6"></v-tabs-slider>

            <v-tab
                v-for="item in tabs"
                :key="item.tabname"
                class="pr-0 white--text"
                color="accent"
                active-class=""
            >
                <template class="white--text text-capitalize" v-if='item.tabname === "Build Output"'>
                    {{ item.tabname }}
                </template>
                <template class="white--text text-capitalize" v-if='item.tabname === "Build Errors"'>
                    <v-badge v-if='buildErrors.length > 0' inline color="red" :content="buildErrors.length">
                        {{ item.tabname }}
                    </v-badge>
                    <span v-else>{{ item.tabname }}</span>
                </template>
                
            </v-tab>
        </v-tabs>
        <v-tabs-items v-model="tabname">
            <v-flex class="terminal-controls py-2" ref="controlsContainer">
                <v-btn title="Save to file" @click="saveConsoleToFile" :disabled="!messages.length">
                    <v-icon>
                        mdi-content-save-outline
                    </v-icon>
                </v-btn>
                <v-btn title="Clean console" @click="cleanConsole">
                    <v-icon>
                        mdi-close-circle-outline
                    </v-icon>
                </v-btn>
            </v-flex>
            <v-tab-item
                v-for="item in tabs"
                class="console"
                :ref="item.tabname === 'Build Output' ? 'buildoutput' : 'builderror'"
                :key="item.tabname"
                :style="{
                    height: getValueInPixels(height),
                    overflowY: 'scroll',
                }"
                :transition="false"
            >
                <div class="ma-2" v-if='item.tabname === "Build Output"'>
                    <p
                        v-for="msg in messages"
                        :key="msg.id"
                        class="console-text mb-0 mt-0"
                        :class="msg.type"
                    >
                        {{ msg.text }}
                    </p>
                </div>
                <div class="ma-2" v-if='item.tabname === "Build Errors"'>
                      <v-row justify="center">
                        <v-expansion-panels 
                        accordion
                        multiple
                        >
                        <v-expansion-panel
                            v-for="(item, index) in buildErrors"
                            :key="index"
                        >
                            <v-expansion-panel-header class="justify-self-start" disable-icon-rotate>
                                <div>
                                    <v-icon color="error" class="mr-5">mdi-alert-circle</v-icon>
                                    <span class="header">Error</span>
                                </div>
                            </v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <span style="white-space: pre-wrap !important;">{{item.message}}</span>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        </v-expansion-panels>
                    </v-row>
                </div>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
import { debounce } from "../helpers/throttle";
import { v4 as uuid } from 'uuid';
import { BROWSER_EVENTS, CONSOLE_MESSAGE_TYPES, NOTIFICATION_ACTIONS } from '../modules/constants';
import { NOTIFICATION_TYPES } from './NotificationCenter.vue';
const HANDLE_HEIGHT = 6;
const GAP_BETWEEN_CONTROLS_CONSOLE = 20;

export default {
    name: "BuildConsole",
    data: () => ({
        tabs: [{ tabname: "Build Output" }, { tabname: "Build Errors"}],
        tabname: "Build Output",
        consoleText: "",
        messages: [],
        height: 200,
        isDragging: false,
        headerHeight: 30,
        alert: {},
        buildErrors: []
    }),
    computed: {
        showAlert() {
            return Boolean(this.alert?.status);
        }
    },
    mounted() {
        this.$root.$on(NOTIFICATION_ACTIONS.BUILD_ERROR, this.buildError);
        this.$root.$on(NOTIFICATION_ACTIONS.BUILD_STARTED, this. onBuildStarted);
        this.$root.$on("build-project", (data) => {
            this.writeToConsole("Building project: " + data + "...");
        });
        window.ipc.on(BROWSER_EVENTS.BUILD, (event) => {
            this.writeToConsole(event.message, event.level);
        });
        this.headerHeight = this.$refs.header?.$el?.clientHeight || 0;
        this.setFooterHeight = debounce(this.setFooterHeight.bind(this), 200);
        this.setFooterHeight(this.height);
        this.setConsoleOffset();
        this.setConsoleOffset = debounce(this.setConsoleOffset.bind(this), 200);
        window.addEventListener("resize", this.setConsoleOffset);
    },
    beforeDestroy() {
        this.stopResizing();
        document.documentElement.removeEventListener(
            "mouseup",
            this.stopResizing
        );
        document.body.removeEventListener("mouseleave", this.stopResizing);
        document.body.classList.remove("dragging");
        window.removeEventListener("resize", this.setFooterHeight);
        window.removeEventListener("resize", this.setConsoleOffset);
    },
    methods: {
         onBuildStarted() {
            this.buildErrors = [];
            this.messages = [];
        },
        buildError(notification) {
            this.tabname = "Build Errors";
            this.buildErrors.push(notification);
        },
        async writeToConsole(text, level = 'INFO') {
            let now = new Date();
            try {
                this.messages.push({
                    text: `[${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}] [${level}] ${text}\n`,
                    type: CONSOLE_MESSAGE_TYPES.INFO,
                    id: uuid()
                });
            } catch (error) {
                console.log("Write to console: " + error);
            }
            
            await this.$nextTick();

            this.$refs.buildoutput.forEach((buildOutputDiv) => {
                if(!buildOutputDiv) return;
                const el = buildOutputDiv.$el;
                try {
                    // Try smooth scrolling
                    el.scrollBy({
                        top: el.scrollHeight,
                        left: 0,
                        behavior: "smooth",
                    });
                } catch (error) {
                    el.scrollBy(0, el.scrollHeight);
                    console.error(error);
                }
            });
        },
        getValueInPixels(val) {
            return `${val}px`;
        },
        handleMouseDown(e) {
            e.preventDefault();
            this.isDragging = true;

            document.body.style.userSelect = "none";
            document.documentElement.addEventListener(
                "mousemove",
                this.handleResize
            );
            document.documentElement.addEventListener(
                "mouseup",
                this.stopResizing
            );
            document.body.addEventListener("mouseleave", this.stopResizing);
        },
        handleResize(e) {
            e.stopPropagation();
            this.height =
                window.innerHeight -
                e.clientY -
                this.headerHeight -
                HANDLE_HEIGHT;
        },
        stopResizing() {
            this.isDragging = false;
            document.body.style.userSelect = "";
            document.documentElement.removeEventListener(
                "mousemove",
                this.handleResize
            );
        },
        setFooterHeight(consoleHeight) {
            document.body.style.setProperty(
                "--console-height",
                consoleHeight + this.headerHeight + HANDLE_HEIGHT + "px"
            );
        },
        async saveConsoleToFile() {
            const { status, message } = await window.ipc.invoke("fileSystem", {
                func: "saveFile",
                data: {
                    dialogTitle: "Save console log to file...",
                    defaultPath: "Console log.txt",
                    content: this.messages.map(({ text }) => text).join("\n"),
                },
            });

            if (status === 'canceled') return;

            this.$root.$emit("push-notification", { 
                type: status, 
                message,
                time: 5000,
                outlined: true
            });
        },
        cleanConsole() {
            this.messages = [];
        },
        setConsoleOffset() {
            const containerWidth = this.$refs.consoleContainer.clientWidth;
            const controlsLeft = this.$refs.controlsContainer.offsetLeft;
            const consoleOffset = containerWidth - (containerWidth - controlsLeft);
            document.body.style.setProperty(
                "--console-offset",
                consoleOffset + GAP_BETWEEN_CONTROLS_CONSOLE + "px"
            );
        },
    },
    watch: {
        isDragging(state) {
            if (state) {
                document.body.classList.add("dragging");
            } else {
                document.body.classList.remove("dragging");
            }
        },
        height(height) {
            this.setFooterHeight(height);
        },
    },
};
</script>

<style scoped>
.console-container {
    position: relative;
}

.console-resize-handle {
    position: absolute;
    top: -6px;
    width: 100%;
    height: 6px;
    padding: 2px 0;
    cursor: s-resize;
}

.console-resize-handle::before {
    content: "";
    display: block;
    height: 100%;
    border-radius: 2px;
    opacity: 0.4;
    transition: opacity 0.35s;
}

.console-resize-handle:hover::before {
    opacity: 0.8;
}

.theme--dark .console-resize-handle::before {
    background: #fff;
}

.theme--light .console-resize-handle::before {
    background: #000;
}

.dragging .console-resize-handle {
    cursor: inherit;
}

.console {
    position: relative;
    max-height: calc(100vh - 104px);
    padding-right: var(--controls-width, 150px);
}

.console::after {
    content: '';
    display: table;
    clear: both;
}

.terminal-controls {
    position: absolute;
    top: 0;
    right: 14px;
    z-index: 2;
}

.console-alert {
    position: fixed;
    bottom: 0;
    right: 16px;
    z-index: 2;
}

.console-text {
    word-wrap: break-word;
}
</style>
