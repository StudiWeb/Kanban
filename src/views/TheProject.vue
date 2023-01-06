<template>
  <div class="jumbotron">
    <h1 class="display-4 text-center">{{ projectName }}</h1>
  </div>

  <section class="mt-5 d-flex justify-content-around">
    <the-card title="To Do" type="todo" style="position: relative">
      <template #tasks>
        <TheTask
          v-for="t in toDoTasks"
          :key="t.id"
          :taskId="t.id"
          :projectId="projectId"
          @open-modal="openModal"
        />
      </template>
    </the-card>
    <the-card title="Doing" type="doing">
      <template #tasks>
        <TheTask
          v-for="t in doingTasks"
          :key="t.id"
          :taskId="t.id"
          :projectId="projectId"
          @open-modal="openModal"
        />
      </template>
    </the-card>
    <the-card title="Testing" type="testing">
      <template #tasks>
        <TheTask
          v-for="t in testingTasks"
          :key="t.id"
          :taskId="t.id"
          :projectId="projectId"
          @open-modal="openModal"
        />
      </template>
    </the-card>
    <the-card title="Done" type="done">
      <template #tasks>
        <TheTask
          v-for="t in doneTasks"
          :key="t.id"
          :taskId="t.id"
          :projectId="projectId"
          @open-modal="openModal"
        />
      </template>
    </the-card>

    <teleport to="body">
      <div
        class="toast hide bg-warning"
        id="toast"
        data-delay="4000"
        style="
          position: absolute;
          top: 50%;
          left: 50%;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
        "
      >
        <div class="toast-header">
          <strong class="mr-auto">Information</strong>
        </div>
        <div class="toast-body">
          You cannot move a task that does not have an assigned employee to it.
        </div>
      </div>
    </teleport>
  </section>

  <teleport to="body">
    <base-modal id="moveTaskModal">
      <template #header>Create task</template>
      <template #body>
        <div class="row">
          <div class="col-4 d-flex flex-column">
            <span class="font-weight-bold">Task name</span>{{ name }}
          </div>
          <div class="col-8 d-flex flex-column">
            <span class="font-weight-bold"
              >{{ employees.length === 1 ? "Employee" : "Employees" }}
            </span>
            <p v-if="employees.find((e) => e === 'none')">none</p>
            <p v-else class="mb-1" v-for="e in employees" :key="e.id">
              {{ e.name === "none" ? e.name : e.name - e.job }}
            </p>
          </div>
        </div>
        <div class="row my-2">
          <div class="col-4 d-flex flex-column">
            <span class="font-weight-bold">Start date</span>{{ startDate }}
          </div>
          <div class="col-8 d-flex flex-column">
            <span class="font-weight-bold">End date</span>{{ endDate }}
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-flex flex-column text-break">
            <span class="font-weight-bold">Task description</span>
            <p>{{ description }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-center">
          <div>
            <button
              @click="moveTaskToLeft"
              id="moveTaskToLeft"
              style="width: 60px"
              ref="moveTaskToLeft"
            >
              <i class="bi bi-arrow-left"></i>
            </button>
            <button
              @click="moveTaskToRight"
              id="moveTaskToRight"
              style="width: 60px"
              ref="moveTaskToRight"
            >
              <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child, update } from "firebase/database";

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
      taskId: "",
      name: "",
      startDate: "",
      endDate: "",
      description: "",
      employees: [],
      status: "",
      projectId: "",
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
        let doingTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "doing") {
            doingTasks.push({
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

        return doingTasks;
      }
    },

    testingTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let testingTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "testing") {
            testingTasks.push({
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

        return testingTasks;
      }
    },

    doneTasks() {
      if (this.project) {
        const tasks = this.project.tasks;
        let doneTasks = [];

        for (const id in tasks) {
          if (tasks[id].status === "done") {
            doneTasks.push({
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

        return doneTasks;
      }
    },
  },

  mounted() {
    this.projectId = this.$route.params.id;

    get(child(ref(database), `projects/${this.projectId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.project = {
            id: this.projectId,
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

  methods: {
    openModal(id, name, startDate, endDate, description, employees, status) {
      this.taskId = id;
      this.name = name;
      this.startDate = startDate;
      this.endDate = endDate;
      this.description = description;
      this.employees = employees;
      this.status = status;

      if (this.status === "todo") {
        this.$refs.moveTaskToLeft.disabled = true;
        this.$refs.moveTaskToRight.disabled = false;
        $("#moveTaskToLeft").removeClass().hide();
        $("#moveTaskToRight").removeClass().show();
        $("#moveTaskToLeft").addClass("btn btn-primary");
        $("#moveTaskToRight").addClass("btn btn-danger");
      }

      if (this.status === "doing") {
        this.$refs.moveTaskToLeft.disabled = false;
        this.$refs.moveTaskToRight.disabled = false;
        $("#moveTaskToLeft").removeClass().show();
        $("#moveTaskToRight").removeClass().show();
        $("#moveTaskToLeft").addClass("btn btn-primary");
        $("#moveTaskToRight").addClass("btn btn-warning ml-3");
      }

      if (this.status === "testing") {
        this.$refs.moveTaskToLeft.disabled = false;
        this.$refs.moveTaskToRight.disabled = false;
        $("#moveTaskToLeft").removeClass().show();
        $("#moveTaskToRight").removeClass().show();
        $("#moveTaskToLeft").addClass("btn btn-danger");
        $("#moveTaskToRight").addClass("btn btn-success ml-3");
      }
      if (this.status === "done") {
        this.$refs.moveTaskToLeft.disabled = false;
        this.$refs.moveTaskToRight.disabled = true;
        $("#moveTaskToLeft").removeClass().show();
        $("#moveTaskToRight").removeClass().hide();
        $("#moveTaskToLeft").addClass("btn btn-warning ml-3");
      }
      $("#moveTaskModal").modal("show");
    },

    moveTaskToLeft() {
      if (this.status === "doing") {
        this.updateTasks(this.status, "left");
      }
      if (this.status === "testing") {
        this.updateTasks(this.status, "left");
      }
      if (this.status === "done") {
        this.updateTasks(this.status, "left");
      }
    },
    moveTaskToRight() {
      if (this.status === "todo") {
        console.log(this.employees.find((e) => e.name === "none"));
        if (this.employees.find((e) => e.name === "none")) {
          $("#moveTaskModal").modal("hide");
          $("#toast").toast("show");
        } else {
          this.updateTasks(this.status, "right");
        }
      }
      if (this.status === "doing") {
        this.updateTasks(this.status, "right");
      }
      if (this.status === "testing") {
        this.updateTasks(this.status, "right");
      }
    },

    updateTasks(type, to) {
      let status = "";

      if (type === "todo" && to === "right") {
        status = "doing";
      }

      if (type === "doing" && to === "right") {
        status = "testing";
      }
      if (type === "testing" && to === "right") {
        status = "done";
      }
      if (type === "doing" && to === "left") {
        status = "todo";
      }

      if (type === "testing" && to === "left") {
        status = "doing";
      }
      if (type === "done" && to === "left") {
        status = "testing";
      }

      update(
        ref(database, "projects/" + this.projectId + "/tasks/" + this.taskId),
        {
          status: status,
        }
      )
        .then(() => {
          // Data saved successfully!
          get(child(ref(database), `projects/${this.projectId}`))
            .then((snapshot) => {
              if (snapshot.exists()) {
                this.project.tasks = snapshot.val().tasks;
              } else {
                console.log("No data available");
              }
            })
            .catch((error) => {
              console.error(error);
            });
        })
        .catch((error) => {
          // The write failed...
        });
      $("#moveTaskModal").modal("hide");
    },
  },
};
</script>
