<template>
    <section class="row flex-column mx-0">
        <div class="col-xl-6 px-0">
            <div class="h5 my-4">List of projects</div>
        </div>
        <div v-if="numberOfProjects === 0" class="d-flex align-items-center alert alert-info col-xl-6" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <div class="ml-2">There are no any projects.</div>
        </div>
        <div v-else class="col-xl-6 px-0">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Project name</th>
                        <th scope="col">Project manager</th>
                        <th scope="col">Team</th>
                        <th scope="col">Start date</th>
                        <th scope="col">End date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(p,index) in projects" :key="p.id" @mouseover="showTooltip(p.id)" class="project" rel="tooltip" data-html="true" data-toggle="tooltip" data-placement="bottom" :title="tooltip">
                        <td>{{++index}}</td>
                        <td>{{p.name}}</td>
                        <td>{{p.projectManager.name}}</td>
                        <td>{{p.team.name}}</td>
                        <td>{{p.startDate}}</td>
                        <td>{{p.endDate}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>

export default {

    data() {
        return {
            projects: [],
            numberOfProjects: 0,
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
            this.numberOfProjects = this.projects.length;
        });
    },

    methods: {
        showTooltip(projectId) {
            if(this.projects.length > 0) {
                this.tooltip = '<div class="font-weight-bold">Project members</div>';
                const members = this.projects.find((project) => project.id === projectId).team.members;
                members.forEach((m) => {
                    let job =  m.isSelectedAsProjectManager ? m.job +  ' <span class="font-weight-bold">' + '(PM) ' + '</span>' : m.job;
                    job += m.isSelectedAsTeamLeader ? '<span class="font-weight-bold">' + '(TL) ' + '</span>' : '';
                    this.tooltip += '<div class="my-2">' + m.name +' - ' + '<span>' + job + '</span>' + '</div>'
                });
            }
        },
    }
}

</script>

<style scoped>

.project:hover {
    cursor: pointer;
}

</style>