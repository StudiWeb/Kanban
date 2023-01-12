<template>
  <div class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Edit task</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading === false" class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="form-group">
        <label>Select task</label>
        <select v-model="selectedTaskId" class="form-control">
          <option value="empty">none</option>
          <option v-for="task in tasks" :key="task.id" :value="task.id">
            {{ task.name }}
          </option>
        </select>
      </div>

      <div v-if="selectedTaskId !== 'empty'">
        <div class="form-group">
          <label>Task name</label>
          <input
            v-model="taskName"
            ref="taskName"
            id="taskName"
            type="text"
            class="form-control"
          />
          <div class="invalid-feedback">
            This task name is already in use in this project. Please type
            different task name.
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
            class="form-control"
            type="date"
            :max="endDate"
          />
        </div>
        <div class="form-group">
          <label>End task date</label>
          <input
            v-model="endDate"
            id="endDate"
            class="form-control"
            type="date"
            :min="startDate"
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
              <span v-if="m.isSelectedAsProjectManager">(PM)</span>
              <span v-if="m.isSelectedAsTeamLeader">(TL)</span>
            </option>
          </select>
          <small class="form-text text-muted"
            >You can select more than one employee</small
          >
        </div>
        <button @click="openModal" class="btn btn-warning">Edit task</button>
      </div>
    </div>
  </div>

  <teleport to="body">
    <base-modal id="editTaskModal">
      <template #header>Edit task</template>
      <template #body>
        <div class="row">
          <div class="col-4 d-flex flex-column">
            <span class="font-weight-bold">Task name</span>{{ taskName }}
          </div>
          <div class="col-8 d-flex flex-column">
            <span class="font-weight-bold"
              >{{ selectedEmployeeIdsLength === 1 ? "Employee" : "Employees" }}
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
          <p>Are you sure you want to edit this task?</p>
          <div>
            <button @click="editTask" class="btn btn-success mr-2">Yes</button>
            <button @click="closeEditTaskModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationModal">
      <template #header>Edit data</template>
      <template #body
        >You must enter any change in the task to edit it.</template
      >
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
      <template #body>You have just edited the task successfully!.</template>
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
import { getDatabase, update, get, child, ref } from "firebase/database";

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

  props: ["selectedProjectId"],

  data() {
    return {
      selectedTaskId: "empty",
      taskName: "",
      taskDescription: "",
      startDate: "",
      endDate: "",
      projectMembers: [],
      tasks: [],
      taskNames: [],
      selectedEmployeeIds: [],
      selectedEmployees: [],
      selectedProject: null,
      isLoading: false,
    };
  },

  watch: {
    selectedTaskId(taskId) {
      if (taskId !== "empty") {
        //resets employees who are asigned to task
        this.selectedEmployeeIds = [];
        const task = this.tasks.find((t) => t.id === taskId);
        //inits form fields with selected task properties
        this.taskName = task.name;
        this.taskDescription = task.description;
        this.startDate = task.startDate;
        this.endDate = task.endDate;
        //inits employees who are asigned to task
        if (task.employees.find((e) => e.name === "none")) {
          this.selectedEmployeeIds.push("empty");
        } else {
          task.employees.forEach((e) => this.selectedEmployeeIds.push(e.id));
        }
      }
    },

    selectedEmployeeIds(employeIds) {
      this.selectedEmployees = [];
      //sets selectedEmployees
      if (employeIds.find((id) => id === "empty")) {
        this.selectedEmployees.push({ name: "none" });
      } else {
        employeIds.forEach((id) => {
          this.selectedEmployees.push(
            this.projectMembers.find((member) => member.id === id)
          );
        });
      }
    },

    taskName(name) {
      //gets all task names
      get(child(ref(database), "projects/" + this.selectedProjectId + "/tasks"))
        .then((data) => {
          if (data.exists()) {
            this.taskNames = [];
            for (const id in data.val()) {
              if (id !== this.selectedTaskId) {
                this.taskNames.push(data.val()[id].name);
              }
            }
          } else {
            console.log("No data available");
          }

          if (this.taskNames.find((taskName) => taskName === name)) {
            $("#taskName").addClass("is-invalid");
          } else {
            $("#taskName").removeClass("is-invalid");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },
  },

  computed: {
    selectedEmployeeIdsLength() {
      if (this.selectedEmployeeIds) {
        return this.selectedEmployeeIds.length;
      }
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      //gets all projects
      await get(child(ref(database), "projects/" + this.selectedProjectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.selectedProject = {
              id: this.selectedProjectId,
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

      for (const id in this.selectedProject.tasks) {
        this.tasks.push({
          id: id,
          name: this.selectedProject.tasks[id].name,
          description: this.selectedProject.tasks[id].description,
          startDate: this.selectedProject.tasks[id].startDate,
          endDate: this.selectedProject.tasks[id].endDate,
          employees: this.selectedProject.tasks[id].employees,
          status: this.selectedProject.tasks[id].status,
        });
      }

      this.projectMembers = this.selectedProject.team.members;
      this.isLoading = false;
    },

    openModal() {
      const task = this.tasks.find((t) => t.id === this.selectedTaskId);
      const name = task.name;
      const description = task.description;
      const startDate = task.startDate;
      const endDate = task.endDate;
      //takes employees ids from employees who are asigned to task from the begining
      let employeesIds = [];
      if (task.employees === "none") {
        employeesIds.push("empty");
      } else {
        task.employees.forEach((e) => {
          employeesIds.push(e.id);
        });
      }

      let validation = false;

      if (
        !this.taskNames.find((taskName) => taskName === this.taskName) &&
        this.taskName !== name &&
        this.taskName !== ""
      ) {
        validation = true;
      }

      if (description !== this.taskDescription) {
        validation = true;
      }

      if (startDate !== this.startDate) {
        validation = true;
      }

      if (endDate !== this.endDate) {
        validation = true;
      }

      //if there is difference then array length is not equal zero
      let difference = this.selectedEmployeeIds.filter(
        (x) => !employeesIds.includes(x)
      );
      if (difference.length) {
        validation = true;
      }

      if (validation) {
        $("#editTaskModal").modal("show");
      } else {
        $("#validationModal").modal("show");
      }
    },

    closeValidationModal() {
      $("#validationModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    closeEditTaskModal() {
      $("#editTaskModal").modal("hide");
    },

    editTask() {
      update(
        ref(
          database,
          "projects/" + this.selectedProjectId + "/tasks/" + this.selectedTaskId
        ),
        {
          name: this.taskName,
          description: this.taskDescription,
          startDate: this.startDate,
          endDate: this.endDate,
          employees: this.selectedEmployees,
          status: "todo",
        }
      );
      $("#editTaskModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
