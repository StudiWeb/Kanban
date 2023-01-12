<template>
  <section class="row mx-0 d-flex flex-column">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">List of teams</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>

    <div
      v-if="numberOfTeams === 0 && isLoading === false"
      class="d-flex align-items-center alert alert-info col-xl-6"
      role="alert"
    >
      <i class="bi bi-exclamation-octagon" style="font-size: 24px"></i>
      <div class="ml-2">There are no any teams.</div>
    </div>
    <table v-else class="table table-striped col-xl-6">
      <thead>
        <tr>
          <th scope="col">#</th>
          <th scope="col">Team name</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in teams"
          @mouseover="showTooltip(team.id)"
          class="team"
          rel="tooltip"
          data-toggle="tooltip"
          data-html="true"
          data-placement="bottom"
          :title="tooltip"
        >
          <td>{{ ++index }}</td>
          <td>{{ team.name }}</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { initializeApp } from "firebase/app";
import { getDatabase, get, child, ref } from "firebase/database";

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
  data() {
    return {
      teams: [],
      tooltip: "",
      isLoading: false,
    };
  },

  computed: {
    numberOfTeams() {
      if (this.teams) {
        return this.teams.length;
      }
    },
  },

  mounted() {
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
      $("body").tooltip({
        selector: '[rel="tooltip"]',
      });
    });

    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;

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
      this.isLoading = false;
    },

    showTooltip(teamId) {
      if (this.teams.length > 0) {
        this.tooltip = '<div class="font-weight-bold">Team members</div>';
        const members = this.teams.find((team) => team.id === teamId).members;
        members.forEach((m) => {
          this.tooltip +=
            '<div class="my-2">' +
            m.name +
            " - " +
            "<span>" +
            m.job +
            "</span>" +
            "</div>";
        });
      }
    },
  },
};
</script>

<style scoped>
.team:hover {
  cursor: pointer;
}
</style>
