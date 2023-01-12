<template>
  <section>
    <div class="row mx-0">
      <div class="px-0 col-xl-6">
        <div class="d-flex align-items-center col-xl-6 px-0">
          <div class="h5 my-4 px-0 mr-2">Configure project</div>
          <div
            v-if="isLoading"
            class="spinner-border text-primary"
            role="status"
          >
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isLoading === false">
      <div class="row mx-0">
        <div class="px-0 col-xl-6 form-group">
          <label>Select project</label>
          <select v-model="selectedProjectId" class="form-control">
            <option value="empty" selected>none</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="isProjectSelected">
        <div class="row mx-0">
          <div class="col-xl-6 px-0">
            <ul class="my-4 nav nav-tabs">
              <li class="nav-item">
                <button
                  @click="setButtonActive(1)"
                  data-toggle="dropdown"
                  class="nav-link active dropdown-toggle"
                >
                  Project
                </button>
                <div class="dropdown-menu">
                  <a
                    @click="setComponent('project-configuration')"
                    class="dropdown-item"
                    href="#"
                    >Project configuration</a
                  >
                  <a
                    @click="setComponent('edit-project')"
                    class="dropdown-item"
                    href="#"
                    >Edit project</a
                  >
                </div>
              </li>
              <li class="nav-item">
                <button
                  @click="setButtonActive(2)"
                  data-toggle="dropdown"
                  class="nav-link dropdown-toggle"
                >
                  Tasks
                </button>
                <div class="dropdown-menu">
                  <a
                    @click="setComponent('task-lists')"
                    class="dropdown-item"
                    href="#"
                    >Task lists</a
                  >
                  <a
                    @click="setComponent('create-task')"
                    class="dropdown-item"
                    href="#"
                    >Create task</a
                  >
                  <a
                    @click="setComponent('edit-task')"
                    class="dropdown-item"
                    href="#"
                    >Edit task</a
                  >
                  <a
                    @click="setComponent('delete-task')"
                    class="dropdown-item"
                    href="#"
                    >Delete task</a
                  >
                </div>
              </li>
            </ul>
          </div>
        </div>
        <component
          :selectedProjectId="selectedProjectId"
          @change-key="changeKey"
          :is="componentName"
          :key="componentKey"
        >
        </component>
      </div>
    </div>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, child } from "firebase/database";

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

import ProjectConfiguration from "./project-config/configure-project/ProjectConfiguration.vue";
import EditProject from "./project-config/configure-project/EditProject.vue";
import CreateTask from "./project-config/task/CreateTask.vue";
import TaskLists from "./project-config/task/TaskLists.vue";
import DeleteTask from "./project-config/task//DeleteTask.vue";
import EditTask from "./project-config/task/EditTask.vue";

export default {
  components: {
    ProjectConfiguration,
    EditProject,
    TaskLists,
    CreateTask,
    DeleteTask,
    EditTask,
  },

  data() {
    return {
      selectedProjectId: "empty",
      componentName: "project-configuration",
      isProjectSelected: false,
      componentKey: 0,
      employees: [],
      projects: [],
      isLoading: false,
    };
  },

  watch: {
    selectedProjectId(newValue) {
      if (newValue !== "empty") {
        this.isProjectSelected = true;
      } else {
        this.isProjectSelected = false;
      }
      this.componentKey += 1;
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      await get(child(ref(database), "employees"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.employees.push({
                id: id,
                name: snapshot.val()[id].name,
                job: snapshot.val()[id].job,
                isProjectManager: snapshot.val()[id].isProjectManager,
                isTeamLeader: snapshot.val()[id].isTeamLeader,
              });
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      await get(child(ref(database), "projects"))
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
                tasks: snapshot.val()[id].tasks,
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

      this.isLoading = false;
    },

    setComponent(name) {
      this.componentName = name;
    },

    setButtonActive(number) {
      $(".nav-link").each(function () {
        $(this).removeClass("active");
      });
      const selector = ".nav-tabs li:nth-child(" + number + ") button";
      $(selector).addClass("active");
    },

    changeKey() {
      this.componentKey += 1;
    },
  },
};
</script>
