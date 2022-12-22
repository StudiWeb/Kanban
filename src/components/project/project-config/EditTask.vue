<template>
    <div class="col-xl-6 px-0">
        <div class="h5 my-3">Edit task</div>
        <div class="form-group">
            <label>Select task</label>
            <select v-model="selectedTaskId" class="form-control">
                <option value="empty">none</option>
                <option v-for="task in tasks" :key="task.id" :value="task.id">{{task.name}}</option>
            </select>
        </div>
        <div v-if="canShowEditTaskPanel">
            <div class="form-group">
                <label>Task name</label>
                <input v-model="taskName" ref="taskName" id="taskName" type="text" class="form-control">
            </div>
            <div class="form-group">
                <label>Task description</label>
                <textarea v-model="taskDescription" id="taskDescription" class="form-control"></textarea>
            </div>
            <div class="form-group">
                <label>Start task date</label>
                <input v-model="startDate" class="form-control" type="date" :min="taskStartDate" :max="endDate">
            </div>
            <div class="form-group">
                <label>End task date</label>
                <input v-model="endDate" class="form-control" type="date" :min="startDate" :max="taskEndDate">
            </div>
            <div class="form-group">
                <label>Choose employee</label>
                <select v-model="selectedEmployeeIds" @change="selectEmployees" multiple id="selectedEmployeeIds" class="form-control">
                    <option v-for="m in projectMembers" :key="m.id" :value="m.id">{{m.name}} - {{m.job}}</option>
                </select>
                <small class="form-text text-muted">You can select more than one employee</small>
            </div>
            <button @click="openModal" class="btn btn-warning">Edit task</button>
        </div>
    </div>

    <teleport to="body">
        <base-modal>
            <template #header>Edit task</template>
            <template #body>
                <div class="row">
                    <div class="col-4 d-flex flex-column"><span class="font-weight-bold">Task name</span>{{taskName}}</div>
                    <div class="col-8 d-flex flex-column">
                        <span class="font-weight-bold">{{(selectedEmployeeIds.length === 1 ) ? 'Employee' : 'Employees'}} </span>
                        <p class="mb-1" v-for="e in selectedEmployees" :key="e.id">{{e.name}} - {{e.job}}</p>
                    </div>
                </div>
                <div class="row my-2">
                    <div class="col-4 d-flex flex-column"><span class="font-weight-bold">Start date</span>{{startDate}}</div>
                    <div class="col-8 d-flex flex-column"><span class="font-weight-bold">End date</span>{{endDate}}</div>
                </div>                
                <div class="row">
                    <div class="col-12 d-flex flex-column text-break">
                        <span class="font-weight-bold">Task description</span>
                        <p>{{taskDescription}}</p> 
                    </div>
                </div>
            </template>
            <template #footer>
                <div class="d-flex justify-content-between align-items-baseline">
                    <p>Are you sure you want to edit this task?</p>
                    <div>
                        <button @click="editTask" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeModal('#modal')" class="btn btn-primary">No</button>
                    </div>
                </div>
            </template>
        </base-modal> 
    </teleport>

    <teleport to="body">
        <base-modal id="incorrectEditData">
            <template #header>Edit data</template>
            <template #body>You must provide any change in selected task.</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeModal('#incorrectEditData')" class="btn btn-primary">Ok</button>
                </div>  
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-toast>
            <template #header>Server response</template>
            <template #body>You have just edited the task.</template>
        </base-toast>
    </teleport>

</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";

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
            tasks: [],
            selectedTaskId: 'empty',
            taskName: '',
            taskDescription: '',
            startDate: '',
            endDate: '',
            projectMembers: [],
            selectedEmployeeIds: [],
            selectedEmployees: [],
            taskMembers: [],
            canShowEditTaskPanel: false,
            selectedProject: null,
            taskStartDate: '',
            taskEndDate: '',
        }
    },

    watch: {
        selectedTaskId(newId) {
            if(newId !== 'empty') {
                const task = this.tasks.find((t) => t.id === newId);
                this.taskName = task.name;
                this.taskDescription = task.description;
                this.startDate = task.startDate;
                this.endDate = task.endDate;
                this.taskMembers = task.employees;
                task.employees.forEach((t) => this.selectedEmployeeIds.push(t.id));
                this.projectMembers.forEach((member) => {
                    this.selectedEmployeeIds.forEach((id) => {
                        if(id === member.id) {
                            this.selectedEmployees.push(member);
                        }
                    });
                });
                this.canShowEditTaskPanel = true;
                
            } else {
                this.canShowEditTaskPanel = false;
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
            
            for (const id in data) {
                if(this.selectedProjectId !== 'empty' && this.selectedProjectId === id) {
                    
                    if(id === this.selectedProjectId) {
                        this.selectedProject = data[id];
                        this.taskStartDate = this.selectedProject.startDate;
                        this.taskEndDate = this.selectedProject.endDate;
                    }

                    for(const membersId in  data[id].team.members) {
                        this.projectMembers.push(data[id].team.members[membersId]);
                    } 
                    
                    for(const t in data[id].tasks) {
                        this.tasks.push({
                            id: t,
                            name : data[id].tasks[t].name,
                            description: data[id].tasks[t].description,
                            startDate: data[id].tasks[t].startDate,
                            endDate: data[id].tasks[t].endDate,
                            employees: data[id].tasks[t].employees,
                            status:  data[id].tasks[t].status
                        });
                    } 
                }
            }
        }); 
        
    },

    methods: {

        openModal() {
            const task = this.tasks.find((t) => t.id === this.selectedTaskId);

            const name = task.name;
            const description = task.description;
            const startDate = task.startDate;
            const endDate = task.endDate;
            let employees = [];
            task.employees.forEach((e) => employees.push(e));

            let validation = false;

            if(name !== this.taskName) {
                validation = true;
            }

            if(description !== this.taskDescription) {
                validation = true;
            }
            
            if(startDate !== this.startDate) {
                validation = true;
            }

            if(endDate !== this.endDate) {
                validation = true;
            }

            if(employees.length !== this.selectedEmployees.length) {
                validation = true;
            } else {
                this.selectedEmployees.forEach((se) => {
                    if(!employees.find((e) => e.id === se.id)) {
                        validation = true;
                    }
                });
            }

            if(validation) {
                $('#modal').modal('show');
            } else {
                $('#incorrectEditData').modal('show');
            }
            
        },

        closeModal(modal) {
            $(modal).modal('hide');
        },

        selectEmployees() {
            this.selectedEmployees = [];
            this.selectedEmployeeIds.forEach((id) => {
                this.selectedEmployees.push(this.projectMembers.find((member) => member.id === id));
            });
        },

        editTask() {
            set(ref(database, 'projects/' + this.selectedProjectId + '/tasks/' + this.selectedTaskId), {
                name: this.taskName,
                description: this.taskDescription,
                startDate: this.startDate,
                endDate: this.endDate,
                employees: this.selectedEmployees,
                status: 'todo'
            });

            $('#modal').modal('hide');
            $('#toast').toast('show');
        }

    }
}

</script>