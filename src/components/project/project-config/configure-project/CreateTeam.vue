<template>
  <div class="col-xl-6 px-0 mb-4">
    <div v-if="isLoading" class="spinner-border text-primary" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
  <div v-if="!isLoading" class="row mt-4">
    <div class="col">
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
              v-for="e in otherEmployees"
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
          <!-- toast -->
          <div
            class="toast hide bg-warning"
            id="toast"
            data-delay="2000"
            style="
              position: absolute;
              width: 400px;
              top: 50%;
              left: 50%;
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, ref, get, child } from "firebase/database";

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

  props: ["teamName", "teamMembers"],

  emits: ["update-team", "show-info"],

  data() {
    return {
      employee: null,
      teamMember: null,
      employees: [],
      search: "",
      isLoading: false,
    };
  },

  watch: {
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

  computed: {
    teamName() {
      this.enteredTeamName = this.teamName;
      return this.teamName;
    },

    otherEmployees() {
      this.teamMembers.forEach((t) => {
        while (this.employees.find((e) => e.id === t.id)) {
          const index = this.employees.findIndex((e) => e.id === t.id);
          this.employees.splice(index, 1);
        }
      });
      return this.employees;
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
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
      this.isLoading = false;
    },

    selectEmployee(id) {
      const employee = this.employees.find((e) => e.isSelected === true);

      this.employees.forEach((e) => {
        e.isSelected = false;
      });

      this.teamMembers.forEach((e) => {
        e.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = false;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = true;

      this.employee = this.employees.find((m) => m.id === id);
      this.employee.isSelected = true;

      if (employee) {
        if (this.employee.id === employee.id) {
          this.employee.isSelected = !this.employee.isSelected;
          this.$refs.moveEmployeeToTeamButton.disabled = true;
        }
      }
    },

    selectTeamMember(id) {
      const employee = this.teamMembers.find((e) => e.isSelected === true);

      this.teamMembers.forEach((e) => {
        e.isSelected = false;
      });

      this.employees.forEach((e) => {
        e.isSelected = false;
      });

      this.$refs.moveEmployeeToTeamButton.disabled = true;
      this.$refs.moveTeamMemberToEmployeesButton.disabled = false;

      this.teamMember = this.teamMembers.find((m) => m.id === id);
      if (
        this.teamMember.isSelectedAsProjectManager === true ||
        this.teamMember.isSelectedAsTeamLeader === true
      ) {
        $("#toast").toast("show");
        this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
      } else {
        this.teamMember.isSelected = true;
      }

      if (employee) {
        if (this.teamMember.id === employee.id) {
          this.teamMember.isSelected = !this.teamMember.isSelected;
          this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
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
      this.$emit("update-team", this.teamMembers);
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
      this.$emit("update-team", this.teamMembers);
    },
  },
};
</script>
