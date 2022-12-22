<template>

<section>
    <create-team
        :key="keyComponent" 
        @open-modal="openModal"
        @change-key="changeKey"
        :componentName="componentName">
    </create-team>
</section>

<teleport to="body">
    <base-modal id="editTeamModal">
        <template #header>Edit team</template>
        <template #body>
            <div>
                <div class="d-flex mb-4">
                    <div class="col-6 px-0">
                        <div class="font-weight-bold">Team name</div>
                        <div>{{teamName}}</div>
                    </div>
                    <div>
                        <div class="font-weight-bold">Team leader</div>
                        <div>{{teamLeaderName}}</div>
                    </div>
                </div> 
                <table class="table table-striped">
                    <thead>
                        <th>Name</th>
                        <th>Job position</th>
                    </thead>
                    <tbody>
                        <tr v-for="member in teamMembers" :key="member.id">
                            <td>{{member.name}}</td>
                            <td>
                                {{member.job}} 
                                <span v-if="member.isSelectedAsTeamLeader" class="font-weight-bold">(TL)</span> 
                            </td>
                        </tr>
                    </tbody>
                </table>
                               
            </div>
        </template>
        <template #footer>
            <div class="d-flex justify-content-between">
                Are you sure you want to edit this team?
                <div>
                    <button @click="editTeam" class="btn btn-success mr-2">Yes</button>
                    <button @click="closeEditTeamModal" class="btn btn-primary">No</button>
                </div>
            </div>
        </template>
    </base-modal>
</teleport>

<teleport to="body">
    <base-modal id="validationEditTeamModal">
        <template #header>Edit team</template>
        <template #body>{{validationEditTeamModalMesseage}}</template>
        <template #footer>
            <div class="d-flex justify-content-end">
                <button @click="closeValidationEditTeamModal" class="btn btn-primary">Ok</button>
            </div>
        </template>
    </base-modal> 
</teleport>

<teleport to="body">
    <base-modal id="serverResponseModal">
        <template #header>Server response</template>
        <template #body>You have just edited a team!</template>
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

import CreateTeam from './../view-components/team/CreateTeam.vue';

export default {

    components: {
        CreateTeam
    },

    emits: ['changeKey'],

    data() {
        return {
            componentName : 'EditTeam',
            keyComponent: 0,
            teamLeaderName: '',
            teamName: '',
            teamMembers: [],
            selectedTeamId: 'empty',
            validationEditTeamModalMesseage: '',
            teamNames: [],
            teamLeaders: []

        }
    },

    mounted() {
        //gets all team names that are in use
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        }).
        then((data) => {
            for(const id in data) {
                this.teamNames.push(data[id].name);
            }
        });

        //gets team leaders
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for (const id in data) {
                //gets project managers
                if(data[id].isTeamLeader) {
                    this.teamLeaders.push({
                        id: id,
                        name: data[id].name,
                        job: data[id].job,
                        isProjectManager: data[id].isProjectManager,
                        isTeamLeader: data[id].isTeamLeader,
                    })
                }
            }
        });
    },

    methods: {

        openModal(name,members,teamLeaderId,teamId) {

            if(teamLeaderId !== 'empty') {
                this.teamLeaderName = this.teamLeaders.find((tl) => tl.id === teamLeaderId).name;
            } else {
                this.teamLeaderName = '';
            }

            fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams/' + teamId + '.json')
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {

                if(data) {
                    const teamNameStoredInDatabase = data.name;
                    const teamMembersStoredInDatabase = data.members
                    
                    if(name === '' || teamLeaderId === 'empty') {
                        this.validationEditTeamModalMesseage = 'Your team needs a name and a team leader.';
                        $('#validationEditTeamModal').modal('show');
                    } 
                    else if(teamNameStoredInDatabase === name && (JSON.stringify(teamMembersStoredInDatabase) === JSON.stringify(members))) {
                        this.validationEditTeamModalMesseage = 'You must enter any change in a team to edit it.';
                        $('#validationEditTeamModal').modal('show');
                    }
                    else if(this.teamNames.find((teamName) => teamName === name) && teamNameStoredInDatabase !== name) {
                        this.validationEditTeamModalMesseage = 'This team name is already used. Please type different team name.';
                        $('#validationEditTeamModal').modal('show');
                    }
                    else {
                        this.teamName = name;
                        this.teamMembers = members;
                        this.selectedTeamId = teamId;
                        $('#editTeamModal').modal('show');
                    }
                } else {
                    this.validationEditTeamModalMesseage = 'Please select a team.'
                    $('#validationEditTeamModal').modal('show');
                }
            });
        },

        closeValidationEditTeamModal() {
            $('#validationEditTeamModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
        },

        closeEditTeamModal() {
            $('#editTeamModal').modal('hide');
        },

        changeKey() {
            this.keyComponent += 1;
        },

        editTeam() {
            update(ref(database, 'teams/' + this.selectedTeamId), {
                name: this.teamName,
                members: this.teamMembers
            });

            $('#editTeamModal').modal('hide');
            $('#serverResponseModal').modal('show');
        }
    }
}

</script>