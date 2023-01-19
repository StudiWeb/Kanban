<template>
  <div v-if="isLoading" class="col-xl-6 px-0">
    <div class="d-flex align-items-center">
      <div class="spinner-border text-primary" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>

  <div v-if="!isLoading">
    <div class="col-xl-6 px-0">
      <div class="form-group">
        <label>Project manager</label>
        <select
          v-model="projectManagerId"
          @change="selectProjectManager"
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
          v-model="teamLeaderId"
          @change="selectTeamLeader"
          id="teamLeader"
          class="form-control"
        >
          <option value="empty">none</option>
          <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">
            {{ tl.name }}
          </option>
        </select>
      </div>
      <div class="px-0 form-group">
        <label>Team name</label>
        <input
          v-model="teamName"
          id="teamName"
          class="form-control"
          type="text"
        />
        <div v-if="teamNameExists" class="invalid-feedback">
          There is already a team wtih this name. Please type different team
          name.
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column flex-lg-row align-items-md-start mt-4"
      style="position: relative"
    >
      <!-- employees to choose -->
      <the-employees title="Employees">
        <template #search>
          <div class="form-group">
            <input
              v-model="search"
              type="search"
              class="form-control"
              placeholder="search by name or job"
            />
          </div>
        </template>
        <template #default>
          <team-member
            v-for="e in employees"
            @click="selectEmployee(e.id)"
            :id="e.id"
            :name="e.name"
            :job="e.job"
            :class="{ selectedToMove: e.isSelected }"
          >
          </team-member>
        </template>
      </the-employees>

      <!-- move buttons -->
      <div class="d-flex flex-column align-self-center align-items-center m-3">
        <button
          @click="moveEmployeeToTeam"
          id="moveToTeam"
          ref="moveEmployeeToTeamButton"
          type="button"
          class="btn btn-success my-2"
          disabled
        >
          <i class="bi bi-arrow-right" style="font-size: 16px"></i>
        </button>
        <button
          @click="moveTeamMemberToEmployees"
          id="moveToEmployees"
          ref="moveTeamMemberToEmployeesButton"
          type="button"
          class="btn btn-danger my-2"
          disabled
        >
          <i class="bi bi-arrow-left" style="font-size: 16px"></i>
        </button>
      </div>

      <!-- team members -->
      <div style="position: relative">
        <div
          class="toast bg-warning hide"
          id="toast"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          data-delay="2000"
          style="
            position: absolute;
            z-index: 9999;
            top: 50%;
            left: 50%;
            -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            width: 400px;
          "
        >
          <div class="toast-header">
            <strong class="mr-auto">Information</strong>
          </div>
          <div class="toast-body">{{ toastMessage }}</div>
        </div>
        <the-employees :title="teamName">
          <template #default>
            <team-member
              v-for="m in teamMembers"
              @click="selectTeamMember(m.id)"
              :key="m.id"
              :id="m.id"
              :name="m.name"
              :job="m.job"
              :class="{ selectedToDelete: m.isSelected }"
            >
            </team-member>
          </template>
        </the-employees>
      </div>
    </div>
    <button @click="openModal" class="btn btn-success my-4 align-self-end">
      Add project
    </button>
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

import TheEmployees from "../../../view-components/team/TheEmployees.vue";
import TeamMember from "../../../view-components/team/TeamMember.vue";

