<template>
    <section class="row mx-0 d-flex flex-column">
        <div class="h4 my-4">List of teams</div>
        <table class="table table-striped col-xl-6">
            <thead>
                <tr>
                    <th scope="col">Team name</th>
                    <th scope="col">Team leader</th>
                </tr>
            </thead>
            <tbody>
                <TheTeam
                    v-for="team in teams"
                    :key="team.id"
                    :teamId="team.id"
                    :name="team.name"
                    :projectManager="team.projectManager"
                    :teamLeader="team.teamLeader"
                    :members="team.teamMembers"
                />
            </tbody>
        </table>
    </section>
</template>

<script>

import TheTeam from './../view-components/team/TheTeam.vue';

export default {
    components: {
        TheTeam
    },

    data() {
        return {
            teams: [],
        }
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json')
        .then((response) => response.json())
        .then((data) => {
            for(const id in data) {
                this.teams.push({
                    id: id,
                    name: data[id].name,
                    projectManager: data[id].members.find((x) => x.isSelectedAsProjectManager === true),
                    teamLeader: data[id].members.find((x) => x.isSelectedAsTeamLeader === true),
                    teamMembers: data[id].members
                });
            }
        });
    },
}

</script>