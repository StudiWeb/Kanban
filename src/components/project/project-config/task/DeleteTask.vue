<template>

      <div class="row mx-0">
    <div class="col-xl-6 px-0">
      <div class="d-flex align-items-center">
        <div class="h5 my-4 mr-2">Delete task</div>
        <div v-if="isLoading" class="spinner-border text-primary" role="status">
          <span class="sr-only">Loading...</span>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isLoading === false" class="row mx-0">
    <div class="col-xl-6 px-0">
        <div class="form-group">
            <label>Select task</label>
            <select v-model="selectedTaskId" class="form-control">
                <option value="empty">none</option>
                <option v-for="t in tasks" :key="t.id" :value="t.id">{{t.name}}</option>
            </select>
        </div>
        <div v-if="isTaskSelected" class="card">
            <div class="card-body">
                <h5 class="card-title">Project - {{projectName}}</h5>
                <h6 class="card-subtitle text-muted">Task - {{taskName}}</h6>
                <div class="card-text mt-2">
                    <span class="font-weight-bold text-break">Description</span>
                    <div>{{taskDescription}}</div>
                </div>
                <div class="card-text my-2">
                    <div class="font-weight-bold"> 
                        {{(numberOfEmployeesAssignedToTask > 1) ? 'Employees' : 'Employee'}}
                    </div>
                    <div v-for="e in employeesAssignedToTask">
                        {{e.name}} - <span class="font-italic">{{e.job}}</span>
                    </div> 
                </div>
                <div class="d-flex">
                    <p class="card-text">
                        <span class="font-weight-bold">Start date</span>
                        <div>{{taskStartDate}}</div>
                    </p>
                    <p class="card-text mx-4">
                        <span class="font-weight-bold">End date</span>
                        <div>{{taskEndDate}}</div>
                    </p>
                    <p class="card-text">
                        <span class="font-weight-bold">Status</span>
                        <div>{{taskStatus}}</div>
                    </p>
                </div>
                <button @click="openModal" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>
  </div>


    <teleport to="body">
        <base-modal id="deleteTaskModal">
            <template #header>Delete task</template>
            <template #body>
                <div>
                    <div class="font-weight-bold">Project name</div>
                    <div>{{projectName}}</div>
                </div>
                <div class="row my-3">
                    <div class="col-4">
                        <div class="font-weight-bold">Task name</div>
                        <div>{{taskName}}</div>
                    </div>
                    <div>
                        <div class="font-weight-bold"> 
                            {{(numberOfEmployeesAssignedToTask > 1) ? 'Employees' : 'Employee'}}
                        </div>
                        <div v-for="e in employeesAssignedToTask" :key="e.id">
                            {{e.name}} - <span class="font-italic">{{e.job}}</span>
                        </div> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="font-weight-bold">Start date</div>
                        <div>{{taskStartDate}}</div>
                    </div>
                    <div>
                        <div class="font-weight-bold">End date</div>
                        <div>{{taskEndDate}}</div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="font-weight-bold">Task description</div>
                    <div class="text-break">{{taskDescription}}</div>
                </div>
            </template>
            <template #footer>
                <div class="d-flex justify-content-between align-items-baseline">
                    <div>Are you sure you want to delete this task?</div>
                    <div>
                        <button @click="deleteTask" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeDeleteTaskModal" class="btn btn-primary">No</button>
                    </div>
                </div>
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-modal id="serverResponseModal">
            <template #header>Server response</template>
            <template #body>You have just deleted a task successfully!.</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeServerResponseModal" class="btn btn-primary">Ok</button>
                </div>
            </template>
        </base-modal>
    </teleport>

</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase , set , ref, get, child } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBiWEX-ygigO9Kj04kWtjASKLJ3RX20uuM",
    authDomain: "vue-kanban-5ad84.firebaseapp.com",
    databaseURL: "https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vue-kanban-5ad84",
    storageBucket: "vue-kanban-5ad84.appspot.com",
    messagingSenderId: "538900623860",
    appId: "1:538900623860:web:330924a5a67488f22109a1"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export default {

    emits: ['change-key'],

    props: ['selectedProjectId'],

    data() {
        return {
            selectedTaskId: 'empty',
            selectedProject: null,
            isTaskSelected: false,
            isLoading: false
        }
    },

    watch: {
        selectedTaskId(newValue) {
            if(newValue !== 'empty') {
                this.isTaskSelected = true;
            } else {
                this.isTaskSelected = false;
            }
        },
    },

    computed: {
        tasks() {
            if(this.selectedProject) {
                let tasks = [];
                for(const id in this.selectedProject.tasks) {
                    tasks.push({
                        id: id,
                        name: this.selectedProject.tasks[id].name,
                        description: this.selectedProject.tasks[id].description,
                        startDate: this.selectedProject.tasks[id].startDate,
                        endDate: this.selectedProject.tasks[id].endDate,
                        employees: this.selectedProject.tasks[id].employees,
                        status: this.selectedProject.tasks[id].status
                    })
                }
                return tasks;
            } else {
                return  [];
            }
        },
        projectName() {
            if(this.selectedProject !== null) {
                return this.selectedProject.name;
            }
        },

        taskName() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).name;
            }
        },

        taskDescription() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).description;
            }
        },

        taskStartDate() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).startDate;
            }
        },

        taskEndDate() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).endDate;
            }
        },

        employeesAssignedToTask() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).employees;
            }
        },

        numberOfEmployeesAssignedToTask() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).employees.length;
            }
        },

        taskStatus() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).status;
            }
        },
    },

    mounted() {
        this.loadData();
    },

    methods: {

            async loadData() {
      this.isLoading = true;
      //gets all projects
      await get(child(ref(database), "projects/" + this.selectedProjectId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            this.selectedProject = {
              id: this.selectedProjectId,
              name: snapshot.val().name,
              startDate: snapshot.val().startDate,
              endDate: snapshot.val().endDate,
              team: snapshot.val().team,
              projectManager: snapshot.val().projectManager,
              teamLeader: snapshot.val().teamLeader,
              tasks: snapshot.val().tasks,
            };
          } else {
            console.log("No data available");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      this.isLoading = false;
    },
        openModal() {
            $('#deleteTaskModal').modal('show');
        },

        closeDeleteTaskModal() {
            $('#deleteTaskModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

        deleteTask() {
            set(ref(database, 'projects/' + this.selectedProjectId + '/tasks/' + this.selectedTaskId),null);
            this.selectedProject = null;
            this.selectedTaskId = 'empty';
            $('#deleteTaskModal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    }
}

</script>