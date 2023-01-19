<template>
  <section>
    <create-team
      :key="keyComponent"
      @open-modal="openModal"
      @change-key="changeKey"
    >
    </create-team>
  </section>

  <teleport to="body">
    <base-modal id="editTeamModal">
      <template #header>Edit team</template>
      <template #body>
        <div>
          <div class="d-flex mb-4">
            <div class="col-6 px-0">
              <div class="font-weight-bold">Team name</div>
              <div>{{ teamName }}</div>
            </div>
          </div>
          <table class="table table-striped">
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
        <div class="d-flex justify-content-between">
          Are you sure you want to edit this team?
          <div>
            <button @click="editTeam" class="btn btn-success mr-2">Yes</button>
            <button @click="closeEditTeamModal" class="btn btn-primary">
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
      <template #body>You have just edited a team!</template>
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
import { getDatabase, update, ref, get, child } from "firebase/database";

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

import CreateTeam from "./components/edit-team/CreateTeam.vue";

export default {
  components: {
    CreateTeam,
  },

  emits: ["changeKey"],

  data() {
    return {
      keyComponent: 0,
      teamName: "",
      teamMembers: [],
      teamId: "",
      validationEditTeamModalMesseage: "",
      teams: [],
      employees: [],
    };
  },

  computed: {},

  methods: {
    openModal(name, members, teamId) {
      this.teamName = name;
      this.teamMembers = members;
      this.teamId = teamId;
      $("#editTeamModal").modal("show");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
    },

    closeEditTeamModal() {
      $("#editTeamModal").modal("hide");
    },

    changeKey() {
      this.keyComponent += 1;
    },

    editTeam() {
      update(ref(database, "teams/" + this.teamId), {
        name: this.teamName,
        members: this.teamMembers,
      });
      $("#editTeamModal").modal("hide");
      $("#serverResponseModal").modal("show");
    },
  },
};
</script>
