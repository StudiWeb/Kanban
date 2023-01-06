<template>
  <div class="card my-2" style="width: 240px">
    <button
      class="card-header d-flex justify-content-between align-items-center"
      @click="showTask"
    >
      <p class="h6">{{ name }}</p>
      <i v-if="showTaskDetails === false" class="bi bi-caret-down-fill"></i>
      <i v-else class="bi bi-caret-up-fill"></i>
    </button>
    <div v-if="showTaskDetails" class="card-body d-flex flex-column">
      <div class="my-1">
        <span class="font-weight-bold">
          {{ employees.length > 1 ? "Employees: " : "Employee" }}
        </span>
        <div v-for="e in employees" :key="e.id">{{ e.name }}</div>
      </div>
      <div
        class="d-flex justify-content-between align-items-baseline flex-wrap"
      >
        <span class="font-weight-bold">Task description</span>
        <button
          @click="showDescription"
          type="button"
          class="btn seeDescriptionBtn"
        >
          <i
            v-if="showTaskDescription === false"
            class="bi bi-caret-down-fill"
          ></i>
          <i v-else class="bi bi-caret-up-fill"></i>
        </button>
        <p v-if="showTaskDescription" class="col-12 my-1">
          {{ description }}
        </p>
      </div>
      <div class="my-1">
        <span class="font-weight-bold">Start date: </span>{{ startDate }}
      </div>
      <div class="my-1">
        <span class="font-weight-bold">End date: </span>{{ endDate }}
      </div>
      <button @click="openMoveTaskModal" class="btn btn-light my-1">
        Move task
      </button>
    </div>
  </div>
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

export default {
  props: ["projectId", "taskId"],

  data() {
    return {
      task: null,
      showTaskDetails: false,
      showTaskDescription: false,
    };
  },

  computed: {
    id() {
      if (this.task) {
        return this.task.id;
      }
    },

    name() {
      if (this.task) {
        return this.task.name;
      }
    },

    startDate() {
      if (this.task) {
        return this.task.startDate;
      }
    },

    endDate() {
      if (this.task) {
        return this.task.endDate;
      }
    },
    description() {
      if (this.task) {
        return this.task.description;
      }
    },
    employees() {
      if (this.task) {
        const assignedEmployees = this.task.employees;

        if (assignedEmployees === "none") {
          return assignedEmployees;
        } else {
          let employees = [];

          for (const id in this.task.employees) {
            employees.push({
              id: assignedEmployees[id].id,
              name: assignedEmployees[id].name,
              job: assignedEmployees[id].job,
            });
          }
          return employees;
        }
      }
    },

    status() {
      if (this.task) {
        return this.task.status;
      }
    },
  },

  mounted() {
    get(child(ref(database), `projects/${this.projectId}/tasks/${this.taskId}`))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.task = {
            id: this.taskId,
            name: snapshot.val().name,
            startDate: snapshot.val().startDate,
            endDate: snapshot.val().endDate,
            description: snapshot.val().description,
            employees: snapshot.val().employees,
            status: snapshot.val().status,
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
    showTask() {
      this.showTaskDetails = !this.showTaskDetails;
    },

    showDescription() {
      this.showTaskDescription = !this.showTaskDescription;
    },

    openMoveTaskModal() {
      this.$emit(
        "open-modal",
        this.id,
        this.name,
        this.startDate,
        this.endDate,
        this.description,
        this.employees,
        this.status
      );
    },
  },
};
</script>

<style scoped>
button {
  border: none;
}
.seeDescriptionBtn {
  box-shadow: none;
  background-color: rgba(0, 0, 0, 0.03);
}
</style>
