<template>    
    <section class="row flex-column mx-0">
        <div class="col-xl-6 px-0">
            <div class="h4 my-4">Create project</div>
        </div>
        <div class="col-xl-6 px-0">
            <div class="form-group">
                <label>Project name</label>
                <input v-model="projectName" ref="projectName" type="text" class="form-control" id="projectName">
                <div class="invalid-feedback">This project name is already in use. Please type different project name.</div>
            </div>
            <div class="form-group">
                <label>Start date</label>
                <input v-model="startDate" type="date" class="form-control" id="startDate">
            </div>
            <div class="form-group">
                <label>End date</label>
                <input v-model="endDate" :min="startDate" type="date" class="form-control" id="endDate">
            </div>
            <div class="form-group">
                <label>Select team</label>
                <select 
                    v-model="selectedTeamId"
                    class="form-control" 
                    id="team">
                    <option value="empty"></option>
                    <option v-for="t in teams" :key="t.id" :value="t.id">{{t.name}}</option>
                </select>
            </div>
            <div class="form-group">
                <label>Project manager</label>
                <select
                    v-model="selectedProjectManagerId" 
                    ref="projectManagerSelect"
                    class="form-control" 
                    id="projectManager">
                    <option value="empty" selected>none</option>
                    <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">{{pm.name}}</option>
                </select>
            </div>
        </div>

        <div class="card col-xl-6 px-0" v-if="selectedTeamId !== 'empty'">
            <div class="card-header h5 text-center">{{getProjectName}}</div>
            <div class="card-body d-flex flex-column">
                <div class="card-title mt-2 mb-4 h5">{{getTeamName}}</div>
                <table class="table table-striped">
                    <thead>
                        <th>Name</th>
                        <th>Job position</th>
                        <th class="text-center">Project manager</th>
                        <th class="text-center">Team leader</th>
                    </thead>
                    <tbody>
                        <tr v-for="member in teamMembers" :key="member.id">
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

                <button @click="openModal" class="btn btn-success mr-4 align-self-end">Add project</button>
            </div>
        </div>
    </section>

    <teleport to="body">
        <base-modal id="addProjectModal">
            <template #header>Create project</template>
                <template #body>
                    <p><span class="font-weight-bold">Project name: </span>{{projectName}}</p>
                    <div class="row">
                        <div class="col-6">
                            <div class="font-weight-bold">Start date</div>
                            <div>{{startDate}}</div>
                        </div>
                        <div>
                            <div class="font-weight-bold">End date</div>
                            <div>{{endDate}}</div>
                        </div>
                    </div>
                    <div class="row my-2">
                        <div class="col-6">
                            <div class="font-weight-bold">Project manager</div>
                            <div>{{selectedProjectManagerName}}</div>
                        </div>
                        <div>
                            <div class="font-weight-bold">Team leader</div>
                            <div>{{selectedTeamLeaderName}}</div>
                        </div>
                    </div>
                    <p><span class="font-weight-bold">Team members</span></p>
                    <table class="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col">Job position</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="member in teamMembers" :key="member.id">
                                <td>
                                    {{member.name}}
                                    <span class="font-weight-bold">
                                        {{
                                            member.isSelectedAsProjectManager && member.isSelectedAsTeamLeader ? '(PM) (TL)' : 
                                            member.isSelectedAsProjectManager ? '(PM)':
                                            member.isSelectedAsTeamLeader ? '(TL)' : ''
                                        }}
                                    </span>
                                </td>
                                <td>{{member.job}}</td>
                            </tr>
                        </tbody>
                        </table>
                </template>
                <template #footer>
                    <div class="d-flex justify-content-between align-items-baseline">
                        Are you sure do you want to create this project?
                        <div>
                            <button @click="createProject" class="btn btn-success mr-2">Yes</button>
                            <button @click="closeAddProjectModal" class="btn btn-primary">No</button>
                        </div>
                    </div>
                </template>
        </base-modal>  
    </teleport>

    <teleport to="body">
        <base-modal id="validationAddProjectModal">
            <template #header>Create project</template>
            <template #body>Please fiil the form.</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeValidationAddProjectModal" class="btn btn-primary">Ok</button>
                </div>
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-modal id="responseServerModal">
            <template #header>Server response</template>
            <template #body>You have just created a new project!</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeResponseServerModal" class="btn btn-primary">Ok</button>
                </div>
            </template>
        </base-modal>
    </teleport>

