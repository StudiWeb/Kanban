<template>
  <section class="row flex-column mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Add project</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-if="isLoading === false">
      <div class="col-xl-6 px-0">
        <div class="form-group">
          <label>Project name</label>
          <input
            v-model="projectName"
            ref="projectName"
            type="text"
            class="form-control"
            id="projectName"
          />
          <div class="invalid-feedback">
            This project name is already in use. Please type different project
            name.
          </div>
        </div>
        <div class="form-group">
          <label>Start date</label>
          <input
            v-model="startDate"
            :max="endDate"
            type="date"
            class="form-control"
            id="startDate"
          />
        </div>
        <div class="form-group">
          <label>End date</label>
          <input
            v-model="endDate"
            :min="startDate"
            type="date"
            class="form-control"
            id="endDate"
          />
        </div>

        <div class="form-group">
          <label>My team</label>
          <select v-model="myTeam" class="form-control">
            <option value="empty">none</option>
            <option value="teamList">I choose a team from a team list</option>
            <option value="newTeam">I want to create a new team</option>
          </select>
        </div>
      </div>

      <!-- choose an existing team -->
      <div v-if="myTeam === 'teamList'" class="col-xl-6 px-0">
        <div class="form-group">
          <label>Select team</label>
          <select v-model="selectedTeamId" class="form-control" id="team">
            <option value="empty"></option>
            <option v-for="t in teams" :key="t.id" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Project manager</label>
          <select
            v-model="selectedProjectManagerId"
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
            v-model="selectedTeamLeaderId"
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

        <div class="card col-xl-12 px-0" v-if="selectedTeamId !== 'empty'">
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
                <tr v-for="member in teamMembers" :key="member.id">
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

            <button
              @click="openModal"
              class="btn btn-success mr-4 align-self-end"
            >
              Add project
            </button>
          </div>
        </div>
      </div>
      <!-- create a new team -->
      <div v-if="myTeam === 'newTeam'">
        <div class="col-xl-6 px-0">
          <div class="form-group">
            <label>Project manager</label>
            <select
              v-model="selectedProjectManagerId"
              @change="selectProjectManager"
              ref="projectManagerSelect"
              class="form-control"
              id="projectManager"
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
              v-model="selectedTeamLeaderId"
              @change="selectTeamLeader"
              id="teamLeader"
              ref="teamLeaderSelect"
              class="form-control"
            >
              <option value="empty">none</option>
              <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">
                {{ tl.name }}
              </option>
            </select>
          </div>
        </div>

        <CreateTeam
          @set-teamName="setTeamName"
          :employees="employees"
          :teamMembers="teamMembers"
        />
        <button @click="openModal" class="btn btn-success my-4 align-self-end">
          Add project
        </button>
      </div>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="addProjectModal">
      <template #header>Create project</template>
      <template #body>
        <p>
          <span class="font-weight-bold">Project name: </span>{{ projectName }}
        </p>
        <div class="row">
          <div class="col-6">
            <div class="font-weight-bold">Start date</div>
            <div>{{ startDate }}</div>
          </div>
          <div>
            <div class="font-weight-bold">End date</div>
            <div>{{ endDate }}</div>
          </div>
        </div>
        <div class="row my-2">
          <div class="col-6">
            <div class="font-weight-bold">Project manager</div>
            <div>{{ projectManagerName }}</div>
          </div>
          <div>
            <div class="font-weight-bold">Team leader</div>
            <div>{{ teamLeaderName }}</div>
          </div>
        </div>
        <p><span class="font-weight-bold">Team members</span></p>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Job position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in teamMembers" :key="member.id">
              <td>
                {{ member.name }}
                <span class="font-weight-bold">
                  {{
                    member.isSelectedAsProjectManager &&
                    member.isSelectedAsTeamLeader
                      ? "(PM) (TL)"
                      : member.isSelectedAsProjectManager
                      ? "(PM)"
                      : member.isSelectedAsTeamLeader
                      ? "(TL)"
                      : ""
                  }}
                </span>
              </td>
              <td>{{ member.job }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-baseline">
          Are you sure do you want to create this project?
          <div>
            <button @click="createProject" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeAddProjectModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationAddProjectModal">
      <template #header>Create project</template>
      <template #body>Please fiil the form.</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button
            @click="closeValidationAddProjectModal"
            class="btn btn-primary"
          >
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="responseServerModal">
      <template #header>Server response</template>
      <template #body>You have just created a new project!</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeResponseServerModal" class="btn btn-primary">
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, get, child, push, ref } from "firebase/database";

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

