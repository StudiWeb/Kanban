<template>
    <div class="col-xl-6 px-0">
        <div class="h5 my-3">Delete task</div>
        <div class="form-group">
            <label>Select task</label>
            <select v-model="selectedTaskId" class="form-control">
                <option value="empty">none</option>
                <option v-for="t in tasks" :key="t.id" :value="t.id">{{t.name}}</option>
            </select>
        </div>
        <div v-if="isTaskSelected" class="card">
            <div class="card-body">
                <h5 class="card-title">Project - {{getSelectedProjectName}}</h5>
                <h6 class="card-subtitle text-muted">Task - {{getSelectedTaskName}}</h6>
                <div class="card-text mt-2">
                    <span class="font-weight-bold text-break">Description</span>
                    <div>{{getSelectedTaskDescription}}</div>
                </div>
                <div class="card-text my-2">
                    <div class="font-weight-bold"> 
                        {{(getSelectedEmployeesToDoTaskLength > 1) ? 'Employees' : 'Employee'}}
                    </div>
                    <div v-for="e in getSelectedEmployeesToDoTask">
                        {{e.name}} - <span class="font-italic">{{e.job}}</span>
                    </div> 
                </div>
                <div class="d-flex">
                    <p class="card-text">
                        <span class="font-weight-bold">Start date</span>
                        <div>{{getSelectedTaskStartDate}}</div>
                    </p>
                    <p class="card-text mx-4">
                        <span class="font-weight-bold">End date</span>
                        <div>{{getSelectedTaskEndDate}}</div>
                    </p>
                    <p class="card-text">
                        <span class="font-weight-bold">Status</span>
                        <div>{{getSelectedTaskStatus}}</div>
                    </p>
                </div>
                <button @click="openModal" class="btn btn-danger">Delete</button>
            </div>
        </div>
    </div>

    <teleport to="body">
        <base-modal>
            <template #header>Delete task</template>
            <template #body>
                <div>
                    <div class="font-weight-bold">Project name</div>
                    <div>{{getSelectedProjectName}}</div>
                </div>
                <div class="row my-3">
                    <div class="col-4">
                        <div class="font-weight-bold">Task name</div>
                        <div>{{getSelectedTaskName}}</div>
                    </div>
                    <div>
                        <div class="font-weight-bold"> 
                            {{(getSelectedEmployeesToDoTaskLength > 1) ? 'Employees' : 'Employee'}}
                        </div>
                        <div v-for="e in getSelectedEmployeesToDoTask" :key="e.id">
                            {{e.name}} - <span class="font-italic">{{e.job}}</span>
                        </div> 
                    </div>
                </div>
                <div class="row">
                    <div class="col-4">
                        <div class="font-weight-bold">Start date</div>
                        <div>{{getSelectedTaskStartDate}}</div>
                    </div>
                    <div>
                        <div class="font-weight-bold">End date</div>
                        <div>{{getSelectedTaskEndDate}}</div>
                    </div>
                </div>
                <div class="mt-2">
                    <div class="font-weight-bold">Task description</div>
                    <div class="text-break">{{getSelectedTaskDescription}}</div>
                </div>
            </template>
            <template #footer>
                <div class="d-flex justify-content-between align-items-baseline">
                    <div>Are you sure you want to delete this task?</div>
                    <div>
                        <button @click="deleteTask" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeModal" class="btn btn-primary">No</button>
                    </div>
                </div>
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-toast>
            <template #header>Server response</template>
            <template #body>You have just deleted a task.</template>
        </base-toast>
    </teleport>

</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase , set , ref } from "firebase/database";

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

    props: ['selectedProjectId'],

    data() {
        return {
            selectedTaskId: 'empty',
            tasks: [],
            selectedProject: null,
            isTaskSelected: false,
        }
    },

    watch: {
        selectedTaskId(newValue) {
            if(newValue !== 'empty') {
                this.isTaskSelected = true;
            } else {
                this.isTaskSelected = false;
            }
        }
    },

    computed: {
        getSelectedProjectName() {
            if(this.selectedProject !== null) {
                return this.selectedProject.name;
            }
        },

        getSelectedTaskName() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).name;
            }
        },

        getSelectedTaskDescription() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).description;
            }
        },

        getSelectedTaskStartDate() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).startDate;
            }
        },

        getSelectedTaskEndDate() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).endDate;
            }
        },

        getSelectedEmployeesToDoTask() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).employees;
            }
        },

        getSelectedEmployeesToDoTaskLength() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).employees.length;
            }
        },

        getSelectedTaskStatus() {
            if(this.selectedTaskId !== 'empty') {
                return this.tasks.find((task) => task.id === this.selectedTaskId).status;
            }
        }
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for(const d in data) {
                if(d === this.selectedProjectId) {
                    this.selectedProject = data[d];
                    for(const t in data[d].tasks) {
                        this.tasks.push({
                            id: t,
                            name: data[d].tasks[t].name,
                            description: data[d].tasks[t].description,
                            startDate: data[d].tasks[t].startDate,
                            endDate: data[d].tasks[t].endDate,
                            employees: data[d].tasks[t].employees,
                            status: data[d].tasks[t].status
                        });
                    }
                } 
            }
        })
    },

    methods: {
        openModal() {
            $('#modal').modal('show');
        },

        closeModal() {
            $('#modal').modal('hide');
        },

        deleteTask() {
            set(ref(database, 'projects/' + this.selectedProjectId + '/tasks/' + this.selectedTaskId),null);
            this.selectedProject = null;
            this.selectedTaskId = 'empty';
            $('#modal').modal('hide');
            $('#toast').toast('show');
        }
    }
}

</script>