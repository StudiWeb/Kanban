<template>
    <section class="row mx-0 d-flex flex-column">
        <div class="h5 my-4">List of teams</div>
        <div v-if="numberOfTeams === 0" class="d-flex align-items-center alert alert-info col-xl-6" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <div class="ml-2">There are no any teams.</div>
        </div>
        <table v-else class="table table-striped col-xl-6">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Team name</th>
                    <th scope="col">Team leader</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(team,index) in teams" @mouseover="showTooltip(team.id)" class="team" rel="tooltip" data-toggle="tooltip" data-html="true" data-placement="bottom" :title="tooltip">
                    <td>{{++index}}</td>
                    <td>{{team.name}}</td>
                    <td>{{team.teamLeader.name}}</td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script>

export default {

    data() {
        return {
            teams: [],
            numberOfTeams: 0,
            tooltip: ''
        }
    },

    mounted() {
        $(function () {
            $('[data-toggle="tooltip"]').tooltip();
            $('body').tooltip({
                selector: '[rel="tooltip"]'
            });
        });

        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/teams.json')
        .then((response) => response.json())
        .then((data) => {
            for(const id in data) {
                this.teams.push({
                    id: id,
                    name: data[id].name,
                    projectManager: data[id].members.find((x) => x.isSelectedAsProjectManager === true),
                    teamLeader: data[id].members.find((x) => x.isSelectedAsTeamLeader === true),
                    members: data[id].members
                });
            }
            this.numberOfTeams = this.teams.length;
        });
    },

    methods: {
        showTooltip(teamId) {
            if(this.teams.length > 0) {
                this.tooltip = '<div class="font-weight-bold">Team members</div>';
                const members = this.teams.find((team) => team.id === teamId).members;
                members.forEach((m) => {
                    let job =  m.isSelectedAsTeamLeader ? m.job + '<span class="font-weight-bold">' + ' (TL)' + '</span>' : m.job;
                    this.tooltip += '<div class="my-2">' + m.name +' - ' + '<span>' + job + '</span>' + '</div>'
                });
            }
        },
    }

}

</script>

<style scoped>

.team:hover {
    cursor: pointer;
}

</style>