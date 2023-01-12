<template>
  <section>
    <div class="row flex-column mx-0">
      <div class="d-flex align-items-center col-xl-6 px-0">
        <div class="h5 my-4 px-0 mr-2">Delete employee</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-if="isLoading === false" class="card px-0 col-xl-6">
        <div class="card-body">
          <div>
            <div class="px-0 form-group">
              <label>Select employee</label>
              <select v-model="selectedEmployeeId" class="form-control">
                <option value="empty">none</option>
                <option v-for="e in employees" :value="e.id" :key="e.id">
                  {{ e.name }}
                </option>
              </select>
            </div>
            <div v-if="selectedEmployeeId !== 'empty'">
              <div
                v-if="canShowAlert"
                class="alert alert-info d-flex align-items-center"
                role="alert"
              >
                <i
                  class="bi bi-exclamation-octagon"
                  style="font-size: 24px"
                ></i>
                <div class="ml-2">
                  {{ alertMesseage }}
                </div>
              </div>
              <div class="card my-4">
                <div class="card-header">Employee details</div>
                <div class="card-body">
                  <p class="card-text">
                    <span class="font-weight-bold">Name: </span
                    >{{ employeeName }}
                  </p>
                  <p class="card-text">
                    <span class="font-weight-bold">Job position: </span
                    >{{ employeeJob }}
                  </p>
                  <p class="card-text">
                    <span class="font-weight-bold">Project manager: </span>
                    {{ isEmployeeProjectManager ? "Yes" : "No" }}
                  </p>
                  <p class="card-text">
                    <span class="font-weight-bold">Team leader</span>
                    {{ isEmployeeTeamLeader ? "Yes" : "No" }}
                  </p>
                </div>
              </div>
            </div>
            <button
              @click="openDeleteEmployeeModal"
              ref="deleteEmployeeButton"
              type="submit"
              class="btn btn-danger"
            >
              Delete employee
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="deleteEmployeeModal">
      <template #header>Delete employee</template>
      <template #body>
        <div v-if="selectedEmployeeId !== 'empty'">
          <p><span class="font-weight-bold">Name:</span> {{ employeeName }}</p>
          <p>
            <span class="font-weight-bold">Job position:</span>
            {{ employeeJob }}
          </p>
          <p>
            <span class="font-weight-bold">Project manager:</span>
            {{ isEmployeeProjectManager ? "Yes" : "No" }}
          </p>
          <p>
            <span class="font-weight-bold">Team leader:</span>
            {{ isEmployeeTeamLeader ? "Yes" : "No" }}
          </p>
        </div>
        <div v-else>{{ modalMesseage }}</div>
      </template>
      <template #footer>
        <div>
          <div
            v-if="selectedEmployeeId !== 'empty'"
            class="d-flex justify-content-between align-items-baseline"
          >
            <div>Are you sure do you want to delete this employee?</div>
            <div>
              <button
                @click="deleteEmployee"
                type="button"
                class="btn btn-success mr-2"
              >
                Yes
              </button>
              <button
                @click="closeDeleteEmployeeModal"
                type="button"
                class="btn btn-primary"
              >
                No
              </button>
            </div>
          </div>
          <div v-else class="d-flex justify-content-end">
            <button
              @click="closeDeleteEmployeeModal"
              class="btn btn-primary"
              type="button"
            >
              Ok
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
      <template #header>Server response</template>
      <template #body>You have just deleted an employee successfully!</template>
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
import { getDatabase, ref, set, get, child } from "firebase/database";

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
      selectedEmployeeId: "empty",
      selectedEmployee: null,
      canShowAlert: false,
      modalMesseage: "Please select an employee you want to delete.",
      alertMesseage: "",
      employees: [],
      teams: [],
      isLoading: false,
    };
  },

  watch: {
    selectedEmployeeId(id) {
      if (id !== "empty") {
        //initializes fields
        const selectedEmployeeId = id;
        this.selectedEmployee = this.employees.find((e) => e.id === id);
        //checks if an employee is a member of a team
        let isTeamMember = false;
        this.teams.forEach((team) => {
          if (team.members.find((m) => m.id === id)) {
            isTeamMember = true;
          }
        });

        if (isTeamMember) {
          this.$refs.deleteEmployeeButton.disabled = true;
          this.canShowAlert = true;
          this.alertMesseage =
            "This employee is a member of a team. You cannot delete him.";
        } else {
          this.$refs.deleteEmployeeButton.disabled = false;
          this.canShowAlert = false;
          this.alertMesseage = "";
        }
      }
      //no employee is choosen
      //all fields are disabled
      else {
        this.$refs.deleteEmployeeButton.disabled = false;
        this.selectedEmployee = null;
        this.canShowAlert = false;
        this.alertMesseage = "";
        this.modalMesseage = "Please select employee to edit.";
      }
    },
  },

  computed: {
    employeeName() {
      if (this.selectedEmployee) {
        return this.selectedEmployee.name;
      } else {
        return "";
      }
    },

    employeeJob() {
      if (this.selectedEmployee) {
        return this.selectedEmployee.job;
      } else {
        return "";
      }
    },

    isEmployeeProjectManager() {
      if (this.selectedEmployee) {
        return this.selectedEmployee.isProjectManager;
      } else {
        return false;
      }
    },

    isEmployeeTeamLeader() {
      if (this.selectedEmployee) {
        return this.selectedEmployee.isTeamLeader;
      } else {
        return false;
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

      this.isLoading = false;
    },

    openDeleteEmployeeModal() {
      $("#deleteEmployeeModal").modal("show");
    },

    closeDeleteEmployeeModal() {
      $("#deleteEmployeeModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    deleteEmployee() {
      set(ref(database, "employees/" + this.selectedEmployee.id), null);
      $("#deleteEmployeeModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
