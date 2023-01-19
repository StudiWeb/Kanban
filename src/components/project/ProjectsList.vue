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
            <th scope="col">Team leader</th>
            <th scope="col" class="text-center">See details</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(p, index) in projects"
            :key="p.id"
            style="line-height: 32px"
          >
            <td>{{ ++index }}</td>
            <td>{{ p.name }}</td>
            <td>{{ p.projectManager.name }}</td>
            <td>{{ p.teamLeader.name }}</td>
            <td class="text-center">
              <button
                type="button"
                class="btn btn-secondary"
                @click="seeProjectDetails(p)"
              >
                <i class="bi bi-eye"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <teleport to="body">
    <div class="modal fade" id="projectModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ name }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-6">
                <div class="font-weight-bold">Project manager</div>
                <div>{{ projectManager }}</div>
              </div>
              <div>
                <div class="font-weight-bold">Team leader</div>
                <div>{{ teamLeader }}</div>
              </div>
            </div>

            <div class="row my-2">
              <div class="col-6">
                <div class="font-weight-bold">Start date</div>
                <div>{{ startDate }}</div>
              </div>
              <div>
                <div class="font-weight-bold">End date</div>
                <div>{{ endDate }}</div>
              </div>
            </div>

            <div class="font-weight-bold mb-2">Team members</div>

            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Job</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(member, index) in team">
                  <td>{{ ++index }}</td>
                  <td>{{ member.name }}</td>
                  <td>{{ member.job }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="closeProjectModal"
              class="btn btn-primary"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
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
      name: "",
      projectManager: null,
      teamLeader: null,
      team: [],
      startDate: "",
      endDate: "",
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

    seeProjectDetails(project) {
      this.name = project.name;
      this.projectManager = project.projectManager.name;
      this.teamLeader = project.teamLeader.name;
      this.team = project.team.members;
      this.startDate = project.startDate;
      this.endDate = project.endDate;
      $("#projectModal").modal("show");
    },

    closeProjectModal() {
      $("#projectModal").modal("hide");
    },
  },
};
</script>
