<template>

<div v-if="componentName === 'EditTeam'" class="row">
    <div class="col-xl-6">
        <div class="h5 my-4">Edit team</div>
        <div class="px-0 form-group">
            <label>Select team</label>
            <select v-model="selectedTeamId" class="form-control">
                <option value="empty">none</option>
                <option v-for="team in teams" :key="team.id" :value="team.id">{{team.name}}</option>
            </select>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-xl-6">
        <slot name="header"></slot>
        <div class="px-0 form-group">
            <label>Team name</label>
            <input v-model="enteredTeamName" id="teamName" class="form-control" aria-describedby="invalidTeamName" ref="teamNameInput" type="text">
            <div v-if="teamNameExists" id="invalidTeamName" class="invalid-feedback">There is already a team wtih this name. Please type different team name.</div>
        </div>
        <div class="px-0 form-group">
            <label>Team leader</label>
            <select v-model="selectedTeamLeaderId" id="teamLeader" @change="selectTeamLeader" ref="teamLeaderSelect" class="form-control">
                <option value="empty">none</option>
                <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">{{tl.name}}</option>
            </select>
        </div>
    </div>
</div>

<div class="row">
    <div class="col-xl-6">
        <div class="h5 my-4">Add employees to your team</div>
        <div class="d-flex flex-column flex-lg-row align-items-md-start">
            <the-employees title="Employees">
                <template #default>
                    <team-member
                        v-for="e in employees"
                        @click="selectEmployee(e.id)"
                        :id="e.id"
                        :name="e.name"
                        :job="e.job"
                        :class="{selected : e.isSelected}">
                    </team-member>
                </template>
            </the-employees>

            <team-buttons
                :employeeId="getEmployeeId"
                :teamMemberId="getTeamMemberId"
                @move-employee="moveEmployeeToTeam"
                @move-teamMember="moveTeamMemberToEmployees">
            </team-buttons>

            <the-employees :title="getTeamName">
                <template #managers>
                    <div class="my-2">
                        <div>
                            <span>Team leader: </span><span>{{getTeamLeaderName}}</span>
                        </div>
                    </div>
                </template>
                <template #default>
                    <team-member
                        v-for="m in teamMembers"
                        @click="selectTeamMember(m.id)"
                        :key="m.id"
                        :id="m.id"
                        :name="m.name"
                        :job="m.job"
                        :class="{selected : m.isSelected}">
                    </team-member>
                </template>
            </the-employees>
        </div>
        <button v-if="componentName === 'CreateTeam'" @click="openModal" ref="saveTeamButton" class="btn btn-success my-4 align-self-start align-self-xl-end">Save team</button>
        <button v-if="componentName === 'EditTeam'" @click="openModal" ref="editTeamButton" class="btn btn-warning my-4 align-self-start align-self-xl-end">Edit team</button>
    </div>
</div>
</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";

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

import TheEmployees from './TheEmployees.vue';
import TeamMember from './TeamMember.vue';
import TeamButtons from './TeamButtons.vue';

