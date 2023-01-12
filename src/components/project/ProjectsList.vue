<template>
  <section class="row flex-column mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">List of projects</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div
      v-if="numberOfProjects === 0 && isLoading === false"
      class="d-flex align-items-center alert alert-info col-xl-6"
      role="alert"
    >
      <i class="bi bi-exclamation-octagon" style="font-size: 24px"></i>
      <div class="ml-2">There are no any projects.</div>
    </div>

    <div
      v-if="numberOfProjects !== 0 && isLoading === false"
      class="col-xl-6 px-0"
    >
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Project name</th>
            <th scope="col">Project manager</th>
            <th scope="col">Team</th>
            <th scope="col">Start date</th>
            <th scope="col">End date</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, index) in projects"
            :key="p.id"
            @mouseover="showTooltip(p.id)"
            class="project"
            rel="tooltip"
            data-html="true"
            data-toggle="tooltip"
            data-placement="bottom"
            :title="tooltip"
          >
            <td>{{ ++index }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.projectManager.name }}</td>
            <td>{{ p.team.name }}</td>
            <td>{{ p.startDate }}</td>
            <td>{{ p.endDate }}</td>
          </tr>
        </tbody>
      </table>
    </div>
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
      projects: [],
      tooltip: "",
      isLoading: false,
    };
  },

  computed: {
    numberOfProjects() {
      if (this.projects) {
        return this.projects.length;
      }
    },
  },

  mounted() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $("body").tooltip({
        selector: '[rel="tooltip"]',
      });
    });

    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
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

    showTooltip(projectId) {
      if (this.projects.length > 0) {
        this.tooltip = '<div class="font-weight-bold">Project members</div>';
        const members = this.projects.find(
          (project) => project.id === projectId
        ).team.members;
        members.forEach((m) => {
          let job = m.isSelectedAsProjectManager
            ? m.job + ' <span class="font-weight-bold">' + "(PM) " + "</span>"
            : m.job;
          job += m.isSelectedAsTeamLeader
            ? '<span class="font-weight-bold">' + "(TL) " + "</span>"
            : "";
          this.tooltip +=
            '<div class="my-2">' +
            m.name +
            " - " +
            "<span>" +
            job +
            "</span>" +
            "</div>";
        });
      }
    },
  },
};
</script>

<style scoped>
.project:hover {
  cursor: pointer;
}
</style>
