import Vue from "vue";
import VueRouter from "vue-router";
import ProjectSelect from "../components/ProjectSelect.vue";
import Editor from "../components/Editor";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        name: "Project Select",
        component: ProjectSelect,
    },
    {
        path: "/editor",
        name: "Editor",
        component: Editor,
    },
];

const router = new VueRouter({
    routes,
});

export default router;
