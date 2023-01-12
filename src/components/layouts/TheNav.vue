<template>
  <sidebar-menu>
    <sidebar-heading>STAFF</sidebar-heading>
    <list-column>
      <NavItem title="Manage employees" page="manage-employees" />
      <NavItem title="Manage teams" page="manage-teams" />
    </list-column>
    <sidebar-heading>PROJECT MANAGMENT</sidebar-heading>
    <list-column>
      <NavItem title="Manage projects" page="manage-projects" />
    </list-column>
    <sidebar-heading>PROJECTS</sidebar-heading>
    <list-column>
      <ProjectLink
        v-for="p in projects"
        :key="p.id"
        :title="p.name"
        :id="p.id"
        :isVisible="p.isVisible"
        page="project"
      />
    </list-column>
  </sidebar-menu>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, get, child, ref } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBiWEX-ygigO9Kj04kWtjASKLJ3RX20uuM",
  authDomain: "vue-kanban-5ad84.firebaseapp.com",
  databaseURL:
    "https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "vue-kanban-5ad84",
  storageBucket: "vue-kanban-5ad84.appspot.com",
  messagingSenderId: "538900623860",
  appId: "1:538900623860:web:330924a5a67488f22109a1",
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

import NavItem from "./NavItem.vue";
import ProjectLink from "./ProjectLink.vue";
import SidebarMenu from "../UI/SidebarMenu.vue";
import ListColumn from "../UI/ListColumn.vue";
import SidebarHeading from "../UI/SidebarHeading.vue";

export default {
  components: {
    NavItem,
    ProjectLink,
    SidebarMenu,
    ListColumn,
    SidebarHeading,
  },

  data() {
    return {
      projects: [],
    };
  },

  mounted() {
    get(child(ref(database), "projects"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (const id in snapshot.val()) {
            this.projects.push({
              id: id,
              name: snapshot.val()[id].name,
              startDate: snapshot.val()[id].startDate,
              endDate: snapshot.val()[id].endDate,
              projectManager: snapshot.val()[id].projectManager,
              teamLeader: snapshot.val()[id].teamLeader,
              team: snapshot.val()[id].team,
              isVisible: snapshot.val()[id].isVisible,
            });
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },
};
</script>
