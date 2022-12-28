<template>
    <section class="row flex-column mx-0">
        <div class="col-xl-6 px-0">
            <div class="h5 my-4">List of projects</div>
        </div>
        <div class="col-xl-6 px-0">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Project name</th>
                        <th scope="col">Project manager</th>
                        <th scope="col">Team</th>
                        <th scope="col">Start date</th>
                        <th scope="col">End date</th>
                    </tr>
                </thead>
                <tbody>
                    <ProjectListItem
                        v-for="p in projects" 
                        :key="p.id"
                        :projectName="p.name"
                        :projectManager="p.projectManager.name"
                        :teamName="p.team.name"
                        :startDate="p.startDate"
                        :endDate="p.endDate"
                        :members="p.team.members"
                    />
                </tbody>
            </table>
        </div>
    </section>
</template>

<script>

import ProjectListItem from '../view-components/ProjectListItem.vue';

export default {

    components: {
        ProjectListItem
    },

    data() {
        return {
            projects: []
        }
    },

    mounted() {
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
}

</script>