export default {
    components: {
        TheEmployees,
        TeamMember,
        TeamButtons
    },

    props: [
            'componentName'
        ],

    emits: ['open-modal','change-key'],

    data() {
        return {
            selectedTeamId: 'empty',
            selectedTeam: null,
            enteredTeamName: '',
            teamNames: [],
            selectedEmployee: null,
            selectedTeamLeaderId: 'empty',
            selectedTeamLeader: null,
            selectedTeamMember: null,
            selectedProjectManager: null,
            employees: [],
            teams: [],
            teamLeaders: [],
            teamMembers: [],
            moveEmployeeToTeamButton: null,
            moveTeamMemberToEmployeesButton: null,
            teamNameExists: false
        }
    },

    watch: {

        enteredTeamName(name) {
            if(this.componentName === 'CreateTeam') {
                if(name === '')  {
                    this.teamNameExists = false;
                    $('#teamName').removeClass('is-valid');
                    $('#teamName').addClass('is-invalid');
                } else if(this.teams.find((team) => team.name === name)) {
                    this.teamNameExists = true;
                    $('#teamName').removeClass('is-valid');
                    $('#teamName').addClass('is-invalid');
                } else {
                    this.teamNameExists = false;
                    $('#teamName').removeClass('is-invalid');
                    $('#teamName').addClass('is-valid');
                }
            }

            if(this.componentName === 'EditTeam') {
                if(name === '')  {
                    this.teamNameExists = false;
                    $('#teamName').removeClass('is-valid');
                    $('#teamName').addClass('is-invalid');
                } else if(this.teamNames.find((team) => team.name === name)) {
                    this.teamNameExists = true;
                    $('#teamName').removeClass('is-valid');
                    $('#teamName').addClass('is-invalid');
                } else {
                    this.teamNameExists = false;
                    $('#teamName').removeClass('is-invalid');
                    $('#teamName').addClass('is-valid');
                }
            }
        },

        selectedTeamLeaderId(id) {
            if(id === 'empty') {
                $('#teamLeader').removeClass('is-valid');
                $('#teamLeader').addClass('is-invalid');
            }
            else {
                $('#teamLeader').removeClass('is-invalid');
                $('#teamLeader').addClass('is-valid');
            }

        },

        selectedTeamId(id) {
            if(id !== 'empty') {
                $('#teamName').removeClass('is-invalid');
                $('#teamName').addClass('is-valid');

                this.$refs.teamNameInput.disabled = false;
                this.$refs.teamLeaderSelect.disabled = false;

                this.selectedTeam = this.teams.find((team) => team.id === id);
                this.teamNames = this.teams.filter((team) => team.name !== this.selectedTeam.name);

                //gets employees and team leaders
                fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
                .then((response) => {
                    if(response.ok) {
                        return response.json();
                    }
                })
                .then((data) => {

                    this.employees = [];
                    this.teamLeaders = [];

                    for (const id in data) {
                        //gets employees
                        this.employees.push({
                            id: id,
                            name: data[id].name,
                            job: data[id].job,
                            isProjectManager: data[id].isProjectManager,
                            isTeamLeader: data[id].isTeamLeader,
                            isSelected: false,
                            isSelectedAsTeamLeader: false
                        });
                        //gets team leaders
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

                    if(this.selectedTeam) {             
                        this.enteredTeamName = this.selectedTeam.name;
                        this.selectedTeamLeaderId = this.selectedTeam.members.find((m) => m.isSelectedAsTeamLeader === true).id;
                        this.selectedTeamLeader = this.selectedTeam.members.find((m) => m.isSelectedAsTeamLeader === true);
                        this.teamMembers = this.selectedTeam.members;
                    }



                    this.teamMembers.forEach((t) => {
                        while(this.employees.find((e) => e.id === t.id)) {
                            const index = this.employees.findIndex((e) => e.id === t.id);
                            this.employees.splice(index,1);
                        }
                    });


                    this.employees.push(this.selectedTeamLeader);
                    //sorts employees by name
                    this.employees.sort(function(a,b) {
                        if ( a.name < b.name ){
                            return -1;
                        }
                        if ( a.name > b.name ){
                            return 1;
                        }
                        return 0;
                    });
                    //sorts team leaders by name
                    this.teamLeaders.sort(function(a,b) {
                        if ( a.name < b.name ){
                            return -1;
                        }
                        if ( a.name > b.name ){
                            return 1;
                        }
                        return 0;
                    });
                });
            } else {
                //rerenders component if a team is not selected
                this.$emit('change-key');
            }
        },
    },

    computed: {
        getTeamName() {
            if(this.enteredTeamName === '') {
                return 'Your team name';
            } else {
                return this.enteredTeamName;
            }
        },

        getTeamLeaderName() {
            if(this.selectedTeamLeader) {
                return this.selectedTeamLeader.name;
            } else {
                return 'none';
            }
        },

        getEmployeeId() {
            if(this.selectedEmployee) {
                return this.selectedEmployee.id;
            } else {
                'none';
            }
        },

        getTeamMemberId() {
            if(this.selectedTeamMember) {
                return this.selectedTeamMember.id;
            } else {
                return 'none';
            }
        }
    },

    mounted() {

        //inits disabled properties for team name input and team leader select in EditTeam component
        if(this.componentName === 'EditTeam') {
            this.$refs.teamNameInput.disabled = true;
            this.$refs.teamLeaderSelect.disabled = true;
        }

        //gets employees and team leaders
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {

            this.employees = [];
            this.teamLeaders = [];

            for (const id in data) {
                //gets employees
                this.employees.push({
                    id: id,
                    name: data[id].name,
                    job: data[id].job,
                    isProjectManager: data[id].isProjectManager,
                    isTeamLeader: data[id].isTeamLeader,
                    isSelected: false,
                    isSelectedAsTeamLeader: false
                });
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

                //sorts employees by name
                this.employees.sort(function(a,b) {
                    if ( a.name < b.name ){
                        return -1;
                    }
                    if ( a.name > b.name ){
                        return 1;
                    }
                    return 0;
                });
                //sorts team leaders by name
                this.teamLeaders.sort(function(a,b) {
                    if ( a.name < b.name ){
                        return -1;
                    }
                    if ( a.name > b.name ){
                        return 1;
                    }
                    return 0;
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
                    name: data[id].name,
                    job: data[id].job,
                    members: data[id].members,
                });
            }
        });

    },

    methods: {

        openModal() {
            if(this.componentName === 'CreateTeam') {
                this.$emit('open-modal',
                    this.enteredTeamName,
                    this.teamMembers,
                    this.selectedTeamLeaderId
                );
            }

            if(this.componentName === 'EditTeam') {
                this.$emit('open-modal',
                    this.enteredTeamName,
                    this.teamMembers,
                    this.selectedTeamLeaderId,
                    this.selectedTeamId
                );
            }
        },

        setTeamName(e) {
            this.enteredTeamName = e.target.value;
        },

        selectEmployee(id) {
            this.teamMembers.forEach((tm) => {
                if(tm.isSelected === true && tm.isSelectedAsTeamLeader === false) {
                    tm.isSelected = false;
                }
            });

            if(this.moveEmployeeToTeamButton !== null) {
                this.moveEmployeeToTeamButton.disabled = false
                this.moveTeamMemberToEmployeesButton.disabled = true;
            }

            //removes selected class from previous choosen employee
            while(this.employees.find((m) => m.isSelected === true &&  m.isSelectedAsTeamLeader === false)) {
                const index = this.employees.findIndex((m) => m.isSelected === true && m.isSelectedAsTeamLeader === false);
                this.employees[index].isSelected = false;
            }
            //adds selected class to choosen employee
            this.selectedEmployee = this.employees.find((e) => e.id === id);
            this.selectedEmployee.isSelected = true;
        },

        selectTeamMember(id) {
            this.employees.forEach((e) => {
                if(e.isSelected === true && e.isSelectedAsTeamLeader === false) {
                    e.isSelected = false;
                }
            });

            if(this.moveTeamMemberToEmployeesButton !== null) {
                this.moveEmployeeToTeamButton.disabled = true;
                this.moveTeamMemberToEmployeesButton.disabled = false;
            }

            //removes selected class from previous choosen team member
            while(this.teamMembers.find((m) => m.isSelected === true && m.isSelectedAsTeamLeader === false)) {
                const index = this.teamMembers.findIndex((m) => m.isSelected === true && m.isSelectedAsTeamLeader === false);
                this.teamMembers[index].isSelected = false;
            }
            //adds selected class to choosen team member
            this.selectedTeamMember = this.teamMembers.find((m) => m.id === id);
            this.selectedTeamMember.isSelected = true;
        },

        //moves employee to team
        moveEmployeeToTeam(id,moveEmployeeToTeamButton,moveTeamMemberToEmployeesButton) {
            const employee = this.employees.find((e) => e.id === id);
            const index = this.employees.findIndex((e) => e.id === id);
            this.employees.splice(index,1);
            employee.isSelected = false;
            employee.isTeamMember = true;
            this.teamMembers.push(employee);
            this.moveEmployeeToTeamButton = moveEmployeeToTeamButton;
            this.moveTeamMemberToEmployeesButton = moveTeamMemberToEmployeesButton;

            //sorts by team leader in team members
            this.teamMembers.sort(function(x,y) {
                return (x === y) ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
            });
        },

        //moves team member to employees
        moveTeamMemberToEmployees(id) {
            const teamMember = this.teamMembers.find((m) => m.id === id);
            teamMember.isSelected = false;
            teamMember.isTeamMember = false;
            const index = this.teamMembers.findIndex((m) => m === teamMember);
            this.teamMembers.splice(index,1);
            this.employees.push(teamMember);

            //sorts by team leader in employees to choose
            this.employees.sort(function(x,y) {
                return (x === y) ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
            });
        },

        selectTeamLeader() {
            //sets move buttons to disabled state
            if(this.moveEmployeeToTeamButton !== null && this.moveTeamMemberToEmployeesButton !== null) {
                this.moveEmployeeToTeamButton.disabled = true;
                this.moveTeamMemberToEmployeesButton.disabled = true;
            }

            this.employees.forEach((e) => {
                if(!e.isSelectedAsTeamLeader) {
                    e.isSelected = false;
                }
            })

            this.teamMembers.forEach((m) => {
                if(!m.isSelectedAsTeamLeader) {
                    m.isSelected = false;
                }
            })
            
            const selectedTeamLeaderId = this.selectedTeamLeaderId;
            
            if(selectedTeamLeaderId !== 'empty') {

                this.selectedTeamLeader = this.employees.find((e) => e.id === selectedTeamLeaderId);

                //resets employees properties to false
                this.employees.forEach((e) => {
                    e.isSelected = false;
                    e.isSelectedAsTeamLeader = false;
                });

                /**
                 * looks for selected team leader in employees to choose first,
                 * if does not find selected team leader in employees looks for one in team members
                 */
                if(this.employees.find((e) => e.id === selectedTeamLeaderId)) {
                    //takes difference between teamMembers and employess arrays
                    let newTeamMembersArray = this.teamMembers.filter(x => !this.employees.includes(x));
                    this.teamMembers = newTeamMembersArray;

                    const teamLeader = this.employees.find((e) => e.id === selectedTeamLeaderId);
                    this.selectedTeamLeader = teamLeader;
                    teamLeader.isSelected = true;
                    teamLeader.isTeamMember = true;
                    teamLeader.isSelectedAsTeamLeader = true;
                    this.teamMembers.push(teamLeader);
                } else {
                    //takes difference between employess and teamMembers arrays
                    let newEmployeesArray = this.employees.filter(x => !this.teamMembers.includes(x));
                    this.employees = newEmployeesArray;

                    const teamLeader = this.teamMembers.find((tm) => tm.id === selectedTeamLeaderId);teamLeader.isTeamMember = true;
                    this.selectedTeamLeader = teamLeader;
                    teamLeader.isSelected = true;
                    teamLeader.isTeamMember = true;
                    teamLeader.isSelectedAsTeamLeader = true;
                    this.employees.push(teamLeader);
                }
            } else {
                
                while(this.employees.find((e) => e.isSelectedAsTeamLeader === true)) {
                    const index = this.employees.findIndex((e) => e.isSelectedAsTeamLeader === true);
                    this.employees.splice(index,1);
                }

                while(this.teamMembers.find((member) => member.isSelectedAsTeamLeader === true)) {
                    const index = this.teamMembers.findIndex((member) => member.isSelectedAsTeamLeader === true);
                    this.teamMembers[index].isSelected = false;
                    this.teamMembers[index].isSelectedAsTeamLeader = false;
                }

                this.selectedTeamLeader = null;
            }

            //sorts by team leader in employees to choose
            this.employees.sort(function(x,y) {
                return (x === y) ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
            });

            //sorts by team leader in team members
            this.teamMembers.sort(function(x,y) {
                return (x === y) ? 0 : x.isSelectedAsTeamLeader ? -1 : 1;
            });

        },


    },
}

</script>