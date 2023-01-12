<template>
  <!-- spinner -->
  <div
    v-if="isLoading"
    style="
      position: absolute;
      top: 50%;
      left: 50%;
      margin-right: -50%;
      transform: translate(-50%, -50%);
      z-index: 9999;
    "
  >
    <div class="spinner-grow text-primary mr-2" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-primary mr-2" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-primary mr-2" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-primary mr-2" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    <div class="spinner-grow text-primary mr-2" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <!-- content -->
  <div v-else>
    <TheHeader />
    <div class="container-fluid">
      <div class="row">
        <TheNav :key="navKey" />
        <TheContent @change-key="updateNav" />
      </div>
    </div>
  </div>
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

import TheHeader from "./components/layouts/TheHeader.vue";
import TheNav from "./components/layouts/TheNav.vue";
import TheContent from "./components/TheContent.vue";

export default {
  components: {
    TheHeader,
    TheNav,
    TheContent,
  },

  data() {
    return {
      employees: [],
      teams: [],
      projects: [],
      isLoading: false,
      navKey: 0,
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
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

      await //gets all teams
      get(child(ref(database), "teams"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.teams.push({
                id: id,
                name: snapshot.val()[id].name,
                members: snapshot.val()[id].members,
              });
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      //gets all projects
      await get(child(ref(database), "projects"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.projects.push({
                id: id,
                name: snapshot.val()[id].name,
                startDate: snapshot.val()[id].startDate,
                endDate: snapshot.val()[id].endDate,
                team: snapshot.val()[id].team,
                projectManager: snapshot.val()[id].projectManager,
                teamLeader: snapshot.val()[id].teamLeader,
                tasks: snapshot.val()[id].tasks,
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

    updateNav() {
      this.navKey++;
    },
  },
};
</script>

<style>
body {
  font-size: 0.875rem;
}

.feather {
  width: 16px;
  height: 16px;
  vertical-align: text-bottom;
}

/*
 * Navbar
 */

.navbar-brand {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  font-size: 1rem;
  background-color: rgba(0, 0, 0, 0.25);
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.25);
}

.navbar .navbar-toggler {
  top: 0.25rem;
  right: 1rem;
}

.navbar .form-control {
  padding: 0.75rem 1rem;
  border-width: 0;
  border-radius: 0;
}

.form-control-dark {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
}

.form-control-dark:focus {
  border-color: transparent;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.25);
}

/*
*styles for tooltips
*/

[rel="tolltip"] {
  content: attr(title);
  z-index: 9999;
}

.tooltip-inner {
  max-width: 340px;
  background-color: #007bff !important;
}

.tooltip.bs-tooltip-right .arrow:before {
  border-right-color: #007bff !important;
}
.tooltip.bs-tooltip-left .arrow:before {
  border-left-color: #007bff !important;
}
.tooltip.bs-tooltip-bottom .arrow:before {
  border-bottom-color: #007bff !important;
}
.tooltip.bs-tooltip-top .arrow:before {
  border-top-color: #007bff !important;
}

/*
 * styles for tabs in components
 */

.nav-pills .active-list {
  color: #fff;
  background-color: #007bff !important;
}

.nav-pills .active-add {
  color: #fff;
  background-color: #28a745 !important;
}

.nav-pills .active-edit {
  color: #343a40;
  background-color: #ffc107 !important;
}

.nav-pills .active-delete {
  color: #fff;
  background-color: #dc3545 !important;
}
</style>
