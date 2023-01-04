<template>
  <section>
    <div class="col-xl-6 px-0">
      <div class="form-group">
        <label>Project name</label>
        <input v-model="name" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Start date</label>
        <input v-model="startDate" type="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>End date</label>
        <input v-model="endDate" type="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>Choose project manager</label>
        <select
          v-model="projectManagerId"
          @change="selectSupervisor('projectManager')"
          class="form-control"
        >
          <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">
            {{ pm.name }} - {{ pm.job }}
          </option>
        </select>
      </div>
      <div class="form-group">
        <label>Choose team leader</label>
        <select
          v-model="teamLeaderId"
          @change="selectSupervisor('teamLeader')"
          class="form-control"
        >
          <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">
            {{ tl.name }} - {{ tl.job }}
          </option>
        </select>
      </div>
    </div>

    <CreateTeam
      @update-team="updateTeam"
      :employees="employees"
      :projectManagerId="projectManagerId"
      :teamLeaderId="teamLeaderId"
      :teamMembers="teamMembers"
      :teamName="teamName"
    />

    <button @click="openModal" class="btn btn-warning my-4">
      Edit project
    </button>
  </section>

  <teleport to="body">
    <base-modal id="editProjectModal">
      <template #header>Edit project</template>
      <template #body>
        <div class="row">
          <div class="col">
            <div class="font-weight-bold">Project name</div>
            <span>{{ name }}</span>
          </div>
        </div>
        <div class="row my-3">
          <div class="col-4">
            <div class="font-weight-bold">Project manager</div>
            <span>{{ projectManagerName }}</span>
          </div>
          <div class="col-4">
            <div class="font-weight-bold">Project manager</div>
            <span>{{ teamLeaderName }}</span>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-4">
            <div class="font-weight-bold">Start date</div>
            <span>{{ startDate }}</span>
          </div>
          <div class="col-4">
            <div class="font-weight-bold">End date</div>
            <span>{{ endDate }}</span>
          </div>
        </div>
        <div class="row">
          <table class="table table-striped mx-2">
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
                  <svg
                    v-if="member.isSelectedAsProjectManager"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-dash"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"
                    />
                  </svg>
                </td>
                <td class="text-center">
                  <svg
                    v-if="member.isSelectedAsTeamLeader"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-check"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-dash"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"
                    />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-center">
          <div>Are you sure you want to edit this project?</div>
          <div>
            <button @click="editProject" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeEditProjectModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationModal">
      <template #header>Server response</template>
      <template #body>You must enter any change in the project!</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeValidationModal" class="btn btn-primary">
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal">
      <template #header>Server response</template>
      <template #body>You have just edited the team successfully!</template>
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
import { getDatabase, ref, update, get, child } from "firebase/database";

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

import CreateTeam from "./configure-project/CreateTeam.vue";

