<template>
  <div v-if="isLoading" class="col-xl-6 px-0">
    <div class="d-flex align-items-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>

  <div v-if="!isLoading" class="col-xl-6 px-0">
    <div class="form-group">
      <label>Select team</label>
      <select v-model="teamId" class="form-control" id="team">
        <option value="empty"></option>
        <option v-for="t in teams" :key="t.id" :value="t.id">
          {{ t.name }}
        </option>
      </select>
    </div>
    <div class="form-group">
      <label>Project manager</label>
      <select
        v-model="projectManagerId"
        @change="selectSupervisor('projectManager')"
        ref="projectManagerSelect"
        class="form-control"
        id="projectManager"
        disabled
      >
        <option value="empty">none</option>
        <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">
          {{ pm.name }}
        </option>
      </select>
    </div>
    <div class="px-0 form-group">
      <label>Team leader</label>
      <select
        v-model="teamLeaderId"
        @change="selectSupervisor('teamLeader')"
        id="teamLeader"
        ref="teamLeaderSelect"
        class="form-control"
        disabled
      >
        <option value="empty">none</option>
        <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">
          {{ tl.name }}
        </option>
      </select>
    </div>

    <div class="card col-xl-12 px-0" v-if="teamId !== 'empty'">
      <div class="card-header h5 text-center">
        {{ projectName === "" ? "Project name" : projectName }}
      </div>
      <div class="card-body d-flex flex-column">
        <div class="card-title mt-2 mb-4 h5">{{ teamName }}</div>
        <table class="table table-striped">
          <thead>
            <th>Name</th>
            <th>Job position</th>
            <th class="text-center">Project manager</th>
            <th class="text-center">Team leader</th>
          </thead>
          <tbody>
            <tr v-for="member in projectMembers" :key="member.id">
              <td>{{ member.name }}</td>
              <td>{{ member.job }}</td>
              <td class="text-center">
                <i
                  v-if="member.isSelectedAsProjectManager"
                  class="bi bi-check"
                  style="font-size: 16px"
                ></i>
                <i v-else class="bi bi-dash" style="font-size: 16px"></i>
              </td>
              <td class="text-center">
                <i
                  v-if="member.isSelectedAsTeamLeader"
                  class="bi bi-check"
                  style="font-size: 16px"
                ></i>
                <i v-else class="bi bi-dash" style="font-size: 16px"></i>
              </td>
            </tr>
          </tbody>
        </table>

        <button @click="openModal" class="btn btn-success mr-4 align-self-end">
          Add project
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, get, update, child, push, ref } from "firebase/database";

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
  emits: ["existing-team"],

  props: ["projectName"],

  data() {
    return {
      teamId: "empty",
      teamName: "",
      projectManagerId: "empty",
      projectManager: null,
      teamLeaderId: "empty",
      teamLeader: null,
      projectMembers: [],
      teams: [],
      projectManagers: [],
      teamLeaders: [],
      isLoading: false,
    };
  },

  watch: {
    teamId(id) {
      if (id !== "empty") {
        //gets selected team
        get(child(ref(database), "teams/" + id))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.teamName = snapshot.val().name;
              this.projectMembers = snapshot.val().members;
              this.$refs.projectManagerSelect.disabled = false;
              this.$refs.teamLeaderSelect.disabled = false;
            } else {
              console.log("No teams data available");
            }
          })
          .catch((error) => {
            console.error(error);
          });

        $("#team").addClass("is-valid");
      } else {
        this.projectManagerId = "empty";
        this.teamLeaderId = "empty";
        this.projectMembers = [];
        this.$refs.projectManagerSelect.disabled = true;
        this.$refs.teamLeaderSelect.disabled = true;
        $("#team").removeClass("is-valid");
      }
    },

    projectManagerId(id) {
      if (id !== "empty") {
        $("#projectManager").removeClass("is-invalid");
        $("#projectManager").addClass("is-valid");
      } else {
        $("#projectManager").removeClass("is-valid");
        $("#projectManager").addClass("is-invalid");
      }
    },

    teamLeaderId(id) {
      if (id !== "empty") {
        $("#teamLeader").removeClass("is-invalid");
        $("#teamLeader").addClass("is-valid");
      } else {
        $("#teamLeader").removeClass("is-valid");
        $("#teamLeader").addClass("is-invalid");
      }
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      //gets all project managers and team leaders
      await get(child(ref(database), "employees"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              if (snapshot.val()[id].isProjectManager) {
                this.projectManagers.push({
                  id: id,
                  name: snapshot.val()[id].name,
                  job: snapshot.val()[id].job,
                  isProjectManager: snapshot.val()[id].isProjectManager,
                  isTeamLeader: snapshot.val()[id].isTeamLeader,
                });
              }

              if (snapshot.val()[id].isTeamLeader) {
                this.teamLeaders.push({
                  id: id,
                  name: snapshot.val()[id].name,
                  job: snapshot.val()[id].job,
                  isProjectManager: snapshot.val()[id].isProjectManager,
                  isTeamLeader: snapshot.val()[id].isTeamLeader,
                });
              }
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
      this.isLoading = false;
    },

    openModal() {
      let validation = true;

      if (this.projectManagerId === "empty") {
        validation = false;
        $("#projectManager").addClass("is-invalid");
      }

      if (this.teamLeaderId === "empty") {
        validation = false;
        $("#teamLeader").addClass("is-invalid");
      }

      if (validation) {
        this.$emit(
          "existing-team",
          this.teamName,
          this.projectManager,
          this.teamLeader,
          this.projectMembers,
          this.teamId
        );
      } else {
        this.$emit("validation-modal");
      }
    },

    selectSupervisor(supervisor) {
      get(child(ref(database), "teams/" + this.teamId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const baseTeam = snapshot.val().members;

            /**
             * project manager
             */
            if (supervisor === "projectManager") {
              const projectManagerId = this.projectManagerId;

              if (projectManagerId !== "empty") {
                const projectManager = this.projectManagers.find(
                  (pm) => pm.id === projectManagerId
                );
                this.projectManager = projectManager;

                if (projectManagerId !== "empty") {
                  this.projectMembers.forEach(
                    (m) => (m.isSelectedAsProjectManager = false)
                  );

                  if (
                    this.projectMembers.find((m) => m.id === projectManagerId)
                  ) {
                    this.projectMembers.find(
                      (m) => m.id === projectManagerId
                    ).isSelectedAsProjectManager = true;
                  } else {
                    projectManager.isSelectedAsProjectManager = true;
                    this.projectMembers.push(projectManager);
                  }

                  this.projectMembers.forEach((m) => {
                    if (!baseTeam.find((x) => x.id === m.id)) {
                      if (
                        (m.isSelectedAsProjectManager === false ||
                          typeof m.isSelectedAsProjectManager ===
                            "undefined") &&
                        (m.isSelectedAsTeamLeader === false ||
                          typeof m.isSelectedAsTeamLeader === "undefined")
                      ) {
                        const index = this.projectMembers.findIndex(
                          (x) => x.id === m.id
                        );
                        this.projectMembers.splice(index, 1);
                      }
                    }
                  });
                }

                this.projectManager.isSelectedAsProjectManager = true;
              } else {
                this.projectMembers.forEach(
                  (m) => (m.isSelectedAsProjectManager = false)
                );

                this.projectMembers.forEach((m) => {
                  if (!baseTeam.find((x) => x.id === m.id)) {
                    if (
                      (m.isSelectedAsProjectManager === false ||
                        typeof m.isSelectedAsProjectManager === "undefined") &&
                      (m.isSelectedAsTeamLeader === false ||
                        typeof m.isSelectedAsTeamLeader === "undefined")
                    ) {
                      const index = this.projectMembers.findIndex(
                        (x) => x.id === m.id
                      );
                      this.projectMembers.splice(index, 1);
                    }
                  }
                });
              }
            }

            /**
             * team leader
             */
            if (supervisor === "teamLeader") {
              const teamLeaderId = this.teamLeaderId;

              if (teamLeaderId !== "empty") {
                const teamLeader = this.teamLeaders.find(
                  (tl) => tl.id === teamLeaderId
                );
                this.teamLeader = teamLeader;

                if (teamLeaderId !== "empty") {
                  this.projectMembers.forEach(
                    (m) => (m.isSelectedAsTeamLeader = false)
                  );

                  if (this.projectMembers.find((m) => m.id === teamLeaderId)) {
                    this.projectMembers.find(
                      (m) => m.id === teamLeaderId
                    ).isSelectedAsTeamLeader = true;
                  } else {
                    teamLeader.isSelectedAsTeamLeader = true;
                    this.projectMembers.push(teamLeader);
                  }

                  this.projectMembers.forEach((m) => {
                    if (!baseTeam.find((x) => x.id === m.id)) {
                      if (
                        (m.isSelectedAsProjectManager === false ||
                          typeof m.isSelectedAsProjectManager ===
                            "undefined") &&
                        (m.isSelectedAsTeamLeader === false ||
                          typeof m.isSelectedAsTeamLeader === "undefined")
                      ) {
                        const index = this.projectMembers.findIndex(
                          (x) => x.id === m.id
                        );
                        this.projectMembers.splice(index, 1);
                      }
                    }
                  });
                }
                this.teamLeader.isSelectedAsTeamLeader = true;
              } else {
                this.projectMembers.forEach(
                  (m) => (m.isSelectedAsTeamLeader = false)
                );
                this.projectMembers.forEach((m) => {
                  if (!baseTeam.find((x) => x.id === m.id)) {
                    if (
                      (m.isSelectedAsProjectManager === false ||
                        typeof m.isSelectedAsProjectManager === "undefined") &&
                      (m.isSelectedAsTeamLeader === false ||
                        typeof m.isSelectedAsTeamLeader === "undefined")
                    ) {
                      const index = this.projectMembers.findIndex(
                        (x) => x.id === m.id
                      );
                      this.projectMembers.splice(index, 1);
                    }
                  }
                });
              }
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },
};
</script>
