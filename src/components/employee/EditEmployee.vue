<template>
  <section>
    <div class="row flex-column mx-0">
      <div class="d-flex align-items-center col-xl-6 px-0">
        <div class="h5 my-4 mr-2">Edit employee</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <div v-if="isLoading === false" class="card col-xl-6 px-0">
        <div class="card-body">
          <div class="px-0 form-group">
            <label for="exampleFormControlSelect1">Select employee</label>
            <select v-model="selectedEmployeeId" class="form-control">
              <option value="empty" selected>none</option>
              <option v-for="e in employees" :value="e.id">{{ e.name }}</option>
            </select>
          </div>
          <div v-if="showAlert" class="d-flex alert alert-info" role="alert">
            <i
              class="bi bi-exclamation-octagon mr-2"
              style="font-size: 24px"
            ></i>
            <div>
              This employee takes part in a project as a supervisor. You cannot
              change his project manager and team leader properties.
            </div>
          </div>
          <div class="form-group">
            <label for="name">Name</label>
            <input
              v-model="name"
              ref="name"
              disabled
              type="text"
              class="form-control"
              id="name"
            />
          </div>
          <div class="form-group">
            <label for="job-position">Job position</label>
            <input
              v-model="job"
              ref="job"
              disabled
              type="text"
              class="form-control"
              id="job-position"
            />
          </div>
          <div class="form-check">
            <input
              v-model="isProjectManager"
              ref="isProjectManager"
              disabled
              class="form-check-input"
              type="checkbox"
              value=""
              id="project-manager"
            />
            <label class="form-check-label" for="project-manager"
              >Project manager</label
            >
          </div>
          <div class="form-check">
            <input
              v-model="isTeamLeader"
              ref="isTeamLeader"
              disabled
              class="form-check-input"
              type="checkbox"
              value=""
              id="team-leader"
            />
            <label class="form-check-label" for="team-leader"
              >Team leader</label
            >
          </div>
          <div class="form-check px-0 my-2">
            <button
              @click="openModal"
              ref="editEmployeeButton"
              class="btn btn-warning"
              type="button"
            >
              Edit employee
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="editEmployeeModal">
      <template #header>Edit employee</template>
      <template #body>
        <div>
          <p><span class="font-weight-bold">Name: </span>{{ name }}</p>
          <p><span class="font-weight-bold">Job: </span>{{ job }}</p>
          <p>
            <span class="font-weight-bold">Project manager: </span
            >{{ isProjectManager ? "Yes" : "No" }}
          </p>
          <p>
            <span class="font-weight-bold">Team leader: </span
            >{{ isTeamLeader ? "Yes" : "No" }}
          </p>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-baseline">
          Are you sure you want to edit this employee?
          <div>
            <button @click="editEmployee" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeEditEmployeeModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationEmployeeModal">
      <template #header>Edit employee</template>
      <template #body>{{ modalValidationMesseage }}</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeValidationEmployeeModal" class="btn btn-primary">
            OK
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
      <template #header>Server response</template>
      <template #body>You have just edited an employee successfully!</template>
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
import { getDatabase, ref, get, child, update } from "firebase/database";

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
      name: "",
      job: "",
      isProjectManager: false,
      isTeamLeader: false,
      selectedEmployeeId: "empty",
      selectedEmployee: null,
      modalValidationMesseage: "",
      alertMesseage: "",
      employees: [],
      teams: [],
      projects: [],
      isLoading: false,
      showAlert: false,
    };
  },

  watch: {
    selectedEmployeeId(id) {
      if (id !== "empty") {
        let isSupervisor = false;
        this.projects.forEach((p) => {
          if (p.projectManager.id === id || p.teamLeader.id === id) {
            isSupervisor = true;
          }
        });

        //sets all fields's disabled option
        if (isSupervisor) {
          this.showAlert = true;
          this.$refs.name.disabled = false;
          this.$refs.job.disabled = false;
          this.$refs.isProjectManager.disabled = true;
          this.$refs.isTeamLeader.disabled = true;
        } else {
          this.showAlert = false;
          this.$refs.name.disabled = false;
          this.$refs.job.disabled = false;
          this.$refs.isProjectManager.disabled = false;
          this.$refs.isTeamLeader.disabled = false;
        }

        //initializes fields
        this.selectedEmployee = this.employees.find((e) => e.id === id);
        this.name = this.selectedEmployee.name;
        this.job = this.selectedEmployee.job;
        this.isProjectManager = this.selectedEmployee.isProjectManager;
        this.isTeamLeader = this.selectedEmployee.isTeamLeader;
      }
      //no employee is choosen
      //all fields are disabled
      else {
        this.showAlert = false;
        this.selectedEmployee = null;
        this.name = "";
        this.job = "";
        this.isProjectManager = false;
        this.isTeamLeader = false;
        this.$refs.name.disabled = true;
        this.$refs.job.disabled = true;
        this.$refs.isProjectManager.disabled = true;
        this.$refs.isTeamLeader.disabled = true;
        $("#noChoosenEmployeeModal").modal("show");
      }
    },
  },

  mounted() {
    this.loadEmployees();
  },

  methods: {
    async loadEmployees() {
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

    openModal() {
      if (this.selectedEmployeeId !== "empty") {
        let validation = false;

        if (this.name !== this.selectedEmployee.name) {
          validation = true;
        }

        if (this.job !== this.selectedEmployee.job) {
          validation = true;
        }

        if (this.isProjectManager !== this.selectedEmployee.isProjectManager) {
          validation = true;
        }

        if (this.isTeamLeader !== this.selectedEmployee.isTeamLeader) {
          validation = true;
        }

        if (validation) {
          $("#editEmployeeModal").modal("show");
        } else {
          this.modalValidationMesseage =
            "You must enter any change to edit employee.";
          $("#validationEmployeeModal").modal("show");
        }
      } else {
        this.modalValidationMesseage =
          "Please select an employee you want to edit.";
        $("#validationEmployeeModal").modal("show");
      }
    },

    closeEditEmployeeModal() {
      $("#editEmployeeModal").modal("hide");
    },

    closeValidationEmployeeModal() {
      $("#validationEmployeeModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    editEmployee() {
      //updates selected employee in employees
      update(ref(database, "employees/" + this.selectedEmployeeId), {
        name: this.name.trim(),
        job: this.job.trim(),
        isProjectManager: this.isProjectManager,
        isTeamLeader: this.isTeamLeader,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });

      //updates selected employee in teams
      this.teams.forEach((t) => {
        for (const index in t.members) {
          if (t.members[index].id === this.selectedEmployeeId) {
            update(ref(database, "teams/" + t.id + "/members/" + index), {
              name: this.name.trim(),
              job: this.job.trim(),
              isProjectManager: this.isProjectManager,
              isTeamLeader: this.isTeamLeader,
            });
          }
        }
      });

      //updates selected employee in projects/{id}/projectManager if an employee is a PM
      this.projects.forEach((p) => {
        if (p.projectManager.id === this.selectedEmployeeId) {
          update(ref(database, "projects/" + p.id + "/projectManager"), {
            name: this.name.trim(),
            job: this.job.trim(),
            isProjectManager: this.isProjectManager,
            isTeamLeader: this.isTeamLeader,
          });
        }

        //updates selected employee in projects/{id}/teamLeader if an employee is a TL
        if (p.teamLeader.id === this.selectedEmployeeId) {
          update(ref(database, "projects/" + p.id + "/teamLeader"), {
            name: this.name.trim(),
            job: this.job.trim(),
            isProjectManager: this.isProjectManager,
            isTeamLeader: this.isTeamLeader,
          });
        }

        //updates selected employee in projects/{id}/team/members if an employee is a member of a project
        for (const index in p.team.members) {
          if (p.team.members[index].id === this.selectedEmployeeId) {
            update(
              ref(database, "projects/" + p.id + "/team/" + "members/" + index),
              {
                name: this.name.trim(),
                job: this.job.trim(),
                isProjectManager: this.isProjectManager,
                isTeamLeader: this.isTeamLeader,
              }
            );
          }
        }
      });

      $("#editEmployeeModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
