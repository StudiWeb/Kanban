<template>
  <section class="row mx-0 d-flex flex-column">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">List of employees</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div
      v-if="numberOfEmployees === 0"
      class="d-flex align-items-center alert alert-info col-xl-6"
      role="alert"
    >
      <i class="bi bi-exclamation-octagon" style="font-size: 24px"></i>
      <div class="ml-2">There are no any employees.</div>
    </div>

    <table
      v-if="isLoading === false && numberOfEmployees !== 0"
      class="col-xl-6 table table-striped"
      id="list"
    >
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Name</th>
          <th scope="col">Job Position</th>
          <th scope="col" class="text-center">Project Manager</th>
          <th scope="col" class="text-center">Team Leader</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(e, index) in employees" :key="e.id">
          <td>{{ ++index }}</td>
          <td>{{ e.name }}</td>
          <td>{{ e.job }}</td>
          <td class="text-center">
            <i v-if="e.isProjectManager" class="bi bi-check"></i>
            <i v-else class="bi bi-dash"></i>
          </td>
          <td class="text-center">
            <i v-if="e.isTeamLeader" class="bi bi-check"></i>
            <i v-else class="bi bi-dash"></i>
          </td>
        </tr>
      </tbody>
    </table>
  </section>
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

export default {
  data() {
    return {
      employees: [],
      isLoading: false,
    };
  },

  computed: {
    numberOfEmployees() {
      if (this.employees) {
        return this.employees.length;
      }
    },
  },

  mounted() {
    this.loadEmployees();
  },

  methods: {
    async loadEmployees() {
      this.isLoading = true;
      //gets all employees
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
      this.isLoading = false;
    },
  },
};
</script>
