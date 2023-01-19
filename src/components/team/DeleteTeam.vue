<template>
  <section>
    <div class="row">
      <div class="col-xl-6 d-flex align-items-center">
        <div class="h5 my-4 mr-2">Delete team</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
    <div v-if="isLoading === false" class="row">
      <div class="col-xl-6">
        <div class="form-group">
          <label>Select team</label>
          <select v-model="teamId" class="form-control">
            <option value="empty">none</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>
        <div
          v-if="takesPartInProject"
          class="d-flex align-items-center alert alert-info"
          role="alert"
        >
          <i class="bi bi-exclamation-octagon mr-2" style="font-size: 24px"></i>
          <div>This team takes part in a project. You cannot delete it.</div>
        </div>
        <div v-show="teamId !== 'empty'" class="card">
          <div class="card-header h5">{{ teamName }}</div>
          <div class="card-body d-flex flex-column">
            <h5 class="card-title mt-2 mb-4">Team members</h5>
            <table class="table table-striped">
              <thead>
                <th class="col-4">Name</th>
                <th class="col-4">Job position</th>
              </thead>
              <tbody>
                <tr v-for="member in teamMembers" :key="member.id">
                  <td>{{ member.name }}</td>
                  <td>{{ member.job }}</td>
                </tr>
              </tbody>
            </table>
            <button
              @click="openModal"
              class="btn btn-danger mr-4 align-self-end"
              ref="deleteProject"
            >
              Delete team
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="deleteTeamModal">
      <template #header>Delete team</template>
      <template #body>
        <div>
          <p><span class="font-weight-bold">Name: </span>{{ teamName }}</p>
          <p><span class="font-weight-bold">Team members</span></p>
          <table class="table table-striped">
            <thead>
              <th>Name</th>
              <th>Job position</th>
            </thead>
            <tbody>
              <tr v-for="member in teamMembers" :key="member.id">
                <td>{{ member.name }}</td>
                <td>{{ member.job }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <div class="d-flex align-items-baseline justify-content-between">
          Are you sure you want to delete this team?
          <div>
            <button @click="deleteTeam" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeModal" class="btn btn-primary">No</button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
      <template #header>Server response</template>
      <template #body>You have just deleted a team successfully!</template>
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
import { getDatabase, set, get, child, ref } from "firebase/database";

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
      teamId: "empty",
      selectedTeam: null,
      teams: [],
      projects: [],
      isLoading: false,
      takesPartInProject: false,
    };
  },

  computed: {
    teamName() {
      if (this.selectedTeam) {
        return this.selectedTeam.name;
      }
    },

    teamMembers() {
      if (this.selectedTeam) {
        return this.selectedTeam.members;
      }
    },
  },

  watch: {
    teamId(id) {
      if (id !== "empty") {
        this.selectedTeam = this.teams.find((t) => t.id === id);
        this.takesPartInProject = false;

        if (this.$refs.deleteProject) {
          this.$refs.deleteProject.disabled = false;
        }
        this.projects.forEach((p) => {
          if (p.team.id === id) {
            this.takesPartInProject = true;
            if (this.$refs.deleteProject) {
              this.$refs.deleteProject.disabled = true;
            }
          }
        });
      } else {
        this.selectedTeam = null;
      }
    },
  },
  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;

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
    openModal() {
      $("#deleteTeamModal").modal("show");
    },

    closeModal() {
      $("#deleteTeamModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    deleteTeam() {
      set(ref(database, "teams/" + this.selectedTeam.id), null);
      $("#deleteTeamModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>

<style scoped>
.card-header {
  font-weight: bold;
  text-align: center;
}
</style>
