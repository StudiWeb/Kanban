<template>
  <section>
    <div class="col-xl-6 px-0 mb-4">
      <div class="d-flex align-items-center">
        <div class="h5 mr-2">Edit project</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div v-if="!isLoading">
      <div class="col-xl-6 px-0">
        <div class="form-group">
          <label>Project name</label>
          <input
            v-model="projectName"
            id="projectName"
            type="text"
            class="form-control"
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
            id="startDate"
            type="date"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>End date</label>
          <input
            v-model="endDate"
            id="endDate"
            type="date"
            class="form-control"
          />
        </div>
        <div class="form-group">
          <label>Choose project manager</label>
          <select
            v-model="projectManagerId"
            @change="selectSupervisor('projectManager')"
            id="projectManager"
            class="form-control"
          >
            <option value="empty">none</option>
            <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">
              {{ pm.name }} - {{ pm.job }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Choose team leader</label>
          <select
            v-model="teamLeaderId"
            @change="selectSupervisor('teamLeader')"
            id="teamLeader"
            class="form-control"
          >
            <option value="empty">none</option>
            <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">
              {{ tl.name }} - {{ tl.job }}
            </option>
          </select>
        </div>
      </div>

      <CreateTeam
        @update-team="updateTeam"
        :employees="employees"
        :teamMembers="teamMembers"
        :teamName="teamName"
      />

      <button @click="openModal" class="btn btn-warning my-4">
        Edit project
      </button>
    </div>
  </section>

  <teleport to="body">
    <base-modal id="editProjectModal">
      <template #header>Edit project</template>
      <template #body>
        <div class="row">
          <div class="col">
            <div class="font-weight-bold">Project name</div>
            <span>{{ projectName }}</span>
          </div>
        </div>
        <div class="row my-3">
          <div class="col-4">
            <div class="font-weight-bold">Project manager</div>
            <span>{{ projectManagerName }}</span>
          </div>
          <div class="col-4">
            <div class="font-weight-bold">Team leader</div>
            <span>{{ teamLeaderName }}</span>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-4">
            <div class="font-weight-bold">Start date</div>
            <span>{{ startDate }}</span>
          </div>
          <div class="col-4">
            <div class="font-weight-bold">End date</div>
            <span>{{ endDate }}</span>
          </div>
        </div>
        <div class="row">
          <table class="table table-striped mx-2">
            <thead>
              <th>Name</th>
              <th>Job position</th>
            </thead>
            <tbody>
              <tr v-for="member in teamMembers" :key="member.id">
                <td>{{ member.name }}</td>
                <td>{{ member.job }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between align-items-center">
          <div>Are you sure you want to edit this project?</div>
          <div>
            <button @click="editProject" class="btn btn-success mr-2">
              Yes
            </button>
            <button @click="closeEditProjectModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationModal">
      <template #header>Server response</template>
      <template #body>You must enter any change in the project!</template>
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
      <template #body>You have just edited the team successfully!</template>
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
var isEqual = function (value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value);

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false;

  // If items are not an object or array, return false
  if (["[object Array]", "[object Object]"].indexOf(type) < 0) return false;

  // Compare the length of the length of the two items
  var valueLen =
    type === "[object Array]" ? value.length : Object.keys(value).length;
  var otherLen =
    type === "[object Array]" ? other.length : Object.keys(other).length;
  if (valueLen !== otherLen) return false;

  // Compare two items
  var compare = function (item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (["[object Array]", "[object Object]"].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false;
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false;

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === "[object Function]") {
        if (item1.toString() !== item2.toString()) return false;
      } else {
        if (item1 !== item2) return false;
      }
    }
  };

  // Compare properties
  if (type === "[object Array]") {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false;
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false;
      }
    }
  }

  // If nothing failed, return true
  return true;
};

import { initializeApp } from "firebase/app";
import { getDatabase, ref, update, get, child } from "firebase/database";

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

import CreateTeam from "./CreateTeam.vue";

