<template>
  <div class="row">
    <div class="col-xl-6 pr-0">
      <slot name="header"></slot>
      <div class="px-0 form-group">
        <label>Team name</label>
        <input
          v-model="enteredTeamName"
          id="teamName"
          class="form-control"
          aria-describedby="invalidTeamName"
          ref="teamNameInput"
          type="text"
        />
        <small
          v-if="componentName === 'EditProject'"
          class="form-text text-muted"
          >If you want to change team name, please go to 'Manage team' and then
          'Edit team'.</small
        >
        <div
          v-if="teamNameExists"
          id="invalidTeamName"
          class="invalid-feedback"
        >
          There is already a team wtih this name. Please type different team
          name.
        </div>
      </div>
    </div>
  </div>

  <div class="row" style="position: relative">
    <div class="col-xl-6 pr-0">
      <div class="h5 my-4">Add employees to your team</div>
      <div
        class="d-flex flex-column flex-lg-row align-items-md-start"
        aria-live="polite"
        aria-atomic="true"
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
        <div
          class="d-flex flex-column align-self-center align-items-center m-3"
        >
          <button
            @click="moveEmployeeToTeam"
            id="moveToTeam"
            ref="moveEmployeeToTeamButton"
            type="button"
            class="btn btn-success my-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-right"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
              />
            </svg>
          </button>
          <button
            @click="moveTeamMemberToEmployees"
            id="moveToEmployees"
            ref="moveTeamMemberToEmployeesButton"
            type="button"
            class="btn btn-danger my-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-arrow-left"
              viewBox="0 4 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
              />
            </svg>
          </button>
        </div>

        <!-- team members -->
        <the-employees :title="teamName">
          <template #managers> </template>
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
        <teleport to="body">
          <div
            class="toast hide bg-warning"
            id="toast"
            data-delay="2000"
            style="
              position: absolute;
              top: 50%;
              left: 50%;
              margin-right: -50%;
              transform: translate(-50%, -50%);
            "
          >
            <div class="toast-header">
              <strong class="mr-auto">Information</strong>
            </div>
            <div class="toast-body">
              You cannot remove an employee from a team if he is selected as a
              project manager or a team leader.
            </div>
          </div>
        </teleport>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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

import TheEmployees from "./../../../view-components/team/TheEmployees.vue";
import TeamMember from "./../../../view-components/team/TeamMember.vue";

export default {
  components: {
    TheEmployees,
    TeamMember,
  },

  props: ["teamName", "employees", "teamMembers"],

  emits: ["update-team", "show-info"],

  data() {
    return {
      enteredTeamName: "",
      selectedTeamId: "empty",
      selectedTeam: null,
      teamNames: [],
      selectedEmployee: null,
      selectedTeamLeaderId: "empty",
      selectedTeamLeader: null,
      selectedTeamMember: null,
      teams: [],
      moveEmployeeToTeamButton: null,
      moveTeamMemberToEmployeesButton: null,
      teamNameExists: false,
      search: "",
      canShowToast: false,
    };
  },

  watch: {
    selectedTeamLeaderId(id) {
      if (id === "empty") {
        $("#teamLeader").removeClass("is-valid");
        $("#teamLeader").addClass("is-invalid");
      } else {
        $("#teamLeader").removeClass("is-invalid");
        $("#teamLeader").addClass("is-valid");
      }
    },

    search(phrase) {
      //gets employees
      fetch(
        "https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json"
      )
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
        })
        .then((data) => {
          this.employees = [];

          for (const id in data) {
            //gets employees
            this.employees.push({
              id: id,
              name: data[id].name,
              job: data[id].job,
              isProjectManager: data[id].isProjectManager,
              isTeamLeader: data[id].isTeamLeader,
              isSelected: false,
              isSelectedAsTeamLeader: false,
            });

            //sorts employees by name
            this.employees.sort(function (a, b) {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            });

            this.teamMembers.forEach((t) => {
              while (this.employees.find((e) => e.id === t.id)) {
                const index = this.employees.findIndex((e) => e.id === t.id);
                this.employees.splice(index, 1);
              }
            });

            this.employees = this.employees.filter(
              (m) =>
                m.name.toLowerCase().includes(phrase.toLowerCase()) ||
                m.job.toLowerCase().includes(phrase.toLowerCase())
            );

            if (this.selectedTeamLeader !== null) {
              this.employees.push(this.selectedTeamLeader);
              //sorts by team leader in employees
              this.employees.sort(function (x, y) {
                return x === y ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
              });
            }
          }
        });
    },
  },

  computed: {
    teamName() {
      this.enteredTeamName = this.teamName;
      return this.teamName;
    },

    teamLeaderName() {
      if (this.selectedTeamLeader) {
        return this.selectedTeamLeader.name;
      } else {
        return "none";
      }
    },

    projectManagerName() {
      if (this.projectManager) {
        return this.projectManager.name;
      } else {
        return "none";
      }
    },
  },

  mounted() {
    this.$refs.teamNameInput.disabled = true;
    this.$refs.moveEmployeeToTeamButton.disabled = true;
    this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
    $("#toast").toast("hide");
  },

  methods: {
    selectEmployee(id) {
      const employee = this.employees.find((e) => e.isSelected === true);

      this.employees.forEach((e) => {
        e.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = false;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      this.selectedEmployee = this.employees.find((m) => m.id === id);
      this.selectedEmployee.isSelected = true;

      if (employee) {
        if (this.selectedEmployee.id === employee.id) {
          this.selectedEmployee.isSelected = !this.selectedEmployee.isSelected;
          this.$refs.moveEmployeeToTeamButton.disabled = true;
        }
      }
    },

    selectTeamMember(id) {
      const employee = this.teamMembers.find((e) => e.isSelected === true);

      this.teamMembers.forEach((e) => {
        e.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = false;

      this.selectedTeamMember = this.teamMembers.find((m) => m.id === id);
      if (
        this.selectedTeamMember.isSelectedAsProjectManager === true ||
        this.selectedTeamMember.isSelectedAsTeamLeader === true
      ) {
        $("#toast").toast("show");
        this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
      } else {
        this.selectedTeamMember.isSelected = true;
      }

      if (employee) {
        if (this.selectedTeamMember.id === employee.id) {
          this.selectedTeamMember.isSelected =
            !this.selectedTeamMember.isSelected;
          this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
        }
      }
    },

    //moves employee to team
    moveEmployeeToTeam() {
      this.selectedEmployee.isTeamMember = true;
      this.teamMembers.push(this.selectedEmployee);
      const index = this.employees.findIndex(
        (e) => e.id === this.selectedEmployee.id
      );
      this.employees.splice(index, 1);
      this.selectedEmployee = null;

      this.teamMembers.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$emit("update-team", this.teamMembers);
    },

    //moves team member to employees
    moveTeamMemberToEmployees() {
      this.selectedTeamMember.isTeamMember = false;
      this.employees.push(this.selectedTeamMember);
      const index = this.teamMembers.findIndex(
        (e) => e.id === this.selectedTeamMember.id
      );
      this.teamMembers.splice(index, 1);
      this.selectedTeamMember = null;

      this.employees.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
      this.$emit("update-team", this.teamMembers);
    },
  },
};
</script>
