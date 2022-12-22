<template>

<section> 
    <create-team 
        @open-modal="openModal"
        @change-key="changeKey"
        :key="componentKey"
        :componentName="componentName">
        <template #header>
            <span class="h4 d-block my-4">Create team</span>
        </template>
    </create-team>
</section>

<teleport to="body">
    <base-modal id="addTeamModal">
        <template #header>Create team</template>
        <template #body>
            <div>
                <p><span class="font-weight-bold">Team name: </span> {{teamName}}</p>
                <p><span class="font-weight-bold">Team members</span></p>
                <table class="table table-striped">
                <thead>
                    <th>Name</th>
                    <th>Job position</th>
                </thead>
                <tbody>
                    <tr v-for="m in getTeamMembers">
                        <td>
                            {{m.name}} 
                            <span v-if="m.isSelectedAsTeamLeader" class="font-weight-bold"> (TL)</span> 
                        </td>
                        <td>{{m.job}}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </template>
        <template #footer>
            <div class="d-flex justify-content-between">
                Are you sure you want to create this team?
                <div>
                    <button @click="addTeam" class="btn btn-success mr-2">Yes</button>
                    <button @click="closeAddTeamModal" class="btn btn-primary">No</button>
                </div>
            </div>
        </template>
    </base-modal>
</teleport>

<teleport to="body">
    <base-modal id="validationAddTeamModal">
        <template #header>Add team</template>
        <template #body>{{validationAddTeamModalMesseage}}</template>
        <template #footer>
            <div class="d-flex justify-content-end">
                <button @click="closeValidationAddTeamModal" class="btn btn-primary">Ok</button>
            </div>
        </template>
    </base-modal> 
</teleport>

<teleport to="body">
    <base-modal id="serverResponseModal">
        <template #header>Server response</template>
        <template #body>You have just added a new team!</template>
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
import { getDatabase , update , ref } from "firebase/database";

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

import CreateTeam from '../view-components/team/CreateTeam.vue';

export default {
    components: {
        CreateTeam
    },

    emits: ['changeKey'],

    data() {
        return{
            componentName: 'CreateTeam',
            teamLeader: 'empty',
            teamName: '',
            teamMembers: [],
            employees: [],
            componentKey: 0,
            teamNames: [],
            validationAddTeamModalMesseage: ''
        };
    },

    computed: {
        isDataFilledProperly() {
            if(this.teamName === '') {
                return false;
            } else {
                if(this.teamMembers !== null) {
                    const teamLeader = this.teamMembers.find((m) => m.isSelectedAsTeamLeader === true);
                    if(teamLeader) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } 
        },

        getTeamMembers() {
            if(this.teamMembers !== null) {
                return this.teamMembers;
            }
        }
    },

    mounted() {
        //gets all employees
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

    },

    methods: {
        openModal(name,members,teamLeaderId) {
            console.log(teamLeaderId)

            if(name === '' && teamLeaderId === 'empty') {
                this.validationAddTeamModalMesseage = 'Your teams needs a name and a team leader.';
                $('#validationAddTeamModal').modal('show');
            }
            else if(name === '') {
                this.validationAddTeamModalMesseage = 'Please enter a team name.';
                $('#validationAddTeamModal').modal('show');
            }
            else if(teamLeaderId === 'empty') {
                this.validationAddTeamModalMesseage = 'Please select a team leader.';
                $('#validationAddTeamModal').modal('show');
            }
            else if(this.teamNames.find((teamName) => teamName === name)) {
                this.validationAddTeamModalMesseage = 'This team name is already used. Please type different team name.';
                $('#validationAddTeamModal').modal('show');
            }
            else {
                this.teamName = name;
                this.teamMembers = members;
                $('#addTeamModal').modal('show');
            }
        },

        closeAddTeamModal() {
            $('#addTeamModal').modal('hide');
        },

        closeValidationAddTeamModal() {
            $('#validationAddTeamModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
        },

        changeKey() {
            this.componentKey += 1;
        },

        addTeam() {

            
            this.employees.forEach((e) => {
                this.teamMembers.forEach((m) => {
                    if(e.id === m.id) {
                        //updates isTeamMember property to true for all employees who are members of this team
                        update(ref(database,'employees/' + e.id),{
                            isTeamMember: true
                        })
                    }
                    if(e.id === m.id && m.isSelectedAsTeamLeader === true) {
                        //updates isSelectedAsTeamLeader property to true for an employee who is a team leader of this team
                        update(ref(database,'employees/' + e.id),{
                            isSelectedAsTeamLeader: true
                        })
                    }
                });
            });            

            //sets isTeamMember property to true for all teamMembers in teams
            this.teamMembers.forEach((member) => member.isTeamMember = true);
            //puts a new team into database
            fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: this.teamName,
                    members: this.teamMembers
                }),
            });

            $('#addTeamModal').modal('hide');
            $('#serverResponseModal').modal('show');
            
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.componentKey += 1;
        }
    }

}

</script>