</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase,get,child, update, ref } from "firebase/database";

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
            projectName: '',
            startDate: '',
            endDate: '',
            selectedTeamId: 'empty',
            selectedProjectManagerId: 'empty',
            selectedProjectManager: null,
            selectedTeam: null,
            selectedTeamName: '',
            selectedProjectManagerName: '',
            selectedTeamLeaderName: '',
            projectManagers: [],
            teamMembers: [],
            teams: [],
            employees: [],
            team: [],
            isDataFilledPropely: false,
            projectNames: []
        }
    },

    watch: {

        projectName(name) {
            if(name !== '') {
                if(this.projectNames.find((n) => n === name)) {
                    $('#projectName').removeClass('is-valid');
                    $('#projectName').addClass('is-invalid');
                } else {
                    $('#projectName').removeClass('is-invalid');
                    $('#projectName').addClass('is-valid');
                }
            } else {
                $('#projectName').removeClass('is-valid');
            }
        },

        selectedTeamId(teamId) {
            if(teamId !== 'empty') {

                fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams/' + teamId + '.json')
                .then((response) => {
                    if(response.ok) {
                        return response.json();
                    }
                }).then((data) => {
                    this.selectedTeamName = data.name;
                    this.selectedTeamLeaderName = data.members.find((m) => m.isSelectedAsTeamLeader === true).name;
                    this.teamMembers = data.members;
                    this.$refs.projectManagerSelect.disabled = false;
                });

                $('#team').addClass('is-valid');
            } else {
                this.selectedTeamLeaderName = '';
                this.teamMembers = null;
                this.$refs.projectManagerSelect.disabled = true;
                $('#team').removeClass('is-valid');
            }
        },

        selectedProjectManagerId(projectManagerId) {
            if(this.selectedTeamId !== 'empty') {

                fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams/' + this.selectedTeamId + '.json')
                .then((response) => {
                    if(response.ok) {
                        return response.json();
                    }
                }).then((data) => {
                    //basic squad 
                    const team = data.members;

                    if(projectManagerId !== 'empty') {

                        this.selectedProjectManagerName = this.projectManagers.find((pm) => pm.id === projectManagerId).name;
                        this.selectedProjectManager = this.projectManagers.find((pm) => pm.id === projectManagerId);
                        this.selectedProjectManager.isSelectedAsProjectManager = true;
                        const projectManager = this.selectedProjectManager;

                        if(team.find((m) => m.id === projectManagerId)) {
                            //restores to original state of team members list
                            this.teamMembers = team.filter(x => !this.teamMembers.includes(x));
                            //sets isSelectedAsProjectManager property for all team members
                            while(this.teamMembers.find((m) => m.isSelectedAsProjectManager === true)) {
                                const index = this.teamMembers.findIndex((m) => m.isSelectedAsProjectManager === true);
                                this.teamMembers[index].isSelectedAsProjectManager = false;
                            }
                            //sets isSelectedAsProjectManager property to selected project manager
                            const index = this.teamMembers.findIndex((m) => m.id === projectManagerId);
                            this.teamMembers[index].isSelectedAsProjectManager = true;
                        } else {
                            //restores to original state of team members list
                            this.teamMembers = team.filter(x => !this.teamMembers.includes(x));
                            //ads new project manager
                            this.teamMembers.push(projectManager)
                        }

                        //sorts by project manager
                        this.teamMembers.sort(function(x,y) {
                            return (x === y) ? 0 : x.isSelectedAsProjectManager ? -1 : 1;
                        });

                        $('#projectManager').removeClass('is-invalid');
                        $('#projectManager').addClass('is-valid');

                    } else {
                        //restores to original state of team members list
                        this.teamMembers = team.filter(x => !this.teamMembers.includes(x));
                        $('#projectManager').removeClass('is-valid');
                    }
                     
                });

            } else {
                
            }
        },

        startDate(value) {
            if(value !== '') {
                $('#startDate').removeClass('is-invalid');
                $('#startDate').addClass('is-valid');
            } else {
                $('#startDate').removeClass('is-valid');
            }
        },

        endDate(value) {
            if(value !== '') {
                $('#endDate').removeClass('is-invalid');
                $('#endDate').addClass('is-valid');
            } else {
                $('#endDate').removeClass('is-valid');
            }
        }
        
    },

    computed: {
        getTeamName() {
            if(this.selectedTeam !== null) {
                return this.selectedTeam.name;
            }
        },

        getProjectName() {
            if(this.projectName === '' ) {
                return 'Project name'
            } else {
                return this.projectName;
            }
        },
    },

    mounted() {
        this.$refs.projectManagerSelect.disabled = true;

        //gets project managers
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
                        isSelectedAsProjectManager: data[id].isSelectedAsProjectManager
                    });
                }
            }
        })

        //gets teams
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
                    name: data[id].name,
                    members: data[id].members
                });
            }
        });

        //gets employees
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
                });
            }
        });

        //gets all task names
        get(child(ref(database), 'projects'))
            .then((data) => {
                if (data.exists()) {
                    for(const id in data.val()) {
                        this.projectNames.push(data.val()[id].name);    
                    }
                } else {
                    console.log("No data available");
                }
            }).catch((error) => {
                console.error(error);
            });
    },

    methods: {

        openModal() {

            let validation = true;

            if(this.projectName !== '') {
                if(this.projectNames.find((n) => n === this.projectName)) {
                    validation = false;
                    $('#projectName').addClass('is-invalid');
                }
            } else {
                $('#projectName').addClass('is-invalid');
            }

            if(this.selectedProjectManagerId === 'empty') {
                $('#projectManager').addClass('is-invalid');
                validation = false;
            }

            if(this.startDate === '') {
                $('#startDate').addClass('is-invalid');
            }

            if(this.endDate === '') {
                $('#endDate').addClass('is-invalid');
            }
            
            if(validation) {
                $('#addProjectModal').modal('show');
            } 
            else {
                $('#validationAddProjectModal').modal('show');
            }
            
        },

        closeResponseServerModal() {
            $('#responseServerModal').modal('hide');
            this.$emit('change-key');
        },

        closeAddProjectModal() {
            $('#addProjectModal').modal('hide');
        },

        closeValidationAddProjectModal() {
            $('#validationAddProjectModal').modal('hide');
        },

        createProject() {

            this.selectedTeam = {
                name: this.selectedTeamName,
                members: this.teamMembers
            };

            update(ref(database,'employees/' + this.selectedProjectManagerId),{
                isSelectedAsProjectManager: true
            });

            fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {
                    name : this.projectName.trim(),
                    team: this.selectedTeam,
                    startDate: this.startDate.trim(),
                    endDate: this.endDate.trim(),
                    projectManager: this.selectedProjectManager,
                    isProjectVisible: false,
                })
            })

            $('#addProjectModal').modal('hide');
            $('#responseServerModal').modal('show');
        },

    }
}

</script>