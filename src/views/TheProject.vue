<template>
  <div class="jumbotron">
    <h1 class="display-4 text-center">{{ projectName }}</h1>
  </div>

  <section class="mt-5 d-flex justify-content-around">
    <the-card title="To Do" type="todo">
      <template #tasks>
        <TheTask v-for="t in toDoTasks" :key="t.id" :task="t" type="todo" />
      </template>
    </the-card>
    <the-card title="Doing" type="doing">
      <template #tasks>
        <TheTask v-for="t in doingTasks" :key="t.id" :task="t" type="doing" />
      </template>
    </the-card>
    <the-card title="Testing" type="testing">
      <template #tasks>
        <TheTask
          v-for="t in testingTasks"
          :key="t.id"
          :task="t"
          type="testing"
        />
      </template>
    </the-card>
    <the-card title="Done" type="done">
      <template #tasks>
        <TheTask v-for="t in doneTasks" :key="t.id" :task="t" type="done" />
      </template>
    </the-card>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

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

import TheTask from "./../components/view-components/TheTask.vue";
import TheCard from "./../components/view-components/TheCard.vue";

export default {
  components: {
    TheCard,
    TheTask,
  },

  data() {
    return {
      project: null,
      tasks: [],
    };
  },

  computed: {
    projectName() {
      if (this.project) {
        return this.project.name;
      }
    },

    toDoTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let toDoTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "todo") {
            toDoTasks.push({
              id: id,
              name: tasks[id].name,
              startDate: tasks[id].startDate,
              endDate: tasks[id].endDate,
              description: tasks[id].description,
              employees: tasks[id].employees,
              status: tasks[id].status,
            });
          }
        }

        return toDoTasks;
      }
    },

    doingTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let toDoTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "doing") {
            toDoTasks.push({
              id: id,
              name: tasks[id].name,
              startDate: tasks[id].startDate,
              endDate: tasks[id].endDate,
              description: tasks[id].description,
              employees: tasks[id].employees,
              status: tasks[id].status,
            });
          }
        }

        return toDoTasks;
      }
    },

    testingTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let toDoTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "testing") {
            toDoTasks.push({
              id: id,
              name: tasks[id].name,
              startDate: tasks[id].startDate,
              endDate: tasks[id].endDate,
              description: tasks[id].description,
              employees: tasks[id].employees,
              status: tasks[id].status,
            });
          }
        }

        return toDoTasks;
      }
    },

    doneTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let toDoTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "done") {
            toDoTasks.push({
              id: id,
              name: tasks[id].name,
              startDate: tasks[id].startDate,
              endDate: tasks[id].endDate,
              description: tasks[id].description,
              employees: tasks[id].employees,
              status: tasks[id].status,
            });
          }
        }

        return toDoTasks;
      }
    },
  },

  mounted() {
    const projectId = this.$route.params.id;

    get(child(ref(database), `projects/${projectId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.project = {
            id: projectId,
            name: snapshot.val().name,
            startDate: snapshot.val().startDate,
            endDate: snapshot.val().endDate,
            projectManager: snapshot.val().projectManager,
            teamLeader: snapshot.val().teamLeader,
            team: snapshot.val().team,
            tasks: snapshot.val().tasks,
            isProjectVisible: snapshot.val().isProjectVisible,
          };
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
