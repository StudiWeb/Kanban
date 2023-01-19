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
    <table v-else class="table table-striped col-xl-4">
      <thead>
        <tr>
          <th scope="col" class="col-1">#</th>
          <th scope="col" class="col-7">Team name</th>
          <th scope="col" class="col-4 text-center">See details</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(team, index) in teams"
          :key="index"
          style="line-height: 32px"
        >
          <td>
            {{ ++index }}
          </td>
          <td>{{ team.name }}</td>
          <td class="text-center">
            <button
              type="button"
              class="btn btn-secondary"
              @click="seeTeamMembers(team)"
            >
              <i class="bi bi-eye"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <teleport to="body">
    <div class="modal fade" id="teamModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ teamName }}</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <table class="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Name</th>
                  <th scope="col">Job</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(member, index) in teamMembers">
                  <td>{{ ++index }}</td>
                  <td>{{ member.name }}</td>
                  <td>{{ member.job }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              @click="closeTeamModal"
              class="btn btn-primary"
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
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
      teamName: "",
      teamMembers: [],
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
      $('[data-toggle="popover"]').popover();
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

    seeTeamMembers(team) {
      this.teamName = team.name;
      this.teamMembers = team.members;
      $("#teamModal").modal("show");
    },

    closeTeamModal() {
      $("#teamModal").modal("hide");
    },
  },
};
</script>
