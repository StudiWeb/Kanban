<template>
  <section class="row flex-column mx-0">
    <div class="col-xl-6 px-0">
      <div class="h5 my-4 px-0">Add employee</div>
    </div>
    <div class="card col-xl-6 px-0">
      <div class="card-body">
        <div>
          <div class="form-group">
            <label for="name">Name</label>
            <input v-model="name" type="text" class="form-control" id="name" />
            <div class="invalid-feedback">This field cannot be empty!</div>
          </div>
          <div class="form-group">
            <label for="job-position">Job position</label>
            <input
              v-model="job"
              type="text"
              class="form-control"
              id="jobPosition"
            />
            <div class="invalid-feedback">This field cannot be empty!</div>
          </div>
          <div class="form-check">
            <input
              v-model="isProjectManager"
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
              @click="openAddEmployeeModal"
              class="btn btn-success"
              type="submit"
            >
              Add employee
            </button>
          </div>
        </div>
      </div>
    </div>
    <teleport to="body">
      <base-modal id="addEmployeeModal">
        <template #header> Add employee </template>
        <template #body>
          <p><span class="font-weight-bold">Name:</span> {{ name }}</p>
          <p><span class="font-weight-bold">Job position:</span> {{ job }}</p>
          <p>
            <span class="font-weight-bold">Project manager:</span>
            {{ isProjectManager ? "Yes" : "No" }}
          </p>
          <p>
            <span class="font-weight-bold">Team leader:</span>
            {{ isTeamLeader ? "Yes" : "No" }}
          </p>
        </template>
        <template #footer>
          <div class="d-flex justify-content-between align-items-baseline">
            Are you sure do you want to add this employee?
            <div>
              <button @click="createEmployee" class="btn btn-success mr-2">
                Yes
              </button>
              <button @click="closeAddEmployeeModal" class="btn btn-primary">
                No
              </button>
            </div>
          </div>
        </template>
      </base-modal>
    </teleport>

    <teleport to="body">
      <base-modal id="serverResponseModal">
        <template #header>Server response</template>
        <template #body
          >You have just added a new employee to app successfully!</template
        >
        <template #footer>
          <div class="d-flex justify-content-end">
            <button @click="closeServerResponseModal" class="btn btn-primary">
              Ok
            </button>
          </div>
        </template>
      </base-modal>
    </teleport>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";

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
    };
  },

  watch: {
    name(value) {
      if (value !== "") {
        $("#name").removeClass("is-invalid");
        $("#name").addClass("is-valid");
      } else {
        $("#name").removeClass("is-valid");
        $("#name").addClass("is-invalid");
      }
    },

    job(value) {
      if (value !== "") {
        $("#jobPosition").removeClass("is-invalid");
        $("#jobPosition").addClass("is-valid");
      } else {
        $("#jobPosition").removeClass("is-valid");
        $("#jobPosition").addClass("is-invalid");
      }
    },
  },

  methods: {
    openAddEmployeeModal() {
      if (this.name === "" && this.job === "") {
        $("#name").addClass("is-invalid");
        $("#jobPosition").addClass("is-invalid");
        $("#addEmployeeModal").modal("hide");
      } else if (this.name === "") {
        $("#name").addClass("is-invalid");
        $("#addEmployeeModal").modal("hide");
      } else if (this.job === "") {
        $("#jobPosition").addClass("is-invalid");
        $("#addEmployeeModal").modal("hide");
      } else {
        $("#addEmployeeModal").modal("show");
      }
    },

    createEmployee() {
      push(ref(database, "employees/"), {
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

      $("#addEmployeeModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },

    closeAddEmployeeModal() {
      $("#addEmployeeModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },
  },
};
</script>
