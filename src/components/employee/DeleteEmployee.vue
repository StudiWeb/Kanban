<template>
    
<section>
    <div class="row flex-column mx-0">
        <div class="col-xl-6 px-0">
            <div class="h5 my-4 px-0">Delete employee</div>
        </div>
        <div class="card px-0 col-xl-6">
            <div class="card-body">
                <div>
                    <div class="px-0 form-group">
                        <label>Select employee</label>
                        <select v-model="selectedEmployeeId" class="form-control">
                            <option value="empty">none</option>
                            <option v-for="e in employees" :value="e.id" :key="e.id">{{e.name}}</option>
                        </select>
                    </div>
                    <div v-if="selectedEmployeeId !== 'empty'">
                        <div v-if="canShowAlert" class="alert alert-info d-flex align-items-center" role="alert">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
                            </svg>
                            <div class="ml-2">
                                {{alertMesseage}}
                            </div>
                        </div>
                        <div class="card my-4">
                            <div class="card-header">Employee details</div>
                            <div class="card-body">
                                <p class="card-text"><span class="font-weight-bold">Name: </span>{{getEmployeeName}}</p>
                                <p class="card-text"><span class="font-weight-bold">Job position: </span>{{getEmployeeJob}}</p>
                                <p class="card-text"><span class="font-weight-bold">Project manager: </span> {{isEmployeeProjectManager ? 'Yes' : 'No'}}</p>
                                <p class="card-text"><span class="font-weight-bold">Team leader</span> {{isEmployeeTeamLeader ? 'Yes' : 'No'}}</p>
                            </div>
                        </div>
                    </div>
                    <button @click="openModal" ref="deleteEmployeeButton" type="submit" class="btn btn-danger">Delete employee</button>
                </div>
            </div>
        </div>
    </div>
</section>

<teleport to="body">
    <base-modal>
        <template #header>Delete employee</template>
        <template #body>
            <div v-if="selectedEmployeeId !== 'empty'">
                <p><span class="font-weight-bold">Name:</span>  {{getEmployeeName}}</p>
                <p><span class="font-weight-bold">Job position:</span>  {{getEmployeeJob}}</p>
                <p><span class="font-weight-bold">Project manager:</span> {{isEmployeeProjectManager ? 'Yes' : 'No'}}</p>
                <p><span class="font-weight-bold">Team leader:</span> {{isEmployeeTeamLeader ? 'Yes' : 'No'}}</p>
            </div>
            <div v-else>{{modalMesseage}}</div>
        </template>
        <template #footer>
            <div>
                <div v-if="selectedEmployeeId !== 'empty'" class="d-flex justify-content-between align-items-baseline">   
                    <div>Are you sure do you want to delete this employee?</div>
                    <div>
                        <button @click="deleteEmployee" type="button" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeModal" type="button" class="btn btn-primary">No</button>
                    </div>
                </div>
                <div v-else class="d-flex justify-content-end">
                    <button @click="closeModal" class="btn btn-primary" type="button">Ok</button>
                </div>

            </div>
        </template>
    </base-modal>  
</teleport>


<teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
        <template #header>Server response</template>
        <template #body>You have just deleted an employee successfully!</template>
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

    emits: ['change-key','hide-toast'],

    data() {
        return {
            selectedEmployeeId: 'empty',
            selectedEmployee: null,
            employees: [],
            teams: [],
            projects: [],
            canDeleteEmployee: false,
            canShowAlert: false,
            modalMesseage: 'Please select an employee you want to delete.',
            alertMesseage: '',
        }
    },

    watch: {
        selectedEmployeeId(id) {

            if(id !== 'empty') {
                //initializes fields
                const selectedEmployeeId = id;
                this.selectedEmployee = this.employees.find((e) => e.id === id);
                //checks if an employee is a member of a team
                if(this.employees.find((e) => e.id === selectedEmployeeId && e.isTeamMember === true)) {
                    this.$refs.deleteEmployeeButton.disabled = true;
                    this.canShowAlert = true;
                    this.alertMesseage = 'This employee is a member of a team. You cannot delete him.';
                } else {
                    this.$refs.deleteEmployeeButton.disabled = false;
                    this.canShowAlert = false;
                    this.alertMesseage = '';
                }
            } 
            //no employee is choosen
            //all fields are disabled
            else {
                this.$refs.deleteEmployeeButton.disabled = false;
                this.selectedEmployee = null;
                this.canShowAlert = false;  
                this.alertMesseage = '';
                this.modalMesseage = 'Please select employee to edit.';
            }
        }
    },

    computed: {

        getEmployeeName() {
            if(this.selectedEmployee) {
                return this.selectedEmployee.name;
            } else {
                return '';
            }
        },

        getEmployeeJob() {
            if(this.selectedEmployee) {
                return this.selectedEmployee.job;
            } else {
                return '';
            }
        },

        isEmployeeProjectManager() {
            if(this.selectedEmployee) {
                return this.selectedEmployee.isProjectManager;
            } else {
                return false;
            }
        },

        isEmployeeTeamLeader() {
            if(this.selectedEmployee) {
                return this.selectedEmployee.isTeamLeader;
            } else {
                return false;
            }
        },
    }, 

    mounted() {
        //gets all employees
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json',{
        method: 'GET',
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for (const id in data) {
                this.employees.push({
                    id: id,
                    name: data[id].name,
                    job: data[id].job,
                    isProjectManager: data[id].isProjectManager,
                    isTeamLeader: data[id].isTeamLeader,
                    isTeamMember: data[id].isTeamMember
                });
            }
        });
        //gets all teams
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for(const id in data) {
                this.teams.push({
                    id: id,
                    name: data[id].teamName,
                    members: data[id].members
                });
            }
        });

        //gets all projects
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json')
        .then((respone) => {
            if(respone.ok) {
                return respone.json();
            }
        })
        .then((data) => {
            for(const id in data) {
                this.projects.push({
                    id: id,
                    name: data[id].name,
                    startDate: data[id].startDate,
                    endDate: data[id].endDate,
                    team: data[id].team,
                    projectManager: data[id].projectManager
                });
            }
        });
    },

    methods: {

        openModal() {
            $('#modal').modal('show');
        },

        closeModal() {
            $('#modal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

 
        deleteEmployee() {
            set(ref(database, 'employees/' + this.selectedEmployee.id),null)
            $('#modal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    },


}

</script>