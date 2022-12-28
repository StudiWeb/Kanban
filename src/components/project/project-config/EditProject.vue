<template>

<div class="col-xl-6 px-0">
    <div class="form-group">
        <label>Project name</label>
        <input v-model="name" type="text" class="form-control">
    </div>
    <div class="form-group">
        <label>Start date</label>
        <input v-model="startDate" type="date" class="form-control">
    </div>
    <div class="form-group">
        <label>End date</label>
        <input v-model="endDate" type="date" class="form-control">
    </div>
    <div class="form-group">
        <label>Choose project manager</label>
        <select v-model="projectManagerId" @change="selectProjectManager" class="form-control">
            <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">{{pm.name}} - {{pm.job}}</option>
        </select>
    </div>
    <div class="d-flex alert alert-info" role="alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
            <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
        </svg>
        <div class="ml-2">
            If you want to change team members you must go to <span class="font-italic">Manage teams</span> and then choose <span class="font-italic">Edit team</span> option.
        </div>
    </div>
        
    <div class="card px-0">
        <div class="card-header h5 text-center">{{name}}</div>
        <div class="card-body d-flex flex-column">
            <div class="card-title mt-2 mb-4 h5">{{projectTeamName}}</div>
            <table class="table table-striped">
                <thead>
                    <th>Name</th>
                    <th>Job position</th>
                    <th class="text-center">Project manager</th>
                    <th class="text-center">Team leader</th>
                </thead>
                <tbody>
                    <tr v-for="member in projectMembers" :key="member.id">
                        <td>{{member.name}}</td>
                        <td>{{member.job}}</td>
                        <td class="text-center">
                            <svg v-if="member.isSelectedAsProjectManager" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                            </svg>
                        </td>
                        <td class="text-center">
                            <svg v-if="member.isSelectedAsTeamLeader" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                            </svg>
                        </td>
                    </tr>
                </tbody>
            </table>
            <button @click="openModal" class="btn btn-warning mr-4 align-self-end">Edit project</button>
        </div>
    </div>
</div>


<teleport to="body">
    <base-modal id="editProjectModal">
        <template #header>Edit project</template>
        <template #body>
            <div class="row">
                <div class="col-4">
                    <div class="font-weight-bold">Project name</div>
                    <span>{{name}}</span>
                </div>
                <div>
                    <div class="font-weight-bold">Project manager</div>
                    <span>{{projectManagerName}}</span>
                </div>
            </div>
            <div class="row my-3">
                <div class="col-4">
                    <div class="font-weight-bold">Start date</div>
                    <span>{{startDate}}</span>
                </div>
                <div>
                    <div class="font-weight-bold">End date</div>
                    <span>{{endDate}}</span>
                </div>
            </div>
            <div class="row">
                <table class="table table-striped mx-2">
                    <thead>
                        <th>Name</th>
                        <th>Job position</th>
                        <th class="text-center">Project manager</th>
                        <th class="text-center">Team leader</th>
                    </thead>
                    <tbody>
                        <tr v-for="member in projectMembers" :key="member.id">
                            <td>{{member.name}}</td>
                            <td>{{member.job}}</td>
                            <td class="text-center">
                                <svg v-if="member.isSelectedAsProjectManager" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                </svg>
                            </td>
                            <td class="text-center">
                                <svg v-if="member.isSelectedAsTeamLeader" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                                    <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                                </svg>
                                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                                    <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template #footer>
            <div class="d-flex justify-content-between align-items-center">
                <div>Are you sure you want to edit this project?</div>
                <div>
                    <button @click="editProject" class="btn btn-success mr-2">Yes</button>
                    <button @click="closeEditProjectModal" class="btn btn-primary">No</button>
                </div>
            </div>
        </template>
    </base-modal>
</teleport>

