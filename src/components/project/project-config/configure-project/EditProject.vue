<template>
  <section>
    <div class="h5 my-3">Edit project</div>
    <div class="col-xl-6 px-0">
      <div class="form-group">
        <label>Project name</label>
        <input v-model="projectName" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label>Start date</label>
        <input v-model="startDate" type="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>End date</label>
        <input v-model="endDate" type="date" class="form-control" />
      </div>
      <div class="form-group">
        <label>Choose project manager</label>
        <select
          v-model="projectManagerId"
          @change="selectSupervisor('projectManager')"
          class="form-control"
        >
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
          class="form-control"
        >
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
              <th class="text-center">Project manager</th>
              <th class="text-center">Team leader</th>
            </thead>
            <tbody>
              <tr v-for="member in teamMembers" :key="member.id">
                <td>{{ member.name }}</td>
                <td>{{ member.job }}</td>
                <td class="text-center">
                  <i
                    v-if="member.isSelectedAsProjectManager"
                    class="bi bi-check"
                    style="font-size: 16px"
                  ></i>
                  <i v-else class="bi bi-dash" style="font-size: 16px"></i>
                </td>
                <td class="text-center">
                  <i
                    v-if="member.isSelectedAsTeamLeader"
                    class="bi bi-check"
                    style="font-size: 16px"
                  ></i>
                  <i v-else class="bi bi-dash" style="font-size: 16px"></i>
                </td>
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

  props: ["selectedProjectId"],

  data() {
    return {
      project: null,
      projectName: "",
      startDate: "",
      endDate: "",
      projectManagerId: "empty",
      teamLeaderId: "empty",
      projectManager: null,
      projectManagers: [],
      teamLeaders: [],
      teamLeader: null,
      teamMembers: [],
      validation: false,
      teamName: "",
      project: null,
      employees: [],
      projects: [],
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

      await get(child(ref(database), "projects"))
        .then((snapshot) => {
          if (snapshot.exists()) {
            for (const id in snapshot.val()) {
              this.projects.push({
                id: id,
                name: snapshot.val()[id].name,
                startDate: snapshot.val()[id].startDate,
                endDate: snapshot.val()[id].endDate,
                projectManager: snapshot.val()[id].projectManager,
                teamLeader: snapshot.val()[id].teamLeader,
                team: snapshot.val()[id].team,
                tasks: snapshot.val()[id].tasks,
                isVisible: snapshot.val()[id].isVisible,
              });
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.employees.forEach((e) => {
        if (e.isProjectManager) {
          this.projectManagers.push(e);
        }
        if (e.isTeamLeader) {
          this.teamLeaders.push(e);
        }
      });
      this.project = this.projects.find((p) => p.id === this.selectedProjectId);
      this.projectName = this.project.name;
      this.startDate = this.project.startDate;
      this.endDate = this.project.endDate;
      this.projectManager = this.project.projectManager;
      this.projectManagerId = this.project.projectManager.id;
      this.teamLeader = this.project.teamLeader;
      this.teamLeaderId = this.project.teamLeader.id;
      this.teamMembers = this.project.team.members;
      this.teamName = this.project.team.name;
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
      get(child(ref(database), "projects/" + this.selectedProjectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            /**
             * project manager
             */
            if (supervisor === "projectManager") {
              const projectManagerId = this.projectManagerId;
              const projectManager = this.projectManagers.find(
                (pm) => pm.id === projectManagerId
              );
              this.projectManager = projectManager;

              if (projectManagerId !== "empty") {
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
              }
              this.projectManager.isSelectedAsProjectManager = true;
            }

            /**
             * team leader
             */
            if (supervisor === "teamLeader") {
              const teamLeaderId = this.teamLeaderId;
              const teamLeader = this.teamLeaders.find(
                (tl) => tl.id === teamLeaderId
              );
              this.teamLeader = teamLeader;

              if (teamLeaderId !== "empty") {
                this.teamMembers.forEach(
                  (m) => (m.isSelectedAsTeamLeader = false)
                );

                if (this.teamMembers.find((m) => m.id === teamLeaderId)) {
                  this.teamMembers.find(
                    (m) => m.id === teamLeaderId
                  ).isSelectedAsTeamLeader = true;
                } else {
                  teamLeader.isSelectedAsTeamLeader = true;
                  this.teamMembers.push(teamLeader);
                }
              }
              this.teamLeader.isSelectedAsTeamLeader = true;
            }
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    },

    openModal() {
      let validation = false;

      if (this.project.name !== this.projectName) {
        validation = true;
      }

      if (this.project.startDate !== this.startDate) {
        validation = true;
      }

      if (this.project.endDate !== this.endDate) {
        validation = true;
      }

      if (this.project.projectManager.id !== this.projectManagerId) {
        validation = true;
      }

      const baseProjectMembers = this.project.team.members;
      baseProjectMembers.sort((a, b) => a.name.localeCompare(b.name));
      this.teamMembers.sort((a, b) => a.name.localeCompare(b.name));

      if (!isEqual(baseProjectMembers, this.teamMembers)) {
        validation = true;
      }

      if (validation) {
        this.validation = true;
        $("#editProjectModal").modal("show");
      } else {
        this.validation = false;
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
      update(ref(database, "projects/" + this.selectedProjectId), {
        name: this.projectName,
        startDate: this.startDate,
        endDate: this.endDate,
        projectManager: this.projectManager,
        teamLeader: this.teamLeader,
        team: {
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
