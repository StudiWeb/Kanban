import { createRouter, createWebHistory } from "vue-router";

import TheWelcome from "./../views/TheWelcome.vue";
import ManageEmployees from "./../views/ManageEmployees.vue";
import TheProject from "./../views/TheProject.vue";
import ManageTeams from "../views/ManageTeams.vue";
import ManageProjects from "../views/ManageProjects.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/", component: TheWelcome },
    { path: "/manage-employees", component: ManageEmployees },
    { path: "/manage-teams", component: ManageTeams },
    { path: "/manage-projects", component: ManageProjects },
    { path: "/project/:id", component: TheProject },
  ],

  linkActiveClass: "active",
});

export default router;