export default {
  components: {
    TheEmployees,
    TeamMember,
  },

  emits: ["open-modal", "validation-modal", "reload-employees"],

  data() {
    return {
      teamName: "",
      employee: null,
      teamMember: null,
      projectManager: null,
      teamLeader: null,
      projectManagerId: "empty",
      teamLeaderId: "empty",
      teamMembers: [],
      moveEmployeeToTeamButton: null,
      moveTeamMemberToEmployeesButton: null,
      search: "",
      teamNameExists: false,
      toastMessage: "",
      employees: [],
      projectManagers: [],
      teamLeaders: [],
      teamNames: [],
      isLoading: false,
    };
  },

  watch: {
    teamName(name) {
      if (name === "") {
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
      } else if (this.teamNames.find((n) => n === name)) {
        this.teamNameExists = true;
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
      } else {
        this.teamNameExists = false;
        $("#teamName").removeClass("is-invalid");
        $("#teamName").addClass("is-valid");
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

    search(phrase) {
      get(child(ref(database), "employees"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.employees = [];
            for (const id in snapshot.val()) {
              this.employees.push({
                id: id,
                name: snapshot.val()[id].name,
                job: snapshot.val()[id].job,
                isProjectManager: snapshot.val()[id].isProjectManager,
                isTeamLeader: snapshot.val()[id].isTeamLeader,
              });
            }

            if (phrase !== undefined) {
              this.employees = this.employees.filter(
                (m) =>
                  m.name.toLowerCase().includes(phrase.toLowerCase()) ||
                  m.job.toLowerCase().includes(phrase.toLowerCase())
              );
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

      await //gets all team names
      get(child(ref(database), "teams"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.teamNames.push(snapshot.val()[id].name);
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
        $("#projectManager").removeClass("is-valid");
        $("#projectManager").addClass("is-invalid");
        validation = false;
      } else {
        $("#projectManager").removeClass("is-invalid");
        $("#projectManager").addClass("is-valid");
      }

      if (this.teamLeaderId === "empty") {
        $("#teamLeader").removeClass("is-valid");
        $("#teamLeader").addClass("is-invalid");
        validation = false;
      } else {
        $("#teamLeader").removeClass("is-invalid");
        $("#teamLeader").addClass("is-valid");
      }

      if (this.teamName === "") {
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
        validation = false;
      } else if (this.teamNames.find((n) => n === this.teamName)) {
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
      } else {
        $("#teamName").removeClass("is-invalid");
        $("#teamName").addClass("is-valid");
      }

      if (validation) {
        const projectManager = this.projectManagers.find(
          (pm) => pm.id === this.projectManagerId
        );

        const teamLeader = this.teamLeaders.find(
          (tl) => tl.id === this.teamLeaderId
        );

        this.$emit(
          "open-modal",
          this.teamName,
          this.teamNames,
          projectManager,
          teamLeader,
          this.teamMembers
        );
      } else {
        this.$emit("validation-modal");
      }
    },

    selectEmployee(id) {
      const employee = this.employees.find((e) => e.isSelected === true);

      this.employees.forEach((e) => {
        if (e.isSelected === true) {
          e.isSelected = false;
        }
      });

      this.$refs.moveEmployeeToTeamButton.disabled = false;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      //removes selected class from previous choosen employee
      while (this.teamMembers.find((m) => m.isSelected === true)) {
        const index = this.teamMembers.findIndex((m) => m.isSelected === true);
        this.teamMembers[index].isSelected = false;
      }

      this.employee = this.employees.find((e) => e.id === id);
      this.employee.isSelected = true;

      //toggles selected employee class
      if (employee) {
        if (this.employee !== null && this.employee.id === employee.id) {
          this.employee.isSelected = !this.employee.isSelected;
          this.$refs.moveEmployeeToTeamButton.disabled = true;
        }
      }
    },

    selectTeamMember(id) {
      const selectedTeamMember = this.teamMembers.find(
        (m) => m.isSelected === true
      );

      this.teamMembers.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      const teamMember = this.teamMembers.find((m) => m.id === id);

      if (
        teamMember.isSelectedAsProjectManager === true &&
        teamMember.isSelectedAsTeamLeader === true
      ) {
        this.toastMessage =
          "This employee is choosen as a project manager and team leader. You cannot remove him from a team.";
        $("#toast").toast("show");
      } else if (teamMember.isSelectedAsProjectManager === true) {
        this.toastMessage =
          "This employee is choosen as a project manager. You cannot remove him from a team.";
        $("#toast").toast("show");
      } else if (teamMember.isSelectedAsTeamLeader === true) {
        this.toastMessage =
          "This employee is choosen as a team leader. You cannot remove him from a team.";
        $("#toast").toast("show");
      } else {
        this.$refs.moveEmployeeToTeamButton.disabled = true;
        this.$refs.moveTeamMemberToEmployeesButton.disabled = false;

        //removes selected class from previous choosen team member
        while (this.employees.find((m) => m.isSelected === true)) {
          const index = this.employees.findIndex((m) => m.isSelected === true);
          this.employees[index].isSelected = false;
        }

        //adds selected class to choosen team member
        this.teamMember = this.teamMembers.find((m) => m.id === id);
        this.teamMember.isSelected = true;

        //toggles selected employee class
        if (selectedTeamMember) {
          if (
            this.teamMember !== null &&
            this.teamMember.id === selectedTeamMember.id
          ) {
            this.teamMember.isSelected = !this.teamMember.isSelected;
            this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
          }
        }
      }
    },

    //moves employee to team
    moveEmployeeToTeam() {
      this.teamMembers.push(this.employee);
      const index = this.employees.findIndex((e) => e.id === this.employee.id);
      this.employees.splice(index, 1);
      this.employee = null;

      this.teamMembers.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.teamMembers.sort((a, b) => a.name.localeCompare(b.name));
    },

    //moves team member to employees
    moveTeamMemberToEmployees() {
      this.employees.push(this.teamMember);
      const index = this.teamMembers.findIndex(
        (e) => e.id === this.teamMember.id
      );
      this.teamMembers.splice(index, 1);
      this.teamMember = null;

      this.employees.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
      this.teamMembers.sort((a, b) => a.name.localeCompare(b.name));
    },

    selectProjectManager() {
      this.teamMembers.forEach((m) => {
        m.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      const projectManagerId = this.projectManagerId;

      if (projectManagerId !== "empty") {
        const projectManager = this.projectManagers.find(
          (pm) => pm.id === projectManagerId
        );
        this.projectManager = projectManager;

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

        this.projectManager.isSelectedAsProjectManager = true;
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
      this.teamMembers.forEach((m) => {
        m.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      const teamLeaderId = this.teamLeaderId;

      if (teamLeaderId !== "empty") {
        const teamLeader = this.teamLeaders.find(
          (tl) => tl.id === teamLeaderId
        );
        this.teamLeader = teamLeader;

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
        this.teamLeader.isSelectedAsTeamLeader = true;
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
  },
};
</script>
