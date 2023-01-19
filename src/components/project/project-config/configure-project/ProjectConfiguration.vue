<template>
  <div class="row mx-0">
    <div class="col-xl-6 px-0 mb-4">
      <div class="d-flex align-items-center">
        <div class="h5 mr-2">Project configuration</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading === false" class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="card">
        <div class="card-body">
          <p class="card-text">Do you want to make this project visible?</p>
          <div>
            <div class="form-check form-check-inline">
              <input
                v-model="isProjectVisible"
                class="form-check-input"
                type="radio"
                id="yes"
                value="yes"
              />
              <label class="form-check-label" for="yes">Yes</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                v-model="isProjectVisible"
                class="form-check-input"
                type="radio"
                id="no"
                value="no"
              />
              <label class="form-check-label" for="no">No</label>
            </div>
          </div>
          <button @click="changeIsProjectVisible" class="mt-3 btn btn-primary">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </div>

  <teleport to="body">
    <base-modal id="serverResponseModal">
      <template #header>Server response</template>
      <template #body>{{ serverResponse }}</template>
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
import { getDatabase, get, child, update, ref } from "firebase/database";

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

  props: ["projectId"],

  data() {
    return {
      isProjectVisible: "",
      serverResponse: "",
      isLoading: false,
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      this.isLoading = true;
      await get(child(ref(database), "projects/" + this.projectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            if (snapshot.val().isVisible === true) {
              this.isProjectVisible = "yes";
            }

            if (snapshot.val().isVisible === false) {
              this.isProjectVisible = "no";
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

    openServerResponseModal() {
      $("#serverResponseModal").modal("show");
    },

    closeServerResponseModal() {
      $("#serverResponseModal").modal("hide");
      this.$emit("change-key");
      this.$parent.$parent.$parent.$parent.$emit("change-key");
    },

    changeIsProjectVisible() {
      if (this.isProjectVisible === "yes") {
        update(ref(database, "projects/" + this.projectId), {
          isVisible: true,
        })
          .then(() => {
            // Data saved successfully!
            this.serverResponse =
              "You have just made this project visible. From now on you can find it in the navigation on the left.";
            $("#serverResponseModal").modal("show");
          })
          .catch((error) => {
            // The update failed...
            console.log(error);
          });
      } else {
        update(ref(database, "projects/" + this.projectId), {
          isVisible: false,
        })
          .then(() => {
            // Data saved successfully!
            this.serverResponse =
              "You have just made this project invisible. From now on you cannot find it in the navigation on the left.";
            $("#serverResponseModal").modal("show");
          })
          .catch((error) => {
            // The update failed...
            console.log(error);
          });
      }
    },
  },
};
</script>
