<template>
  <div class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Create task</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading === false" class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="form-group">
        <label>Task name</label>
        <input
          v-model="taskName"
          id="taskName"
          type="text"
          class="form-control"
        />
        <div v-if="isTaskNameUsed" class="invalid-feedback">
          This task name is already used in this project.
        </div>
      </div>
      <div class="form-group">
        <label>Task description</label>
        <textarea
          v-model="taskDescription"
          id="taskDescription"
          class="form-control"
        ></textarea>
      </div>
      <div class="form-group">
        <label>Start task date</label>
        <input
          v-model="startDate"
          id="startDate"
          type="date"
          :max="endDate"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>End task date</label>
        <input
          v-model="endDate"
          id="endDate"
          ref="endDate"
          disabled
          type="date"
          :min="startDate"
          class="form-control"
        />
      </div>
      <div class="form-group">
        <label>Choose employee</label>
        <select
          v-model="selectedEmployeeIds"
          multiple
          id="selectedEmployeeIds"
          class="form-control"
        >
          <option value="empty">none</option>
          <option v-for="m in projectMembers" :key="m.id" :value="m.id">
            {{ m.name }} - {{ m.job }}
          </option>
        </select>
        <small class="form-text text-muted"
          >You can select more than one employee</small
        >
      </div>
      <button @click="openModal" class="btn btn-success">Create task</button>
    </div>
  </div>

  <teleport to="body">
    <base-modal id="createTaskModal">
      <template #header>Create task</template>
      <template #body>
        <div class="row">
          <div class="col-4 d-flex flex-column">
            <span class="font-weight-bold">Task name</span>{{ taskName }}
          </div>
          <div class="col-8 d-flex flex-column">
            <span class="font-weight-bold"
              >{{ employeeIdsLength === 1 ? "Employee" : "Employees" }}
            </span>
            <p v-if="selectedEmployees.find((e) => e === 'none')">none</p>
            <p v-else class="mb-1" v-for="e in selectedEmployees" :key="e.id">
              {{ e.name }} - {{ e.job }}
            </p>
          </div>
        </div>
        <div class="row my-2">
          <div class="col-4 d-flex flex-column">
            <span class="font-weight-bold">Start date</span>{{ startDate }}
          </div>
          <div class="col-8 d-flex flex-column">
            <span class="font-weight-bold">End date</span>{{ endDate }}
          </div>
        </div>
        <div class="row">
          <div class="col-12 d-flex flex-column text-break">
            <span class="font-weight-bold">Task description</span>
            <p>{{ taskDescription }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-baseline">
          <p>Are you sure you want to add this task?</p>
          <div>
            <button @click="createTask" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeCreateTaskModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationModal">
      <template #header>Validation info</template>
      <template #body>{{ validationMesseage }}</template>
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
      <template #body>You have just added a new task successfully!.</template>
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
import { getDatabase, push, get, child, ref } from "firebase/database";

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

  props: ["projectId"],

  data() {
    return {
      taskName: "",
      taskDescription: "",
      startDate: "",
      endDate: "",
      selectedEmployeeIds: [],
      selectedEmployees: [],
      project: null,
      projectMembers: [],
      validationMesseage: "",
      isTaskNameUsed: false,
      isLoading: false,
    };
  },

  watch: {
    taskName(name) {
      if (name !== "") {
        $("#taskName").removeClass("is-invalid");
        $("#taskName").addClass("is-valid");
      }
    },

    taskDescription(description) {
      if (description !== "") {
        $("#taskDescription").removeClass("is-invalid");
        $("#taskDescription").addClass("is-valid");
      }
    },

    startDate(date) {
      if (date !== "") {
        $("#startDate").removeClass("is-invalid");
        $("#startDate").addClass("is-valid");
        this.$refs.endDate.disabled = false;
      } else {
        this.endDate = "";
        this.$refs.endDate.disabled = true;
      }
    },

    endDate(date) {
      if (date !== "") {
        $("#endDate").removeClass("is-invalid");
        $("#endDate").addClass("is-valid");
      }
    },

    selectedEmployeeIds(ids) {
      if (ids.find((id) => id === "empty") && ids.length > 1) {
        this.selectedEmployeeIds = ["empty"];
        $("#selectedEmployeeIds").removeClass("is-invalid");
        $("#selectedEmployeeIds").addClass("is-valid");
      } else if (ids.length === 0) {
        $("#selectedEmployeeIds").removeClass("is-valid");
        $("#selectedEmployeeIds").addClass("is-invalid");
      } else {
        $("#selectedEmployeeIds").removeClass("is-invalid");
        $("#selectedEmployeeIds").addClass("is-valid");
      }
    },
  },

  computed: {
    employeeIdsLength(ids) {
      return ids.length;
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      //gets all projects
      await get(child(ref(database), "projects/" + this.projectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.project = {
              id: this.projectId,
              name: snapshot.val().name,
              startDate: snapshot.val().startDate,
              endDate: snapshot.val().endDate,
              team: snapshot.val().team,
              projectManager: snapshot.val().projectManager,
              teamLeader: snapshot.val().teamLeader,
              tasks: snapshot.val().tasks,
            };
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.projectMembers = this.selectedProject.team.members;
      this.isLoading = false;
    },

    openModal() {
      let validation = true;

      if (this.taskName === "") {
        validation = false;
        $("#taskName").addClass("is-invalid");
      }

      if (this.taskDescription === "") {
        validation = false;
        $("#taskDescription").addClass("is-invalid");
      }

      if (this.startDate === "") {
        validation = false;
        $("#startDate").addClass("is-invalid");
      }

      if (this.endDate === "") {
        validation = false;
        $("#endDate").addClass("is-invalid");
      }

      if (this.selectedEmployeeIds.length === 0) {
        validation = false;
        $("#selectedEmployeeIds").addClass("is-invalid");
      }

      if (validation) {
        if (this.selectedEmployeeIds.find((id) => id === "empty")) {
          this.selectedEmployees = [];
          this.selectedEmployees.push({
            name: "none",
          });
        } else {
          this.selectedEmployees = [];
          this.selectedEmployeeIds.forEach((id) => {
            if (this.projectMembers.find((pm) => pm.id === id)) {
              this.selectedEmployees.push(
                this.projectMembers.find((pm) => pm.id === id)
              );
            }
          });
        }
        $("#createTaskModal").modal("show");
      } else {
        this.validationMesseage = "Please fill the form.";
        $("#validationModal").modal("show");
      }
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    closeValidationModal() {
      $("#validationModal").modal("hide");
    },

    closeCreateTaskModal() {
      $("#createTaskModal").modal("hide");
    },

    createTask() {
      push(ref(database, "projects/" + this.projectId + "/tasks/"), {
        name: this.taskName,
        description: this.taskDescription,
        startDate: this.startDate,
        endDate: this.endDate,
        employees: this.selectedEmployees,
        status: "todo",
      });
      $("#createTaskModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
