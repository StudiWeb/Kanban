<template>
<section>
    <div class="row">
        <div class="col-xl-6">
            <div class="h5 my-4">Delete team</div>
            <div class="form-group">
                <label>Select team</label>
                <select @change="selectTeam" v-model="teamId" class="form-control">
                    <option value="empty">none</option>
                    <option v-for="team in teams" :key="team.id" :value="team.id">{{team.name}}</option>
                </select>
            </div>
            <div class="card" v-if="selectedTeam">
                <div class="card-header h5">{{getTeamName}}</div>
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title mt-2 mb-4">Team members</h5>
                    <table class="table table-striped">
                        <thead>
                            <th class="col-4">Name</th>
                            <th class="col-4">Job position</th>
                        </thead>
                        <tbody>
                            <tr v-for="member in selectedTeam.members" :key="member.id">
                                <td>{{member.name}}</td>
                                <td>{{member.job}}</td>
                            </tr>
                        </tbody>
                    </table>
                    <button @click="openModal" class="btn btn-danger mr-4 align-self-end">Delete team</button>
                </div>
            </div>
        </div>
    </div>
</section>

<teleport to="body">
    <base-modal id="deleteTeamModal">
        <template #header>Delete team</template>
        <template #body>
            <div>
                <p><span class="font-weight-bold">Name: </span>{{getTeamName}}</p>
                <p><span class="font-weight-bold">Team members</span></p>
                <table class="table table-striped">
                    <thead>
                        <th>Name</th>
                        <th>Job position</th>
                    </thead>
                    <tbody>
                        <tr v-for="member in getTeamMembers" :key="member.id">
                            <td>{{member.name}}</td>
                            <td>{{member.job}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
        <template #footer>
            <div class="d-flex align-items-baseline justify-content-between">
                Are you sure you want to delete this team?
                <div>
                    <button @click="deleteTeam" class="btn btn-success mr-2">Yes</button>
                    <button @click="closeModal" class="btn btn-primary">No</button>
                </div>
            </div>
        </template>
    </base-modal>
</teleport>

<teleport to="body">
    <base-modal id="serverResponseModal" data-backdrop="static">
        <template #header>Server response</template>
        <template #body>You have just deleted a team successfully!</template>
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
import { getDatabase , set , update, ref } from "firebase/database";

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
            teams: [],
            teamId: null,
            selectedTeam: null,
            projects: [],
            employees: [],
            canDeleteTeam: false
        }
    },

    computed: {
        getTeamName() {
            if(this.selectedTeam) {
                return this.selectedTeam.name;
            }
        },

        getTeamMembers() {
            if(this.selectedTeam) {
                return this.selectedTeam.members;
            }
        }
    },

    mounted() {

        //gets employees
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        }) 
        .then((data) => {
            for(const id in data) {
                this.employees.push({
                    id: id,
                    name: data[id].name,
                    job: data[id].job,
                    isProjectManager: data[id].isProjectManager,
                    isTeamLeader: data[id].isTeamLeader,
                });
            }
        });

        //gets teams
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json')
        .then((response) => response.json())
        .then((data) => {
            for(const id in data) {
                this.teams.push({
                    id: id,
                    name: data[id].name,
                    members: data[id].members
                });
            }
        });
        //gets projects
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
            $('#deleteTeamModal').modal('show');
        },

        closeModal() {
            $('#deleteTeamModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

        selectTeam() {
            if(this.teamId !== 'empty') {
                this.selectedTeam = this.teams.find((t) => t.id === this.teamId);
            } else {
                this.selectedTeam = null;
            }
        },

        deleteTeam() {
            this.canDeleteTeam = true;
            this.projects.forEach((p) => {
                if(p.team.id === this.selectedTeam.id) {
                    this.canDeleteTeam = false;
                } 
            })

            if(this.canDeleteTeam) {

                set(ref(database, 'teams/' + this.selectedTeam.id),null);

                //sets isTeamMember property to false for all employees who were in selected team
                this.selectedTeam.members.forEach((m) => {
                    this.employees.forEach((e) => {
                        if(m.id === e.id) {
                            update(ref(database, 'employees/' + e.id),{
                                isTeamMember: false
                            });
                        }
                    })
                })
                
                $('#deleteTeamModal').modal('hide');
                $('#serverResponseModal').modal('show');
            }
        }
    }
}

</script>

<style scoped>
.card-header {
    font-weight: bold;
    text-align: center;
}

</style>