<template>
  <div class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Add team</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="!isLoading">
    <div class="row">
      <div class="col-xl-6">
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

    <div class="h5 my-4">Add employees to your team</div>
    <div class="d-flex flex-column flex-lg-row align-items-md-start">
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
        >
          <i class="bi bi-arrow-right" style="font-size: 16px"></i>
        </button>
        <button
          @click="moveTeamMemberToEmployees"
          id="moveToEmployees"
          ref="moveTeamMemberToEmployeesButton"
          type="button"
          class="btn btn-danger my-2"
        >
          <i class="bi bi-arrow-left" style="font-size: 16px"></i>
        </button>
      </div>

      <!-- team members -->
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
    <button
      @click="openModal"
      ref="saveTeamButton"
      class="btn btn-success my-4 align-self-start align-self-xl-end"
    >
      Add team
    </button>
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

import TheEmployees from "./../../../view-components/team/TheEmployees.vue";
import TeamMember from "./../../../view-components/team/TeamMember.vue";

export default {
  emits: ["change-team"],

  components: {
    TheEmployees,
    TeamMember,
  },

  emits: ["open-modal", "change-key"],

  data() {
    return {
      enteredTeamName: "",
      teamNames: [],
      selectedEmployee: null,
      selectedTeamMember: null,
      selectedProjectManager: null,
      teamMembers: [],
      moveEmployeeToTeamButton: null,
      moveTeamMemberToEmployeesButton: null,
      teamNameExists: false,
      search: "",
      employees: [],
      teams: [],
      isLoading: false,
    };
  },

  watch: {
    enteredTeamName(name) {
      if (name === "") {
        this.teamNameExists = false;
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
      } else if (this.teams.find((team) => team.name === name)) {
        this.teamNameExists = true;
        $("#teamName").removeClass("is-valid");
        $("#teamName").addClass("is-invalid");
      } else {
        this.teamNameExists = false;
        $("#teamName").removeClass("is-invalid");
        $("#teamName").addClass("is-valid");
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
              isSelected: false,
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
          }
        });
    },
  },

  computed: {
    teamName() {
      if (this.enteredTeamName === "") {
        return "Your team name";
      } else {
        return this.enteredTeamName;
      }
    },

    teamNames() {
      let names = [];
      this.teams.forEach((t) => {
        names.push(t.name);
      });
      return names;
    },
  },

  mounted() {
    //disables buttons that moves employees
    this.$refs.moveEmployeeToTeamButton.disabled = true;
    this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

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

      this.isLoading = false;
    },
    openModal() {
      this.teamMembers.forEach((m) => {
        delete m.isSelected;
      });
      this.$emit(
        "open-modal",
        this.enteredTeamName,
        this.teamNames,
        this.teamMembers
      );
    },

    setTeamName(e) {
      this.enteredTeamName = e.target.value;
    },

    selectEmployee(id) {
      const selectedEmployee = this.employees.find(
        (e) => e.isSelected === true
      );

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

      this.selectedEmployee = this.employees.find((e) => e.id === id);
      this.selectedEmployee.isSelected = true;

      //toggles selected employee class
      if (selectedEmployee) {
        if (
          this.selectedEmployee !== null &&
          this.selectedEmployee.id === selectedEmployee.id
        ) {
          this.selectedEmployee.isSelected = !this.selectedEmployee.isSelected;
          this.$refs.moveEmployeeToTeamButton.disabled = true;
        }
      }
    },

    selectTeamMember(id) {
      const selectedTeamMember = this.teamMembers.find(
        (e) => e.isSelected === true
      );

      this.teamMembers.forEach((m) => {
        if (m.isSelected === true) {
          m.isSelected = false;
        }
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = false;

      //removes selected class from previous choosen team member
      while (this.employees.find((m) => m.isSelected === true)) {
        const index = this.employees.findIndex((m) => m.isSelected === true);
        this.employees[index].isSelected = false;
      }

      //adds selected class to choosen team member
      this.selectedTeamMember = this.teamMembers.find((m) => m.id === id);
      this.selectedTeamMember.isSelected = true;

      //toggles selected employee class
      if (selectedTeamMember) {
        if (
          this.selectedTeamMember !== null &&
          this.selectedTeamMember.id === selectedTeamMember.id
        ) {
          this.selectedTeamMember.isSelected =
            !this.selectedTeamMember.isSelected;
          this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
        }
      }
    },

    //moves employee to team
    moveEmployeeToTeam() {
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
      this.$emit("change-team", this.teamMembers);
    },

    //moves team member to employees
    moveTeamMemberToEmployees() {
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
      this.$emit("change-team", this.teamMembers);
    },

    selectTeamLeader() {
      //sets move buttons to disabled state
      if (
        this.moveEmployeeToTeamButton !== null &&
        this.moveTeamMemberToEmployeesButton !== null
      ) {
        this.moveEmployeeToTeamButton.disabled = true;
        this.moveTeamMemberToEmployeesButton.disabled = true;
      }

      this.employees.forEach((e) => {
        if (!e.isSelectedAsTeamLeader) {
          e.isSelected = false;
        }
      });

      this.teamMembers.forEach((m) => {
        if (!m.isSelectedAsTeamLeader) {
          m.isSelected = false;
        }
      });

      const selectedTeamLeaderId = this.selectedTeamLeaderId;

      if (selectedTeamLeaderId !== "empty") {
        this.selectedTeamLeader = this.employees.find(
          (e) => e.id === selectedTeamLeaderId
        );

        //resets employees properties to false
        this.employees.forEach((e) => {
          e.isSelected = false;
          e.isSelectedAsTeamLeader = false;
        });

        /**
         * looks for selected team leader in employees to choose first,
         * if does not find selected team leader in employees looks for one in team members
         */
        if (this.employees.find((e) => e.id === selectedTeamLeaderId)) {
          //takes difference between teamMembers and employess arrays
          let newTeamMembersArray = this.teamMembers.filter(
            (x) => !this.employees.includes(x)
          );
          this.teamMembers = newTeamMembersArray;

          const teamLeader = this.employees.find(
            (e) => e.id === selectedTeamLeaderId
          );
          this.selectedTeamLeader = teamLeader;
          teamLeader.isSelected = true;
          teamLeader.isSelectedAsTeamLeader = true;
          this.teamMembers.push(teamLeader);
        } else {
          //takes difference between employess and teamMembers arrays
          let newEmployeesArray = this.employees.filter(
            (x) => !this.teamMembers.includes(x)
          );
          this.employees = newEmployeesArray;

          const teamLeader = this.teamMembers.find(
            (tm) => tm.id === selectedTeamLeaderId
          );
          this.selectedTeamLeader = teamLeader;
          teamLeader.isSelected = true;
          teamLeader.isSelectedAsTeamLeader = true;
          this.employees.push(teamLeader);
        }
      } else {
        while (this.employees.find((e) => e.isSelectedAsTeamLeader === true)) {
          const index = this.employees.findIndex(
            (e) => e.isSelectedAsTeamLeader === true
          );
          this.employees.splice(index, 1);
        }

        while (
          this.teamMembers.find(
            (member) => member.isSelectedAsTeamLeader === true
          )
        ) {
          const index = this.teamMembers.findIndex(
            (member) => member.isSelectedAsTeamLeader === true
          );
          this.teamMembers[index].isSelected = false;
          this.teamMembers[index].isSelectedAsTeamLeader = false;
        }

        this.selectedTeamLeader = null;
      }

      //sorts by team leader in employees to choose
      this.employees.sort(function (x, y) {
        return x === y ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
      });

      //sorts by team leader in team members
      this.teamMembers.sort(function (x, y) {
        return x === y ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
      });
    },
  },
};
</script>