export default {
  components: {
    CreateTeam,
  },

  emits: ["change-key"],

  props: ["selectedProjectId"],

  data() {
    return {
      componentName: "EditProject",
      selectedProject: null,
      name: "",
      startDate: "",
      endDate: "",
      projectManagerId: "empty",
      teamLeaderId: "empty",
      projectManager: null,
      projectManagers: [],
      teamLeaders: [],
      teamLeader: null,
      projectTeamName: "",
      teamMembers: [],
      validation: false,
      projectTeamLeader: "",
      teamName: "",
      project: null,
      employees: [],
    };
  },

  computed: {
    projectManagerName() {
      if (this.projectManager !== null) {
        return this.projectManager.name;
      }
    },

    teamLeaderName() {
      if (this.teamLeader !== null) {
        return this.teamLeader.name;
      }
    },
  },

  mounted() {
    get(child(ref(database), "employees"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (const id in snapshot.val()) {
            this.employees.push({
              id: id,
              name: snapshot.val()[id].name,
              job: snapshot.val()[id].job,
              isProjectManager: snapshot.val()[id].isProjectManager,
              isTeamLeader: snapshot.val()[id].isTeamLeader,
              isTeamMember: snapshot.val()[id].isTeamMember,
            });

            if (snapshot.val()[id].isProjectManager) {
              this.projectManagers.push({
                id: id,
                name: snapshot.val()[id].name,
                job: snapshot.val()[id].job,
                isProjectManager: snapshot.val()[id].isProjectManager,
                isTeamLeader: snapshot.val()[id].isTeamLeader,
                isTeamMember: snapshot.val()[id].isTeamMember,
              });
            }

            if (snapshot.val()[id].isTeamLeader) {
              this.teamLeaders.push({
                id: id,
                name: snapshot.val()[id].name,
                job: snapshot.val()[id].job,
                isProjectManager: snapshot.val()[id].isProjectManager,
                isTeamLeader: snapshot.val()[id].isTeamLeader,
                isTeamMember: snapshot.val()[id].isTeamMember,
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

    get(child(ref(database), "projects/" + this.selectedProjectId))
      .then((snapshot) => {
        if (snapshot.exists()) {
          this.selectedProject = {
            name: snapshot.val().name,
            startDate: snapshot.val().startDate,
            endDate: snapshot.val().endDate,
            projectManager: snapshot.val().projectManager,
            teamLeader: snapshot.val().teamLeader,
            team: snapshot.val().team,
            isProjectVisible: snapshot.val().isProjectVisible,
          };

          this.name = snapshot.val().name;
          this.startDate = snapshot.val().startDate;
          this.endDate = snapshot.val().endDate;
          this.projectManager = snapshot.val().projectManager;
          this.projectManagerId = snapshot.val().projectManager.id;
          this.teamLeader = snapshot.val().teamLeader;
          this.teamLeaderId = snapshot.val().teamLeader.id;
          this.teamMembers = snapshot.val().team.members;
          this.teamName = snapshot.val().team.name;
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },

  methods: {
    updateTeam(members) {
      this.teamMembers = members;
    },

    selectSupervisor(supervisor) {
      get(child(ref(database), "projects/" + this.selectedProjectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            /**
             * project manager
             */
            if (supervisor === "projectManager") {
              const projectManagerId = this.projectManagerId;
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
            }

            /**
             * team leader
             */
            if (supervisor === "teamLeader") {
              const teamLeaderId = this.teamLeaderId;
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
              }
              this.selectedTeamLeader.isSelectedAsTeamLeader = true;
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
      let validation = false;

      if (this.selectedProject.name !== this.name) {
        validation = true;
      }

      if (this.selectedProject.startDate !== this.startDate) {
        validation = true;
      }

      if (this.selectedProject.endDate !== this.endDate) {
        validation = true;
      }

      if (this.selectedProject.projectManager.id !== this.projectManagerId) {
        validation = true;
      }

      const baseProjectMembers = this.selectedProject.team.members;
      baseProjectMembers.sort(function (x, y) {
        x.name === y.name ? 0 : x.name > y.name ? 1 : -1;
      });

      this.teamMembers.sort(function (x, y) {
        x.name === y.name ? 0 : x.name > y.name ? 1 : -1;
      });

      if (
        JSON.stringify(baseProjectMembers) !== JSON.stringify(this.teamMembers)
      ) {
        validation = true;
      }

      if (validation) {
        this.validation = true;
        $("#editProjectModal").modal("show");
      } else {
        this.validation = false;
        $("#validationModal").modal("show");
      }
    },

    closeEditProjectModal() {
      $("#editProjectModal").modal("hide");
    },

    closeValidationModal() {
      $("#validationModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    editProject() {
      update(ref(database, "projects/" + this.selectedProjectId), {
        name: this.name,
        startDate: this.startDate,
        endDate: this.endDate,
        projectManager: this.projectManager,
        teamLeader: this.teamLeader,
        team: {
          name: this.teamName,
          members: this.teamMembers,
        },
      }).catch((error) => {
        console.error(error);
      });

      $("#editProjectModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
