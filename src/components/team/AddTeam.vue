<template>
  <section>
    <create-team
      @open-modal="openModal"
      @change-key="changeKey"
      :key="componentKey"
      :componentName="componentName"
    >
      <template #header>
        <span class="h5 d-block my-4">Add team</span>
      </template>
    </create-team>
  </section>

  <teleport to="body">
    <base-modal id="addTeamModal">
      <template #header>Create team</template>
      <template #body>
        <div>
          <p>
            <span class="font-weight-bold">Team name: </span> {{ teamName }}
          </p>
          <p><span class="font-weight-bold">Team members</span></p>
          <table class="table table-striped">
            <thead>
              <th>Name</th>
              <th>Job position</th>
            </thead>
            <tbody>
              <tr v-for="m in teamMembers">
                <td>{{ m.name }}</td>
                <td>{{ m.job }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
      <template #footer>
        <div class="d-flex justify-content-between">
          Are you sure you want to create this team?
          <div>
            <button @click="addTeam" class="btn btn-success mr-2">Yes</button>
            <button @click="closeAddTeamModal" class="btn btn-primary">
              No
            </button>
          </div>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="validationAddTeamModal">
      <template #header>Add team</template>
      <template #body>{{ validationAddTeamModalMesseage }}</template>
      <template #footer>
        <div class="d-flex justify-content-end">
          <button @click="closeValidationAddTeamModal" class="btn btn-primary">
            Ok
          </button>
        </div>
      </template>
    </base-modal>
  </teleport>

  <teleport to="body">
    <base-modal id="serverResponseModal">
      <template #header>Server response</template>
      <template #body>You have just added a new team!</template>
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
import { getDatabase, update, push, get, child, ref } from "firebase/database";

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

import CreateTeam from "../view-components/team/CreateTeam.vue";

export default {
  components: {
    CreateTeam,
  },

  emits: ["changeKey"],

  data() {
    return {
      componentName: "AddTeam",
      teamName: "",
      teamMembers: [],
      employees: [],
      componentKey: 0,
      teamNames: [],
      validationAddTeamModalMesseage: "",
    };
  },

  mounted() {
    //gets all employees
    get(child(ref(database), "employees"))
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

          this.numberOfEmployees = this.employees.length;
        } else {
          console.log("No employees data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });

    //gets all team names that are already in use
    get(child(ref(database), "teams"))
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (const id in snapshot.val()) {
            this.teamNames.push(snapshot.val()[id].name);
          }
        } else {
          console.log("No teams data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  },

  methods: {
    openModal(name, members) {
      if (name === "") {
        this.validationAddTeamModalMesseage = "Your teams needs a name.";
        $("#validationAddTeamModal").modal("show");
      } else if (name === "") {
        this.validationAddTeamModalMesseage = "Please enter a team name.";
        $("#validationAddTeamModal").modal("show");
      } else if (this.teamNames.find((teamName) => teamName === name)) {
        this.validationAddTeamModalMesseage =
          "This team name is already used. Please type different team name.";
        $("#validationAddTeamModal").modal("show");
      } else {
        this.teamName = name;
        this.teamMembers = members;
        this.teamMembers.forEach((m) => {
          delete m.isSelected;
        });
        $("#addTeamModal").modal("show");
      }
    },

    closeAddTeamModal() {
      $("#addTeamModal").modal("hide");
    },

    closeValidationAddTeamModal() {
      $("#validationAddTeamModal").modal("hide");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.componentKey += 1;
    },

    changeKey() {
      this.componentKey += 1;
    },

    addTeam() {
      push(ref(database, "teams/"), {
        name: this.teamName,
        members: this.teamMembers,
      })
        .then(() => {
          // Data saved successfully!
        })
        .catch((error) => {
          // The write failed...
          console.log(error);
        });

      $("#addTeamModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