<teleport to="body">
    <base-modal id="validationModal">
        <template #header>Server response</template>
        <template #body>You must enter any change in the project!</template>
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
        <template #body>You have just edited the team successfully!</template>
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
import { getDatabase, update, ref } from "firebase/database";

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
            selectedProject: null,
            name: '',
            startDate: '',
            endDate: '',
            projectManagerId: '',
            projectManager: null,
            projectManagers: [],
            projectTeamName: '',
            projectMembers: [],
            validation: false
        }
    },

    computed: {
        projectManagerName() {
            if(this.projectManager !== null) {
                return this.projectManager.name;
            }
        }
    },

    mounted() {
        //takes selected project data
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects/' + this.selectedProjectId + '.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            this.name = data.name;
            this.startDate = data.startDate;
            this.endDate = data.endDate;
            this.projectManagerId = data.projectManager.id;
            this.projectManager = data.projectManager;
            this.projectMembers = data.team.members.sort(function(x,y) {
                return (x === y) ? 0 : x.isSelectedAsProjectManager ? -1 : 1;
            });
            this.projectTeamName = data.team.name;
        });

        //takes all project managers
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for(const id in data) {           
                if(data[id].isProjectManager) {
                    this.projectManagers.push({
                        id: id,
                        name: data[id].name,
                        job: data[id].job,
                        isProjectManager: data[id].isProjectManager,
                        isTeamLeader: data[id].isTeamLeader,
                    });
                }
            }
        });

        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects/' + this.selectedProjectId + '.json')
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                this.selectedProject = data;
            });
    },

    methods: {

        selectProjectManager() {
            const projectManager = this.projectManagers.find((pm) => pm.id === this.projectManagerId);
            projectManager.isSelectedAsProjectManager = true;
            this.projectManager = projectManager;

            if(this.selectedProject.team.members.find((m) => m.id === projectManager.id)) {
                this.projectMembers.forEach((m1) => {
                    if(!this.selectedProject.team.members.find((m2) => m2.id === m1.id)) {
                        const index = this.projectMembers.findIndex((m3) => m3.id === m1.id);
                        this.projectMembers.splice(index,1);
                    }

                    if(m1.id === projectManager.id) {
                        this.projectMembers.forEach((pm) => pm.isSelectedAsProjectManager = false);
                        m1.isSelectedAsProjectManager = true;
                    }

                });

            } else {
                if(this.projectMembers.find((pm) => pm.id === projectManager.id)) {
                this.projectMembers.forEach((pm) => {
                    pm.isSelectedAsProjectManager = false;
                    if(pm.id === projectManager.id) {
                        pm.isSelectedAsProjectManager = true;
                    }
                });
                } else {
                    this.projectMembers.forEach((pm) => pm.isSelectedAsProjectManager = false);
                    if(this.projectMembers.length > this.selectedProject.team.members.length) {
                        const index = this.projectMembers.findIndex((pm) => pm.isSelectedAsProjectManager === true);
                        this.projectMembers.splice(index,1);
                        this.projectMembers.push(projectManager);
                    } else {
                        this.projectMembers.push(projectManager);
                    }
                }
            }
        },

        openModal() {
            let validation = false;

            if(this.selectedProject.name !== this.name) {
                validation = true;
            }

            if(this.selectedProject.startDate !== this.startDate) {
                validation = true;
            }

            if(this.selectedProject.endDate !== this.endDate) {
                validation = true;
            }

            if(this.selectedProject.projectManager.id !== this.projectManagerId) {
                validation = true;
            }

            if(validation) {
                this.validation = true;
                $('#editProjectModal').modal('show');
            } else {
                this.validation = false;
                $('#validationModal').modal('show');
            }
        },

        closeEditProjectModal() {
            $('#editProjectModal').modal('hide');
        },

        closeValidationModal() {
            $('#validationModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

        editProject() {
            update(ref(database,'projects/' + this.selectedProjectId),{
                name: this.name,
                startDate: this.startDate,
                endDate: this.endDate,
                projectManager: this.projectManager
            });

            $('#editProjectModal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    },

}

</script>