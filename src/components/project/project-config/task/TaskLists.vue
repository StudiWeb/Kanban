<template>
  <div class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-3 mr-2">List of tasks</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isLoading" class="row mx-0">
    <div class="col-xl-6 px-0">
      <div
        v-if="tasks.length === 0"
        class="d-flex align-items-center alert alert-info"
        role="alert"
      >
        <i class="bi bi-exclamation-octagon mr-2" style="font-size: 24px"></i>
        <div>There are no any tasks.</div>
      </div>
      <table v-else class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Description</th>
            <th scope="col">Employees</th>
            <th scope="col">Start date</th>
            <th scope="col">End date</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(task, index) in tasks">
            <td>{{ ++index }}</td>
            <td>{{ task.name }}</td>
            <td>{{ task.description }}</td>
            <td>
              <div v-if="task.employees.find((e) => e.name === 'none')">
                none
              </div>
              <div v-else class="my-1" v-for="e in task.employees" :key="e.id">
                {{ e.name }} - <span class="font-italic">{{ e.job }}</span>
              </div>
            </td>
            <td>{{ task.startDate }}</td>
            <td>{{ task.endDate }}</td>
            <td>{{ task.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, push, get, child, ref } from "firebase/database";

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
  props: ["selectedProjectId"],

  data() {
    return {
      tasks: [],
      isLoading: false,
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      await get(
        child(ref(database), "projects/" + this.selectedProjectId + "/tasks")
      )
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.tasks.push({
                id: id,
                name: snapshot.val()[id].name,
                description: snapshot.val()[id].description,
                startDate: snapshot.val()[id].startDate,
                endDate: snapshot.val()[id].endDate,
                employees: snapshot.val()[id].employees,
                status: snapshot.val()[id].status,
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
  },
};
</script>
