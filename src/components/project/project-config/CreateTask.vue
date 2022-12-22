<template>
    <div class="col-xl-6 px-0">
        <div class="h5 my-3">Create task</div>
        <div class="form-group">
            <label>Task name</label>
            <input v-model="taskName" id="taskName" type="text" class="form-control">
        </div>
        <div class="form-group">
            <label>Task description</label>
            <textarea v-model="taskDescription" id="taskDescription" class="form-control"></textarea>
        </div>
        <div class="form-group">
            <label>Start task date</label>
            <input v-model="startDate" id="startDate" type="date" :min="getStartDate" :max="getEndDate" class="form-control">
        </div>
        <div class="form-group">
            <label>End task date</label>
            <input v-model="endDate" id="endDate" ref="endDate" disabled type="date" :min="startDate" :max="getEndDate" class="form-control">
        </div>
        <div class="form-group">
            <label>Choose employee</label>
            <select v-model="selectedEmployeeIds" @change="selectEmployees" multiple id="selectedEmployeeIds" class="form-control">
                <option ref="empty" value="empty">none</option>
                <option v-for="m in teamMembers" :key="m.id" :value="m.id">{{m.name}} - {{m.job}}</option>
            </select>
            <small class="form-text text-muted">You can select more than one employee</small>
        </div>
        <button @click="openModal" class="btn btn-success">Create task</button>
    </div>

    <teleport to="body">
        <base-modal id="createTaskModal">
            <template #header>Create task</template>
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
                    <p>Are you sure you want to add this task?</p>
                    <div>
                        <button @click="createTask" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeCreateTaskModal" class="btn btn-primary">No</button>
                    </div>
                </div>
            </template>
        </base-modal> 
    </teleport>

    <teleport>
        <base-modal id="validationModal">
            <template #header>Validation info</template>
            <template #body>{{validationMesseage}}</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeValidationModal" class="btn btn-primary">Ok</button>
                </div>
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-modal id="serverResponseModal">
            <template #header>Server response</template>
            <template #body>You have just added a new task successfully!.</template>
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
import { getDatabase,push, ref } from "firebase/database";

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
            selectedTeamId: '',
            taskName: '',
            taskDescription: '',
            startDate: '',
            endDate: '',
            selectedEmployeeIds: [],
            selectedEmployees: [],
            selectedProjectStartDate: null,
            selectedProjectEndDate: null,
            teamMembers: [],
            validationMesseage: ''
        }
    },

    watch: {

        taskName(newValue) {
            if(newValue !== '') {
                $('#taskName').removeClass('is-invalid');
                $('#taskName').addClass('is-valid');
            } else {
                $('#taskName').removeClass('is-valid');
            }
        },

        taskDescription(newValue) {
            if(newValue !== '') {
                $('#taskDescription').removeClass('is-invalid');
                $('#taskDescription').addClass('is-valid');
            } else {
                $('#taskDescription').removeClass('is-valid');
            }
        },

        startDate(newValue) {
            if(newValue !== '') {
                this.$refs.endDate.disabled = false;
                $('#startDate').removeClass('is-invalid');
                $('#startDate').addClass('is-valid');
            } else {
                $('#startDate').removeClass('is-valid');
                this.endDate = '';
                this.$refs.endDate.disabled = true;
            }
        },

        endDate(newValue) {
            if(newValue !== '') {
                $('#endDate').removeClass('is-invalid');
                $('#endDate').addClass('is-valid');
            } else {
                $('#endDate').removeClass('is-valid');
            }
        },

        selectedEmployeeIds(newValue) {
            if(newValue.length > 0) {
                if(newValue.length === 1) {
                   if(newValue.find((value) => value !== 'empty')) {
                        $('#selectedEmployeeIds').removeClass('is-invalid');
                        $('#selectedEmployeeIds').addClass('is-valid');
                   }
                }
            } else {
                $('#selectedEmployeeIds').removeClass('is-invalid');
                $('#selectedEmployeeIds').removeClass('is-valid');
            }
        }       


    }, 

    computed: {

        getStartDate() {
            if(this.selectedProjectStartDate !== null) {
               return this.selectedProjectStartDate;
            }
        },

        getEndDate() {
            if(this.selectedProjectEndDate !== null) {
               return this.selectedProjectEndDate;
            }
        },

     },

    mounted() {

        let members = [];

        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for(const id in data) {
                if(id === this.selectedProjectId) {
                    this.selectedProjectStartDate = data[id].startDate.trim();
                    this.selectedProjectEndDate = data[id].endDate.trim();
                    members = data[id].team.members;
                    for(const id in members) {
                        this.teamMembers.push({
                            id: members[id].id,
                            name: members[id].name,
                            job: members[id].job,
                            isSelectedAsProjectManager: members[id].isSelectedAsProjectManager,
                            isSelectedAsTeamLeader: members[id].isSelectedAsTeamLeader
                        });
                    }
                }             
            }
        });
       
    },

    methods: {

        openModal() {

            let validation = true;

            if(this.taskName === '') {
                $('#taskName').removeClass('is-valid');
                $('#taskName').addClass('is-invalid');
                validation = false;
            } else {
                $('#taskName').removeClass('is-invalid');
                $('#taskName').addClass('is-valid');
            }

            if(this.taskDescription === '') {
                $('#taskDescription').removeClass('is-valid');
                $('#taskDescription').addClass('is-invalid');
                validation = false;
            } else {
                $('#taskDescription').removeClass('is-invalid');
                $('#taskDescription').addClass('is-valid');
            }

            if(this.startDate === '') {
                $('#startDate').removeClass('is-valid');
                $('#startDate').addClass('is-invalid');
                validation = false;
            } else {
                $('#startDate').removeClass('is-in');
                $('#startDate').addClass('is-valid');
            }

            if(this.endDate === '') {
                $('#endDate').removeClass('is-valid');
                $('#endDate').addClass('is-invalid');
                validation = false;
            } else {
                $('#endDate').removeClass('is-invalid');
                $('#endDate').addClass('is-valid');
            }

            if(this.selectedEmployeeIds.length > 0) {
                if(this.selectedEmployeeIds.length === 1) {
                    if(this.selectedEmployeeIds.find((value) => value === 'empty')) {
                        $('#selectedEmployeeIds').removeClass('is-valid');
                        $('#selectedEmployeeIds').addClass('is-invalid');
                        validation = false;
                    } else {
                        $('#selectedEmployeeIds').removeClass('is-invalid');
                        $('#selectedEmployeeIds').addClass('is-valid');
                    }
                } 
            } else {
                $('#selectedEmployeeIds').removeClass('is-valid');
                $('#selectedEmployeeIds').addClass('is-invalid');
                validation = false;
            }

            if(validation) {
                $('#createTaskModal').modal('show');
            } else {
                this.validationMesseage = 'Please fill the form.';
                $('#validationModal').modal('show');
            }

        },

        closeValidationModal() {
            $('#validationModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
        },

        closeCreateTaskModal() {
            $('#createTaskModal').modal('hide');
        },

        selectEmployees() {
            this.selectedEmployees = [];
            if(this.selectedEmployeeIds.length > 0) {
                this.selectedEmployeeIds.forEach((id) => {  
                    if(id !== 'empty') {
                        this.selectedEmployees.push(this.teamMembers.find((member) => member.id === id));
                    }  
                });       
            } else {
                this.selectedEmployees = [];
            }

            if(this.selectedEmployeeIds.length > 1) {
                if(this.selectedEmployeeIds.find((value) => value === 'empty')) {
                    this.$refs.empty.selected = false;
                }
            }
        },

        createTask() {

            push(ref(database, 'projects/' + this.selectedProjectId + '/tasks'), {
                    name: this.taskName,
                    description: this.taskDescription,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    employees: this.selectedEmployees,
                    status: 'todo'
            });

            this.taskName = '';
            this.taskDescription = '';
            this.startDate = '';
            this.endDate = '';
            this.selectedEmployeeIds = [];

            $('#createTaskModal').modal('hide');
            $('#serverResponseModal').modal('show');

        }

    }

}

</script>