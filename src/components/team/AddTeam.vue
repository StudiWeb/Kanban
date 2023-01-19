<template>
  <section>
    <create-team @open-modal="openModal"> </create-team>
  </section>

  <teleport to="body">
    <base-modal id="addTeamModal">
      <template #header>Create team</template>
      <template #body>
        <div class="mb-2">
          <div class="font-weight-bold">Team name</div>
          <div>{{ teamName }}</div>
        </div>
        <div>
          <div class="font-weight-bold mb-2">Team members</div>
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

import CreateTeam from "./components/add-team/CreateTeam.vue";

export default {
  components: {
    CreateTeam,
  },

  emits: ["changeKey"],

  data() {
    return {
      teamName: "",
      teamMembers: [],
      componentKey: 0,
      validationAddTeamModalMesseage: "",
    };
  },

  computed: {},

  methods: {
    openModal(name, teamNames, members) {
      if (name === "") {
        this.validationAddTeamModalMesseage = "Your teams needs a name.";
        $("#validationAddTeamModal").modal("show");
      } else if (teamNames.find((teamName) => teamName === name)) {
        this.validationAddTeamModalMesseage =
          "This name is already used. Please type different team name.";
        $("#validationAddTeamModal").modal("show");
      } else if (members.length === 0) {
        this.validationAddTeamModalMesseage =
          "Your team needs at least one employee.";
        $("#validationAddTeamModal").modal("show");
      } else {
        this.teamName = name;
        this.teamMembers = members;
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
      this.$emit("change-key");
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