import CreateTeam from "./project-config/add-project/CreateTeam.vue";

export default {
  emits: ["change-key"],

  components: { CreateTeam },

  data() {
    return {
      projectName: "",
      startDate: "",
      endDate: "",
      selectedTeamId: "empty",
      selectedTeam: null,
      selectedProjectManagerId: "empty",
      selectedProjectManager: null,
      selectedTeamLeaderId: "empty",
      selectedTeamLeader: null,
      teamName: "",
      teamMembers: [],
      myTeam: "empty",
      employees: [],
      teams: [],
      projects: [],
      isLoading: false,
    };
  },

  computed: {
    projectNames() {
      let names = [];
      this.projects.forEach((p) => {
        names.push(p.name);
      });
      return names;
    },

    projectManagers() {
      let projectManagers = [];
      this.employees.forEach((e) => {
        if (e.isProjectManager) {
          projectManagers.push(e);
        }
      });
      return projectManagers;
    },

    teamLeaders() {
      let teamLeaders = [];
      this.employees.forEach((e) => {
        if (e.isTeamLeader) {
          teamLeaders.push(e);
        }
      });
      return teamLeaders;
    },

    projectManagerName() {
      if (this.selectedProjectManager) {
        return this.selectedProjectManager.name;
      }
    },

    teamLeaderName() {
      if (this.selectedTeamLeader) {
        return this.selectedTeamLeader.name;
      }
    },
  },

  watch: {
    projectName(name) {
      if (name !== "") {
        if (this.projectNames.find((n) => n === name)) {
          $("#projectName").removeClass("is-valid");
          $("#projectName").addClass("is-invalid");
        } else {
          $("#projectName").removeClass("is-invalid");
          $("#projectName").addClass("is-valid");
        }
      } else {
        $("#projectName").removeClass("is-valid");
      }
    },

    selectedTeamId(teamId) {
      if (teamId !== "empty") {
        //gets selected team
        get(child(ref(database), "teams/" + teamId))
          .then((snapshot) => {
            if (snapshot.exists()) {
              this.teamName = snapshot.val().name;
              this.teamMembers = snapshot.val().members;
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
        this.selectedProjectManagerId = "empty";
        this.selectedTeamLeaderId = "empty";
        this.teamMembers = [];
        this.$refs.projectManagerSelect.disabled = true;
        this.$refs.teamLeaderSelect.disabled = true;
        $("#team").removeClass("is-valid");
      }
    },

    startDate(value) {
      if (value !== "") {
        $("#startDate").removeClass("is-invalid");
        $("#startDate").addClass("is-valid");
      } else {
        $("#startDate").removeClass("is-valid");
      }
    },

    endDate(value) {
      if (value !== "") {
        $("#endDate").removeClass("is-invalid");
        $("#endDate").addClass("is-valid");
      } else {
        $("#endDate").removeClass("is-valid");
      }
    },

    myTeam(value) {
      if (value !== "teamList") {
        if (this.$refs.projectManagerSelect && this.$refs.teamLeaderSelect) {
          this.$refs.projectManagerSelect.disabled = true;
          this.$refs.teamLeaderSelect.disabled = true;
        }
      }

      if (value !== "newTeam") {
        if (this.$refs.teamNameInput) {
          this.$refs.projectManagerSelect.disabled = true;
        }
      }

      this.selectedProjectManagerId = "empty";
      this.selectedTeamLeaderId = "empty";
      this.teamMembers = [];
    },

    selectedProjectManagerId(id) {
      if (id !== "empty") {
        $("#projectManager").removeClass("is-invalid");
        $("#projectManager").addClass("is-valid");
      } else {
        $("#projectManager").addClass("is-valid");
      }
    },

    selectedTeamLeaderId(id) {
      if (id !== "empty") {
        $("#teamLeader").removeClass("is-invalid");
        $("#teamLeader").addClass("is-valid");
      } else {
        $("#teamLeader").addClass("is-valid");
      }
    },
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

    setTeamName(name) {
      this.teamName = name;
    },

    selectProjectManager() {
      const projectManagerId = this.selectedProjectManagerId;

      if (projectManagerId !== "empty") {
        const projectManager = this.projectManagers.find(
          (pm) => pm.id === projectManagerId
        );
        this.selectedProjectManager = projectManager;

        if (projectManagerId !== "empty") {
          this.teamMembers.forEach(
            (m) => (m.isSelectedAsProjectManager = false)
          );

          if (this.teamMembers.find((m) => m.id === projectManagerId)) {
            this.teamMembers.find(
              (m) => m.id === projectManagerId
            ).isSelectedAsProjectManager = true;
          } else {
            projectManager.isSelectedAsProjectManager = true;
            this.teamMembers.push(projectManager);
          }
        }

        this.selectedProjectManager.isSelectedAsProjectManager = true;
        this.teamMembers.forEach((t) => {
          while (this.employees.find((e) => e.id === t.id)) {
            const index = this.employees.findIndex((e) => e.id === t.id);
            this.employees.splice(index, 1);
          }
        });
      } else {
        this.teamMembers.forEach((m) => (m.isSelectedAsProjectManager = false));
      }
    },

    selectTeamLeader() {
      const teamLeaderId = this.selectedTeamLeaderId;

      if (teamLeaderId !== "empty") {
        const teamLeader = this.teamLeaders.find(
          (tl) => tl.id === teamLeaderId
        );
        this.selectedTeamLeader = teamLeader;

        if (teamLeaderId !== "empty") {
          this.teamMembers.forEach((m) => (m.isSelectedAsTeamLeader = false));

          if (this.teamMembers.find((m) => m.id === teamLeaderId)) {
            this.teamMembers.find(
              (m) => m.id === teamLeaderId
            ).isSelectedAsTeamLeader = true;
          } else {
            teamLeader.isSelectedAsTeamLeader = true;
            this.teamMembers.push(teamLeader);
          }
        }
        this.selectedTeamLeader.isSelectedAsTeamLeader = true;
        this.teamMembers.forEach((t) => {
          while (this.employees.find((e) => e.id === t.id)) {
            const index = this.employees.findIndex((e) => e.id === t.id);
            this.employees.splice(index, 1);
          }
        });
      } else {
        this.teamMembers.forEach((m) => (m.isSelectedAsTeamLeader = false));
      }
    },

    selectSupervisor(supervisor) {
      get(child(ref(database), "teams/" + this.selectedTeamId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const baseTeam = snapshot.val().members;

            /**
             * project manager
             */
            if (supervisor === "projectManager") {
              const projectManagerId = this.selectedProjectManagerId;

              if (projectManagerId !== "empty") {
                const projectManager = this.projectManagers.find(
                  (pm) => pm.id === projectManagerId
                );
                this.selectedProjectManager = projectManager;

                if (projectManagerId !== "empty") {
                  this.teamMembers.forEach(
                    (m) => (m.isSelectedAsProjectManager = false)
                  );

                  if (this.teamMembers.find((m) => m.id === projectManagerId)) {
                    this.teamMembers.find(
                      (m) => m.id === projectManagerId
                    ).isSelectedAsProjectManager = true;
                  } else {
                    projectManager.isSelectedAsProjectManager = true;
                    this.teamMembers.push(projectManager);
                  }

                  this.teamMembers.forEach((m) => {
                    if (!baseTeam.find((x) => x.id === m.id)) {
                      if (
                        (m.isSelectedAsProjectManager === false ||
                          typeof m.isSelectedAsProjectManager ===
                            "undefined") &&
                        (m.isSelectedAsTeamLeader === false ||
                          typeof m.isSelectedAsTeamLeader === "undefined")
                      ) {
                        const index = this.teamMembers.findIndex(
                          (x) => x.id === m.id
                        );
                        this.teamMembers.splice(index, 1);
                      }
                    }
                  });
                }

                this.selectedProjectManager.isSelectedAsProjectManager = true;
              } else {
                this.teamMembers.forEach(
                  (m) => (m.isSelectedAsProjectManager = false)
                );

                this.teamMembers.forEach((m) => {
                  if (!baseTeam.find((x) => x.id === m.id)) {
                    if (
                      (m.isSelectedAsProjectManager === false ||
                        typeof m.isSelectedAsProjectManager === "undefined") &&
                      (m.isSelectedAsTeamLeader === false ||
                        typeof m.isSelectedAsTeamLeader === "undefined")
                    ) {
                      const index = this.teamMembers.findIndex(
                        (x) => x.id === m.id
                      );
                      this.teamMembers.splice(index, 1);
                    }
                  }
                });
              }
            }

            /**
             * team leader
             */
            if (supervisor === "teamLeader") {
              const teamLeaderId = this.selectedTeamLeaderId;

              if (teamLeaderId !== "empty") {
                const teamLeader = this.teamLeaders.find(
                  (tl) => tl.id === teamLeaderId
                );
                this.selectedTeamLeader = teamLeader;

                if (teamLeaderId !== "empty") {
                  this.teamMembers.forEach(
                    (m) => (m.isSelectedAsTeamLeader = false)
                  );

                  if (this.teamMembers.find((m) => m.id === teamLeaderId)) {
                    this.teamMembers.find(
                      (m) => m.id === teamLeaderId
                    ).isSelectedAsTeamLeader = true;
                  } else {
                    teamLeader.isSelectedAsTeamLeader = true;
                    this.teamMembers.push(teamLeader);
                  }

                  this.teamMembers.forEach((m) => {
                    if (!baseTeam.find((x) => x.id === m.id)) {
                      if (
                        (m.isSelectedAsProjectManager === false ||
                          typeof m.isSelectedAsProjectManager ===
                            "undefined") &&
                        (m.isSelectedAsTeamLeader === false ||
                          typeof m.isSelectedAsTeamLeader === "undefined")
                      ) {
                        const index = this.teamMembers.findIndex(
                          (x) => x.id === m.id
                        );
                        this.teamMembers.splice(index, 1);
                      }
                    }
                  });
                }
                this.selectedTeamLeader.isSelectedAsTeamLeader = true;
              } else {
                this.teamMembers.forEach(
                  (m) => (m.isSelectedAsTeamLeader = false)
                );
                this.teamMembers.forEach((m) => {
                  if (!baseTeam.find((x) => x.id === m.id)) {
                    if (
                      (m.isSelectedAsProjectManager === false ||
                        typeof m.isSelectedAsProjectManager === "undefined") &&
                      (m.isSelectedAsTeamLeader === false ||
                        typeof m.isSelectedAsTeamLeader === "undefined")
                    ) {
                      const index = this.teamMembers.findIndex(
                        (x) => x.id === m.id
                      );
                      this.teamMembers.splice(index, 1);
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

    openModal() {
      let validation = true;

      if (this.projectName !== "") {
        if (this.projectNames.find((n) => n === this.projectName)) {
          validation = false;
          $("#projectName").addClass("is-invalid");
        }
      } else {
        validation = false;
        $("#projectName").addClass("is-invalid");
      }

      if (this.startDate === "") {
        validation = false;
        $("#startDate").addClass("is-invalid");
      }

      if (this.endDate === "") {
        validation = false;
        $("#endDate").addClass("is-invalid");
      }

      if (this.selectedProjectManagerId === "empty") {
        validation = false;
        $("#projectManager").addClass("is-invalid");
      }

      if (this.selectedTeamLeaderId === "empty") {
        validation = false;
        $("#teamLeader").addClass("is-invalid");
      }

      if (validation) {
        $("#addProjectModal").modal("show");
      } else {
        $("#validationAddProjectModal").modal("show");
      }
    },

    closeResponseServerModal() {
      $("#responseServerModal").modal("hide");
      this.$emit("change-key");
      this.$parent.$parent.$parent.$emit("change-key");
    },

    closeAddProjectModal() {
      $("#addProjectModal").modal("hide");
    },

    closeValidationAddProjectModal() {
      $("#validationAddProjectModal").modal("hide");
    },

    createProject() {
      //removes isSelectedAsProjectManager and isSelectedAsTeamLeader properties
      delete this.selectedProjectManager.isSelectedAsProjectManager;
      delete this.selectedTeamLeader.isSelectedAsTeamLeader;

      //ads a new created team to teams
      if (this.myTeam === "newTeam") {
        push(ref(database, "teams/"), {
          name: this.teamName.trim(),
          members: this.teamMembers,
        })
          .then(() => {
            // Data saved successfully!
          })
          .catch((error) => {
            // The write failed...
            console.log(error);
          });
      }

      //prepeares a team to add to a project
      this.selectedTeam = {
        name: this.teamName,
        members: this.teamMembers,
      };

      push(ref(database, "projects/"), {
        name: this.projectName.trim(),
        team: this.selectedTeam,
        startDate: this.startDate.trim(),
        endDate: this.endDate.trim(),
        projectManager: this.selectedProjectManager,
        teamLeader: this.selectedTeamLeader,
        isVisible: true,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });

      $("#addProjectModal").modal("hide");
      $("#responseServerModal").modal("show");
    },
  },
};
</script>
