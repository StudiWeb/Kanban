<template>
    <section >
        <div class="row flex-column mx-0">
            <div class="col-xl-6 px-0">
                <div class="h5 my-4 px-0">Edit employee</div>
            </div>
            <div class="card col-xl-6 px-0">
                <div class="card-body">
                    <div class="px-0 form-group">
                        <label for="exampleFormControlSelect1">Select employee</label>
                        <select v-model="selectedEmployeeId" class="form-control">
                            <option value="empty" selected>none</option>
                            <option v-for="e in employees" :value="e.id">{{e.name}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input v-model="name" ref="name" disabled type="text" class="form-control" id="name">
                    </div>
                    <div class="form-group">
                        <label for="job-position">Job position</label>
                        <input v-model="job" ref="job" disabled type="text" class="form-control" id="job-position">
                    </div>
                    <div class="form-check">
                        <input v-model="isProjectManager" ref="isProjectManager" disabled class="form-check-input" type="checkbox" value="" id="project-manager">
                        <label class="form-check-label" for="project-manager">Project manager</label>
                    </div>
                    <div class="form-check">
                        <input v-model="isTeamLeader" ref="isTeamLeader" disabled class="form-check-input" type="checkbox" value="" id="team-leader">
                        <label class="form-check-label" for="team-leader">Team leader</label>
                    </div>
                    <div class="form-check px-0 my-2">
                        <button @click="openModal" ref="editEmployeeButton" class="btn btn-warning" type="button">Edit employee</button>
                    </div>
                </div>
            </div>
        </div>
    </section>

<teleport to="body">
    <base-modal id="editEmployeeModal">
        <template #header>Edit employee</template>
            <template #body>
                <div>
                    <p><span class="font-weight-bold">Name: </span>{{name}}</p>
                    <p><span class="font-weight-bold">Job: </span>{{job}}</p>
                    <p><span class="font-weight-bold">Project manager: </span>{{isProjectManager ? 'Yes' : 'No'}}</p>
                    <p><span class="font-weight-bold">Team leader: </span>{{isTeamLeader ? 'Yes' : 'No'}}</p>
                </div>
            </template>
            <template #footer>
                <div class="d-flex justify-content-between align-items-baseline">
                    Are you sure you want to edit this employee?
                    <div>
                        <button @click="editEmployee" class="btn btn-success mr-2">Yes</button>
                        <button @click="closeEditEmployeeModal" class="btn btn-primary">No</button>
                    </div>
                </div>
            </template>
    </base-modal>  
</teleport>

<teleport to="body">
    <base-modal id="validationEmployeeModal">
        <template #header>Edit employee</template>
        <template #body>{{modalValidationMesseage}}</template>
        <template #footer>
            <div class="d-flex justify-content-end">
                <button @click="closeValidationEmployeeModal" class="btn btn-primary">OK</button>
            </div>
        </template>
    </base-modal>
</teleport>

<teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
        <template #header>Server response</template>
        <template #body>You have just edited an employee successfully!</template>
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
import { getDatabase , update ,get, child, ref } from "firebase/database";

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

    data() {
        return {
            name: '',
            job: '',
            isProjectManager: false,
            isTeamLeader: false,
            selectedEmployeeId: 'empty',
            selectedEmployee: null,
            employees: [],
            modalValidationMesseage: '',
            alertMesseage: ''
        }
    },

    watch: {
        selectedEmployeeId(id) {
            if(id !== 'empty') {
                //initializes fields
                this.selectedEmployee = this.employees.find((e) => e.id === id);
                this.name = this.selectedEmployee.name;
                this.job = this.selectedEmployee.job;
                this.isProjectManager = this.selectedEmployee.isProjectManager;
                this.isTeamLeader = this.selectedEmployee.isTeamLeader;
                //sets all fields's disabled option to false
                this.$refs.name.disabled = false;
                this.$refs.job.disabled = false;
                this.$refs.isProjectManager.disabled = false;
                this.$refs.isTeamLeader.disabled = false;
            } 
            //no employee is choosen
            //all fields are disabled
            else {
                this.selectedEmployee = null;
                this.name = '';
                this.job = '';
                this.isProjectManager = false;
                this.isTeamLeader = false;
                this.$refs.name.disabled = true;
                this.$refs.job.disabled = true;
                this.$refs.isProjectManager.disabled = true;
                this.$refs.isTeamLeader.disabled = true;
                $('#noChoosenEmployeeModal').modal('show');
            }
        }
    },

    mounted() {
        //gets all employees
        get(child(ref(database), 'employees')).then((snapshot) => {
            if (snapshot.exists()) {
                for (const id in snapshot.val()) {
                    this.employees.push({
                        id: id,
                        name: snapshot.val()[id].name,
                        job: snapshot.val()[id].job,
                        isProjectManager: snapshot.val()[id].isProjectManager,
                        isTeamLeader: snapshot.val()[id].isTeamLeader,
                    });
                }
            } else {
                console.log("No employees data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, 

    methods: {

        openModal() {
            if(this.selectedEmployeeId !== 'empty') {
                let validation = false;

                if(this.name !== this.selectedEmployee.name) {
                    validation = true;
                }

                if(this.job !== this.selectedEmployee.job) {
                    validation = true;
                }

                if(this.isProjectManager !== this.selectedEmployee.isProjectManager) {
                    validation = true;
                }

                if(this.isTeamLeader !== this.selectedEmployee.isTeamLeader) {
                    validation = true;
                }

                if(validation) {
                    $('#editEmployeeModal').modal('show');        
                } else {
                    this.modalValidationMesseage = 'You must enter any change to edit employee.'
                    $('#validationEmployeeModal').modal('show');  
                }
            } else {
                this.modalValidationMesseage = 'Please select an employee you want to edit.'
                $('#validationEmployeeModal').modal('show');  
            }

            
        },

        closeEditEmployeeModal() {
            $('#editEmployeeModal').modal('hide');
        },

        closeValidationEmployeeModal() {
            $('#validationEmployeeModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

        editEmployee() {
            //updates selected employee in employees
            update(ref(database, 'employees/' + this.selectedEmployeeId), {
                name: this.name.trim(),
                job: this.job.trim(),
                isProjectManager: this.isProjectManager,
                isTeamLeader: this.isTeamLeader
            })
            .then(() => {
                // Data saved successfully!
            })
            .catch((error) => {
                // The write failed...
                console.log(error);
            });

            $('#editEmployeeModal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    },
    
}

</script>