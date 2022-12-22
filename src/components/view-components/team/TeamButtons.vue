<template>
    <div class="d-flex flex-column align-self-center align-items-center m-3">
        <button @click="moveEmployeeToTeam" id="moveToTeam" ref="moveEmployeeToTeamButton" type="button" class="btn btn-secondary my-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
            </svg>
        </button>
        <button @click="moveTeamMemberToEmployees" id="moveToEmployees" ref="moveTeamMemberToEmployeesButton" type="button" class="btn btn-secondary my-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 4 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
        </button>
    </div>
</template>

<script>

export default {

    props: ['employeeId','teamMemberId','selectedMoveButton'],

    watch: {
        employeeId(id) {
            if(id !== 'none') {
                this.$refs.moveEmployeeToTeamButton.disabled = false;
                if(this.$refs.moveTeamMemberToEmployeesButton.disabled === false) {
                    this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
                }

            }
        },

        teamMemberId(id) {
            if(id !== 'none') {
                this.$refs.moveTeamMemberToEmployeesButton.disabled = false;
                if(this.$refs.moveEmployeeToTeamButton.disabled === false) {
                    this.$refs.moveEmployeeToTeamButton.disabled = true;
                }
            }
        },

    },

    mounted() {
        this.$refs.moveEmployeeToTeamButton.disabled = true;
        this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
    },

    methods: {
        moveEmployeeToTeam() {
            this.$refs.moveEmployeeToTeamButton.disabled = true;
            this.$emit('move-employee',this.employeeId,this.$refs.moveEmployeeToTeamButton,this.$refs.moveTeamMemberToEmployeesButton);
        },

        moveTeamMemberToEmployees() {
            this.$refs.moveTeamMemberToEmployeesButton.disabled = true;
            this.$emit('move-teamMember',this.teamMemberId);
        }
    },
}

</script>

<style scoped>

.btn {
    height: 40px;
    width: 50px;
}

</style>