<template>
  <section>
    <div class="row mx-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 px-0 mr-2">Delete project</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-if="isLoading === false">
      <div class="row mx-0">
        <div class="form-group col-xl-6 px-0">
          <label>Select project</label>
          <select v-model="projectId" class="form-control">
            <option value="empty" selected>none</option>
            <option v-for="p in projects" :key="p.id" :value="p.id">
              {{ p.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="row mx-0">
        <div class="card col-xl-6 px-0" v-if="canShowProjectDetails">
          <div class="card-header h5 text-center">{{ projectName }}</div>
          <div class="card-body d-flex flex-column">
            <div class="row">
              <div class="col-3 mt-2 d-flex flex-column">
                <span class="font-weight-bold">Project manager</span
                >{{ projectManagerName }}
              </div>
              <div class="col-3 mt-2 d-flex flex-column">
                <span class="font-weight-bold">Team leader</span>
                {{ teamLeaderName }}
              </div>
              <div class="col-3 mt-2 d-flex flex-column">
                <span class="font-weight-bold">Start date</span>{{ startDate }}
              </div>
              <div class="col-3 mt-2 d-flex flex-column">
                <span class="font-weight-bold">End date</span>{{ endDate }}
              </div>
            </div>
            <div class="row p-3 flex-column">
              <div class="mt-2 mb-4">
                <span class="font-weight-bold">Team members</span>
              </div>
              <table class="table table-striped">
                <thead>
                  <th>Name</th>
                  <th>Job position</th>
                  <th class="text-center">Project manager</th>
                  <th class="text-center">Team leader</th>
                </thead>
                <tbody>
                  <tr v-for="m in projectMembers">
                    <td>{{ m.name }}</td>
                    <td>{{ m.job }}</td>
                    <td class="text-center">
                      <i
                        v-if="m.isSelectedAsProjectManager"
                        class="bi bi-check"
                        style="font-size: 16px"
                      ></i>
                      <i v-else class="bi bi-dash" style="font-size: 16px"></i>
                    </td>
                    <td class="text-center">
                      <i
                        v-if="m.isSelectedAsTeamLeader"
                        class="bi bi-check"
                        style="font-size: 16px"
                      ></i>
                      <i v-else class="bi bi-dash" style="font-size: 16px"></i>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <button
              @click="openDeleteProjectModal"
              class="btn btn-danger mr-4 align-self-end"
            >
              Delete project
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="deleteProjectModal">
      <template #header>Delete project</template>
      <template #body>
        <div class="row">
          <div class="col-6 mt-2 d-flex flex-column">
            <span class="font-weight-bold">Project manager</span
            >{{ projectManagerName }}
          </div>
          <div class="col-6 mt-2 d-flex flex-column">
            <span class="font-weight-bold">Team leader</span>
            {{ teamLeaderName }}
          </div>
        </div>
        <div class="row">
          <div class="col-6 mt-2 d-flex flex-column">
            <span class="font-weight-bold">Start date</span>{{ startDate }}
          </div>
          <div class="col-6 mt-2 d-flex flex-column">
            <span class="font-weight-bold">End date</span>{{ endDate }}
          </div>
        </div>
        <div class="mt-2 mb-4 d-flex flex-column">
          <span class="font-weight-bold">Team members</span>
        </div>
        <table class="table table-striped">
          <thead>
            <th>Name</th>
            <th>Job position</th>
            <th class="text-center">Project manager</th>
            <th class="text-center">Team leader</th>
          </thead>
          <tbody>
            <tr v-for="m in projectMembers">
              <td>{{ m.name }}</td>
              <td>{{ m.job }}</td>
              <td class="text-center">
                <i
                  v-if="m.isSelectedAsProjectManager"
                  class="bi bi-check"
                  style="font-size: 16px"
                ></i>
                <i v-else class="bi bi-dash" style="font-size: 16px"></i>
              </td>
              <td class="text-center">
                <i
                  v-if="m.isSelectedAsTeamLeader"
                  class="bi bi-check"
                  style="font-size: 16px"
                ></i>
                <i v-else class="bi bi-dash" style="font-size: 16px"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between">
          <p>Are you sure you want to delete this project?</p>
          <div>
            <button @click="deleteProject" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeDeleteProjectModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal">
      <template #header>Server response</template>
      <template #body>You have just deleted the project.</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeServerResponseModal" class="btn btn-primary">
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, child } from "firebase/database";

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
  emits: ["change-key"],

  data() {
    return {
      projectId: "empty",
      project: null,
      projectManager: null,
      teamLeader: null,
      canShowProjectDetails: false,
      isLoading: false,
      projects: [],
    };
  },

  computed: {
    projectName() {
      if (this.project) {
        return this.project.name;
      }
    },

    projectMembers() {
      if (this.project) {
        this.project.team.members.find(
          (m) => m.id === this.project.projectManager.id
        ).isSelectedAsProjectManager = true;
        this.project.team.members.find(
          (m) => m.id === this.project.teamLeader.id
        ).isSelectedAsTeamLeader = true;
        return this.project.team.members;
      }
    },

    projectManagerName() {
      if (this.project) {
        return this.project.projectManager.name;
      }
    },

    teamLeaderName() {
      if (this.project) {
        return this.project.teamLeader.name;
      }
    },

    startDate() {
      if (this.project) {
        return this.project.startDate;
      }
    },
    endDate() {
      if (this.project) {
        return this.project.endDate;
      }
    },
  },

  watch: {
    projectId(id) {
      if (id !== "empty") {
        this.project = this.projects.find((p) => p.id === id);
        this.canShowProjectDetails = true;
      } else {
        this.canShowProjectDetails = false;
      }
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
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
                isProjectVisible: snapshot.val()[id].isProjectVisible,
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

    openDeleteProjectModal() {
      $("#deleteProjectModal").modal("show");
    },

    closeDeleteProjectModal() {
      $("#deleteProjectModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
      this.$parent.$parent.$parent.$emit("change-key");
    },

    deleteProject() {
      set(ref(database, "projects/" + this.projectId), null);
      $("#deleteProjectModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