export default {
  components: {
    CreateTeam,
  },

  emits: ["change-key"],

  props: ["projectId"],

  data() {
    return {
      project: null,
      projectName: "",
      projectNameExists: false,
      startDate: "",
      endDate: "",
      projectManagerId: "empty",
      teamLeaderId: "empty",
      projectManager: null,
      projectManagers: [],
      teamLeaders: [],
      teamLeader: null,
      teamMembers: [],
      project: null,
      teamName: "",
      employees: [],
      projectNames: [],
      baseProjectMembers: [],
      teamId: "",
      isLoading: false,
    };
  },

  computed: {
    projectManagerName() {
      if (this.projectManager !== null) {
        return this.projectManager.name;
      }
    },

    teamLeaderName() {
      if (this.teamLeader !== null) {
        return this.teamLeader.name;
      }
    },
  },

  watch: {
    projectName(name) {
      if (name === "") {
        this.projectNameExists = false;
        $("#projectName").addClass("is-invalid");
      } else if (
        this.projectNames.find(
          (p) => p.name === name && p.id !== this.projectId
        )
      ) {
        $("#projectName").addClass("is-invalid");
        this.projectNameExists = true;
      } else {
        $("#projectName").removeClass("is-invalid");
      }
    },

    startDate(date) {
      if (date === "") {
        $("#startDate").addClass("is-invalid");
      } else {
        $("#startDate").removeClass("is-invalid");
      }
    },

    endDate(date) {
      if (date === "") {
        $("#endDate").addClass("is-invalid");
      } else {
        $("#endDate").removeClass("is-invalid");
      }
    },

    projectManagerId(id) {
      if (id === "empty") {
        $("#projectManager").addClass("is-invalid");
      } else {
        $("#projectManager").removeClass("is-invalid");
      }
    },

    teamLeaderId(id) {
      if (id === "empty") {
        $("#teamLeader").addClass("is-invalid");
      } else {
        $("#teamLeader").removeClass("is-invalid");
      }
    },
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      //gets project managers, team leaders and employees
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

      await get(child(ref(database), "projects"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.projectNames.push({
                id: id,
                name: snapshot.val()[id].name,
              });
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      //gets selected project
      await get(child(ref(database), "projects/" + this.projectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.project = {
              id: this.projectId,
              name: snapshot.val().name,
              startDate: snapshot.val().startDate,
              endDate: snapshot.val().endDate,
              projectManager: snapshot.val().projectManager,
              teamLeader: snapshot.val().teamLeader,
              team: snapshot.val().team,
              tasks: snapshot.val().tasks,
              isVisible: snapshot.val().isVisible,
            };

            this.baseProjectMembers = snapshot.val().team.members;
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });

      this.projectName = this.project.name;
      this.startDate = this.project.startDate;
      this.endDate = this.project.endDate;
      this.projectManager = this.project.projectManager;
      this.projectManagerId = this.project.projectManager.id;
      this.teamLeader = this.project.teamLeader;
      this.teamLeaderId = this.project.teamLeader.id;
      this.teamId = this.project.team.id;
      this.teamName = this.project.team.name;
      this.teamMembers = this.project.team.members;

      this.isLoading = false;
    },

    updateTeam(members) {
      members.forEach((m) => {
        m.isSelectedAsProjectManager = false;
        m.isSelectedAsTeamLeader = false;
      });

      members.forEach((m) => {
        if (m.id === this.projectManagerId) {
          m.isSelectedAsProjectManager = true;
        }

        if (m.id === this.teamLeaderId) {
          m.isSelectedAsTeamLeader = true;
        }
      });

      members.forEach((m) => {
        delete m.isSelected;
      });
      this.teamMembers = members;
    },

    selectSupervisor(supervisor) {
      /**
       * project manager
       */
      if (supervisor === "projectManager") {
        const projectManagerId = this.projectManagerId;

        if (projectManagerId !== "empty") {
          const projectManager = this.projectManagers.find(
            (pm) => pm.id === projectManagerId
          );
          this.projectManager = projectManager;

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

          this.projectManager.isSelectedAsProjectManager = true;
        } else {
          this.projectManager = null;
        }
      }

      /**
       * team leader
       */
      if (supervisor === "teamLeader") {
        const teamLeaderId = this.teamLeaderId;

        if (teamLeaderId !== "empty") {
          const teamLeader = this.teamLeaders.find(
            (tl) => tl.id === teamLeaderId
          );
          this.teamLeader = teamLeader;
          this.teamMembers.forEach((m) => (m.isSelectedAsTeamLeader = false));

          if (this.teamMembers.find((m) => m.id === teamLeaderId)) {
            this.teamMembers.find(
              (m) => m.id === teamLeaderId
            ).isSelectedAsTeamLeader = true;
          } else {
            teamLeader.isSelectedAsTeamLeader = true;
            this.teamMembers.push(teamLeader);
          }

          this.teamLeader.isSelectedAsTeamLeader = true;
        } else {
          this.teamLeader = null;
        }
      }
    },

    async openModal() {
      let validation = false;

      if (this.projectName !== this.project.name) {
        validation = true;
      }

      if (
        this.projectNames.find(
          (p) => p.name === this.projectName && p.id !== this.projectId
        )
      ) {
        validation = true;
      }

      if (this.startDate !== this.project.startDate && this.startDate !== "") {
        validation = true;
      }

      if (this.endDate !== this.project.endDate && this.endDate !== "") {
        validation = true;
      }

      if (
        this.projectManagerId !== this.project.projectManager.id &&
        this.projectManagerId !== "empty"
      ) {
        validation = true;
      }

      if (
        this.teamLeaderId !== this.project.teamLeader.id &&
        this.teamLeaderId !== "empty"
      ) {
        validation = true;
      }

      this.baseProjectMembers.forEach((m) => {
        delete m.isSelected;
        delete m.isSelectedAsProjectManager;
        delete m.isSelectedAsTeamLeader;
      });

      this.teamMembers.forEach((m) => {
        delete m.isSelected;
        delete m.isSelectedAsProjectManager;
        delete m.isSelectedAsTeamLeader;
      });

      this.baseProjectMembers.sort((a, b) => a.name.localeCompare(b.name));
      this.teamMembers.sort((a, b) => a.name.localeCompare(b.name));

      if (!isEqual(this.baseProjectMembers, this.teamMembers)) {
        validation = true;
      }

      if (validation) {
        $("#editProjectModal").modal("show");
      } else {
        $("#validationModal").modal("show");
      }
    },

    closeEditProjectModal() {
      $("#editProjectModal").modal("hide");
    },

    closeValidationModal() {
      $("#validationModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    editProject() {
      // delete this.projectManager.isSelectedAsProjectManager;
      // delete this.projectManager.isSelectedAsTeamLeader;

      // delete this.teamLeader.isSelectedAsProjectManager;
      // delete this.teamLeader.isSelectedAsTeamLeader;

      update(ref(database, "projects/" + this.projectId), {
        name: this.projectName,
        startDate: this.startDate,
        endDate: this.endDate,
        projectManager: this.projectManager,
        teamLeader: this.teamLeader,
        team: {
          id: this.teamId,
          name: this.teamName,
          members: this.teamMembers,
        },
      }).catch((error) => {
        console.error(error);
      });

      $("#editProjectModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
