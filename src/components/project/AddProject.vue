<template>
  <section class="row flex-column mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Add project</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-if="isLoading === false">
      <div class="col-xl-6 px-0">
        <div class="form-group">
          <label>Project name</label>
          <input
            v-model="projectName"
            ref="projectName"
            type="text"
            class="form-control"
            id="projectName"
          />
          <div v-if="projectNameExists" class="invalid-feedback">
            This project name is already in use. Please type different project
            name.
          </div>
        </div>
        <div class="form-group">
          <label>Start date</label>
          <input
            v-model="startDate"
            :max="endDate"
            type="date"
            class="form-control"
            id="startDate"
          />
        </div>
        <div class="form-group">
          <label>End date</label>
          <input
            v-model="endDate"
            :min="startDate"
            type="date"
            class="form-control"
            id="endDate"
          />
        </div>

        <div class="form-group">
          <label>My team</label>
          <select @change="setComponent" class="form-control">
            <option value="empty">none</option>
            <option value="existing-team">
              I choose a team from a team list
            </option>
            <option value="new-team">I want to create a new team</option>
          </select>
        </div>
      </div>

      <component
        @open-modal="openModal"
        @existing-team="openModalForExistingTeam"
        @validation-modal="openValidationModal"
        :projectName="projectName"
        :is="component"
      ></component>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="addProjectModal">
      <template #header>Create project</template>
      <template #body>
        <p>
          <span class="font-weight-bold">Project name: </span>{{ projectName }}
        </p>
        <div class="row">
          <div class="col-6">
            <div class="font-weight-bold">Start date</div>
            <div>{{ startDate }}</div>
          </div>
          <div>
            <div class="font-weight-bold">End date</div>
            <div>{{ endDate }}</div>
          </div>
        </div>
        <div class="row my-2">
          <div class="col-6">
            <div class="font-weight-bold">Project manager</div>
            <div>{{ projectManagerName }}</div>
          </div>
          <div>
            <div class="font-weight-bold">Team leader</div>
            <div>{{ teamLeaderName }}</div>
          </div>
        </div>
        <p><span class="font-weight-bold">Team members</span></p>
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Job position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in projectMembers" :key="member.id">
              <td>
                {{ member.name }}
              </td>
              <td>{{ member.job }}</td>
            </tr>
          </tbody>
        </table>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-baseline">
          Are you sure do you want to create this project?
          <div>
            <button @click="createProject" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeAddProjectModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationModal">
      <template #header>Create project</template>
      <template #body>Please fiil the form.</template>
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
    <base-modal id="responseServerModal">
      <template #header>Server response</template>
      <template #body>You have just created a new project!</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeResponseServerModal" class="btn btn-primary">
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>
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

import NewTeam from "./project-config/add-project/NewTeam.vue";
import ExistingTeam from "./project-config/add-project/ExistingTeam.vue";

