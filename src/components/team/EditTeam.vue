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
                </div> 
                <table class="table table-striped">
                    <thead>
                        <th>Name</th>
                        <th>Job position</th>
                    </thead>
                    <tbody>
                        <tr v-for="member in teamMembers" :key="member.id">
                            <td>{{member.name}}</td>
                            <td>{{member.job}}</td>
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
import { getDatabase, update, ref,get, child } from "firebase/database";

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

function sortByName(x,y) {
    if(x.name > y.name) {
        return 1;
    }
    if(x.name< y.name) {
        return -1;
    }
    return 0;
}

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
            teamName: '',
            teamMembers: [],
            selectedTeamId: 'empty',
            validationEditTeamModalMesseage: '',
            teamNames: [],
            employees: []
        }
    },

    mounted() {
        //gets all team names that are in use        
        get(child(ref(database), 'teams')).then((snapshot) => {
        if (snapshot.exists()) {
            for(const id in snapshot.val()) {
                this.teamNames.push(snapshot.val()[id].name);
            }    
        } else {
            console.log("No teams data available");
        }
        }).catch((error) => {
            console.error(error);
        });

        //gets all employees
        get(child(ref(database), 'employees')).then((snapshot) => {
        if (snapshot.exists()) {
            for (const id in snapshot.val()) {
                this.employees.push({
                    id: id,
                    name: snapshot.val()[id].name,
                    job: snapshot.val()[id].job,
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

        openModal(name,members,teamId) {
            //gets all employees
            get(child(ref(database), 'teams/' + teamId)).then((snapshot) => {
            if (snapshot.exists()) { 

                const teamNameStoredInDatabase = snapshot.val().name;
                const teamMembersStoredInDatabase = snapshot.val().members;
                
                if(name === '') {
                    this.validationEditTeamModalMesseage = 'Your team needs a name.';
                    $('#validationEditTeamModal').modal('show');
                } 
                else if(members.length === 0) {
                    this.validationEditTeamModalMesseage = 'Your team needs at least one member.';
                    $('#validationEditTeamModal').modal('show');
                }
                else if(teamNameStoredInDatabase === name && (JSON.stringify(teamMembersStoredInDatabase.sort(sortByName)) === JSON.stringify(members.sort(sortByName)))) {
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
            }).catch((error) => {
                console.error(error);
            });
        },

        closeValidationEditTeamModal() {
            $('#validationEditTeamModal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        },

        closeEditTeamModal() {
            $('#editTeamModal').modal('hide');
        },

        changeKey() {
            this.keyComponent += 1;
        },

        editTeam() {

            // this.employees.forEach((e) => {
            //     this.teamMembers.forEach((m) => {
            //         if(e.id === m.id) {
            //             //updates isTeamMember property to true for all employees who are members of this team
            //             update(ref(database,'employees/' + e.id),{
            //                 isTeamMember: true
            //             })
            //         }
            //     });
            // });  

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