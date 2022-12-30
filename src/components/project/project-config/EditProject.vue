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
</div>

<CreateTeam 
    :componentName="componentName"
    @project-form="setForm"
    @update-team="updateTeam"
    :projectManager="projectManager"
/>

<button @click="openModal" class="btn btn-warning mt-4">Edit project</button>

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
import { getDatabase, ref, update,get,child  } from "firebase/database";

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

import CreateTeam from './CreateTeam.vue';

export default {

    components: {
        CreateTeam
    },

    emits: ['change-key'],

    props: ['selectedProjectId'],

    data() {
        return {
            componentName : 'EditProject',
            selectedProject: null,
            name: '',
            startDate: '',
            endDate: '',
            projectManagerId: 'empty',
            projectManager: null,
            projectManagers: [],
            projectTeamName: '',
            projectMembers: [],
            validation: false,
            projectTeamLeader: '',
            teamName: '',
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
        get(child(ref(database), 'employees')).then((snapshot) => {
            if (snapshot.exists()) {
                for(const id in snapshot.val()) {
                    if(snapshot.val()[id].isProjectManager) {
                        this.projectManagers.push({
                            id: id,
                            name: snapshot.val()[id].name,
                            job: snapshot.val()[id].job,
                            isProjectManager: snapshot.val()[id].isProjectManager,
                            isTeamLeader: snapshot.val()[id].isTeamLeader,
                            isTeamMember: snapshot.val()[id].isTeamMember
                        });
                    }
                }
                this.projectManager = this.projectManagers.find((e) => e.id === this.projectManagerId);
            } else {
                console.log("No data available");
            }
            }).catch((error) => {
                console.error(error);
            });
    },

    methods: {

        updateTeam(members) {   
            this.projectMembers = members;
        },

        setForm(projectName, startDate, endDate,projectManagerId,members,project,teamName) {
            this.name = projectName;
            this.startDate = startDate;
            this.endDate = endDate;
            this.projectManagerId = projectManagerId;
            this.projectMembers = members;
            this.selectedProject = project;
            this.teamName = teamName;
        },

        selectProjectManager() {
            const projectManager = this.projectManagers.find((pm) => pm.id === this.projectManagerId);
            projectManager.isSelectedAsProjectManager = true;
            this.projectManager = projectManager;
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
            console.log(this.selectedProject.team.members)
            console.log(this.projectMembers)

            const baseProjectMembers = this.selectedProject.team.members;
            baseProjectMembers.sort(function(x,y) {
                if(x.isSelectedAsTeamLeader === true && y.isSelectedAsTeamLeader === false) {
                    return -1;
                } 
                
                if(x.isSelectedAsTeamLeader === false && y.isSelectedAsTeamLeader === true) {
                    return 1;
                } 
                
                if(x.isSelectedAsTeamLeader === y.isSelectedAsTeamLeader) {
                    if(x.name > y.name) {
                            return 1;
                        }

                        if(x.name < y.name) {
                            return -1;
                        }
                        return 0;                
                } 
   
            });

            const editedProjectMembers = this.projectMembers;
            editedProjectMembers.sort(function(x,y) {
                if(x.isSelectedAsTeamLeader === true && y.isSelectedAsTeamLeader === false) {
                    return -1;
                } 
                
                if(x.isSelectedAsTeamLeader === false && y.isSelectedAsTeamLeader === true) {
                    return 1;
                } 
                
                if(x.isSelectedAsTeamLeader === y.isSelectedAsTeamLeader) {
                    if(x.name > y.name) {
                            return 1;
                        }

                        if(x.name < y.name) {
                            return -1;
                        }
                        return 0;                
                } 
               
            });

            if(JSON.stringify(baseProjectMembers) !== JSON.stringify(editedProjectMembers)) {
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
                projectManager: this.projectManager,
                team: {
                    'name' : this.teamName,
                    'members': this.projectMembers
                }
            }).catch((error) => {
                console.error(error);
            });

            $('#editProjectModal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    },

}

</script>