export default {
  components: { NewTeam, ExistingTeam },

  data() {
    return {
      component: "",
      projectName: "",
      startDate: "",
      endDate: "",
      projectNameExists: false,
      projectNames: [],
      isLoading: false,
      projectManager: null,
      teamLeader: null,
      projectMembers: [],
      teamId: "",
    };
  },

  computed: {
    projectManagerName() {
      if (this.projectManager) {
        return this.projectManager.name;
      }
    },

    teamLeaderName() {
      if (this.teamLeader) {
        return this.teamLeader.name;
      }
    },
  },

  watch: {
    projectName(name) {
      this.projectNameExists = false;
      if (name === "") {
        $("#projectName").removeClass("is-valid");
        $("#projectName").addClass("is-invalid");
      } else if (this.projectNames.find((n) => n === name)) {
        $("#projectName").removeClass("is-valid");
        $("#projectName").addClass("is-invalid");
        this.projectNameExists = true;
      } else {
        $("#projectName").removeClass("is-invalid");
        $("#projectName").addClass("is-valid");
      }
    },

    startDate(date) {
      if (date !== "") {
        $("#startDate").removeClass("is-invalid");
        $("#startDate").addClass("is-valid");
      } else {
        $("#startDate").removeClass("is-valid");
        $("#startDate").addClass("is-invalid");
      }
    },

    endDate(date) {
      if (date !== "") {
        $("#endDate").removeClass("is-invalid");
        $("#endDate").addClass("is-valid");
      } else {
        $("#endDate").removeClass("is-valid");
        $("#endDate").addClass("is-invalid");
      }
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      //gets all project names
      await get(child(ref(database), "projects"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.projectNames.push(snapshot.val()[id].name);
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

    setComponent(e) {
      this.component = e.target.value;
    },

    openModal(teamName, teamNames, projectManager, teamLeader, teamMembers) {
      let validation = true;
      this.teamName = teamName;
      this.projectMembers = teamMembers;

      if (this.projectName !== "") {
        if (this.projectNames.find((n) => n === this.projectName)) {
          validation = false;
          $("#projectName").addClass("is-invalid");
        }
      } else {
        validation = false;
        $("#projectName").addClass("is-invalid");
      }

      if (this.startDate === "") {
        validation = false;
        $("#startDate").addClass("is-invalid");
      }

      if (this.endDate === "") {
        validation = false;
        $("#endDate").addClass("is-invalid");
      }

      if (projectManager) {
        if (projectManager.id === "empty") {
          validation = false;
        } else {
          this.projectManager = projectManager;
        }
      }

      if (teamLeader) {
        if (teamLeader.id === "empty") {
          validation = false;
        } else {
          this.teamLeader = teamLeader;
        }
      }

      if (teamNames.find((n) => n === teamName)) {
        validation = false;
      }

      if (validation) {
        $("#addProjectModal").modal("show");
      } else {
        $("#validationModal").modal("show");
      }
    },

    openModalForExistingTeam(
      teamName,
      projectManager,
      teamLeader,
      projectMembers,
      teamId
    ) {
      let validation = true;
      this.teamName = teamName;
      this.projectMembers = projectMembers;
      this.teamId = teamId;

      if (this.projectName !== "") {
        if (this.projectNames.find((n) => n === this.projectName)) {
          validation = false;
          $("#projectName").addClass("is-invalid");
        }
      } else {
        validation = false;
        $("#projectName").addClass("is-invalid");
      }

      if (this.startDate === "") {
        validation = false;
        $("#startDate").addClass("is-invalid");
      }

      if (this.endDate === "") {
        validation = false;
        $("#endDate").addClass("is-invalid");
      }

      if (projectManager) {
        if (projectManager.id === "empty") {
          validation = false;
        } else {
          this.projectManager = projectManager;
        }
      }

      if (teamLeader) {
        if (teamLeader.id === "empty") {
          validation = false;
        } else {
          this.teamLeader = teamLeader;
        }
      }

      if (validation) {
        $("#addProjectModal").modal("show");
      } else {
        $("#validationModal").modal("show");
      }
    },

    openValidationModal() {
      if (this.projectName !== "") {
        if (this.projectNames.find((n) => n === this.projectName)) {
          $("#projectName").addClass("is-invalid");
        }
      } else {
        $("#projectName").addClass("is-invalid");
      }

      if (this.startDate === "") {
        $("#startDate").addClass("is-invalid");
      }

      if (this.endDate === "") {
        $("#endDate").addClass("is-invalid");
      }

      $("#validationModal").modal("show");
    },

    closeResponseServerModal() {
      $("#responseServerModal").modal("hide");
      this.$emit("change-key");
      this.$parent.$parent.$parent.$emit("change-key");
    },

    closeAddProjectModal() {
      $("#addProjectModal").modal("hide");
    },

    closeValidationModal() {
      $("#validationModal").modal("hide");
    },

    async createProject() {
      //removes isSelected, isSelectedAsProjectManager and isSelectedAsTeamLeader properties
      this.projectMembers.forEach((m) => {
        delete m.isSelectedAsProjectManager;
        delete m.isSelectedAsTeamLeader;
        delete m.isSelected;
      });

      //ads a new created team to teams
      if (this.component === "new-team") {
        let teamId = "";

        await push(ref(database, "teams/"), {
          name: this.teamName,
          members: this.projectMembers,
        })
          .then((data) => {
            // Data saved successfully!
            //gets a new added team id
            teamId = data._path.pieces_[1];
          })
          .catch((error) => {
            // The write failed...
            console.log(error);
          });

        //prepeares a team to add to a project
        this.selectedTeam = {
          id: teamId,
          name: this.teamName,
          members: this.projectMembers,
        };
      }

      if (this.component === "existing-team") {
        //prepeares a team to add to a project
        this.selectedTeam = {
          id: this.teamId,
          name: this.teamName,
          members: this.projectMembers,
        };
      }
      console.log(this.projectName);
      push(ref(database, "projects/"), {
        name: this.projectName.trim(),
        team: this.selectedTeam,
        startDate: this.startDate.trim(),
        endDate: this.endDate.trim(),
        projectManager: this.projectManager,
        teamLeader: this.teamLeader,
        isVisible: true,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });

      $("#addProjectModal").modal("hide");
      $("#responseServerModal").modal("show");
    },
  },
};
</script>
