<template>
  <div class="card my-2" style="width: 240px">
    <button
      class="card-header d-flex justify-content-between align-items-center"
      @click="showTask"
    >
      <p class="h6">{{ name }}</p>
      <svg
        v-if="showTaskDetails === false"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-caret-down-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
        />
      </svg>
      <svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-caret-up-fill"
        viewBox="0 0 16 16"
      >
        <path
          d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
        />
      </svg>
    </button>
    <div v-if="showTaskDetails" class="card-body d-flex flex-column">
      <div class="my-1">
        <span class="font-weight-bold">
          {{ employees.length > 1 ? "Employees: " : "Employee" }}
        </span>
        <div v-for="e in employees" :key="e.id">{{ e.name }}</div>
      </div>
      <div
        class="d-flex justify-content-between align-items-baseline flex-wrap"
      >
        <span class="font-weight-bold">Task description</span>
        <button
          @click="showDescription"
          type="button"
          class="btn seeDescription"
        >
          <svg
            v-if="showTaskDescription === false"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-down-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"
            />
          </svg>
          <svg
            v-else
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-caret-up-fill"
            viewBox="0 0 16 16"
          >
            <path
              d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"
            />
          </svg>
        </button>
        <p v-if="showTaskDescription" class="col-12 my-1 description">
          {{ description }}
        </p>
      </div>
      <div class="my-1">
        <span class="font-weight-bold">Start date: </span>{{ startDate }}
      </div>
      <div><span class="font-weight-bold">End date: </span>{{ endDate }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["task", "type"],

  data() {
    return {
      showTaskDetails: false,
      showTaskDescription: false,
    };
  },

  computed: {
    name() {
      if (this.task) {
        return this.task.name;
      }
    },

    startDate() {
      if (this.task) {
        return this.task.startDate;
      }
    },

    endDate() {
      if (this.task) {
        return this.task.endDate;
      }
    },
    description() {
      if (this.task) {
        return this.task.description;
      }
    },
    employees() {
      if (this.task) {
        const assignedEmployees = this.task.employees;
        let employees = [];

        for (const id in this.task.employees) {
          employees.push({
            id: assignedEmployees[id].id,
            name: assignedEmployees[id].name,
            job: assignedEmployees[id].job,
          });
        }
        return employees;
      }
    },
  },

  mounted() {
    if (this.type === "todo") {
      console.log($(".seeDescription"));
      $(".card-body .seeDescription").addClass("todo-btn");
    } else if (this.type === "doing") {
      $(".seeDescription").addClass("doing-btn");
    } else if (this.type === "testing") {
      $(".seeDescription").addClass("testing-btn");
    } else if (this.type === "done") {
      $(".seeDescription").addClass("done-btn");
    }
  },

  methods: {
    showTask() {
      this.showTaskDetails = !this.showTaskDetails;
    },

    showDescription() {
      this.showTaskDescription = !this.showTaskDescription;
    },
  },
};
</script>

<style scoped>
button {
  border: none;
}

.todo-btn {
  background-color: rgba(0, 123, 255);
}
.doing-btn {
  background-color: rgba(220, 53, 69);
}

.testing-btn {
  background-color: rgba(255, 193, 7);
}

.done-btn {
  background-color: rgba(40, 167, 69);
}
</style>
