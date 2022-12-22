<template>
    <div class="row mb-4">
        <div class="d-flex flex-wrap">
            <base-button @click="setPage('projects-list')" class="m-2 btn-primary">LIST OF PROJECTS</base-button>
            <base-button @click="setPage('add-project')" class="m-2 btn-success">ADD PROJECT</base-button>
            <base-button @click="setPage('edit-project')" class="m-2 btn-warning">CONFIGURE PROJECT</base-button>
            <base-button @click="setPage('delete-project')" class="m-2 btn-danger">DELETE PROJECT</base-button>
        </div>
    </div>
    <component :is="page" :key="componentKey"></component>
</template>

<script>

import ProjectsList from './../components/project/ProjectsList.vue';
import AddProject from './../components/project/AddProject.vue';
import EditProject from './../components/project/ConfigureProject.vue';
import DeleteProject from './../components/project/DeleteProject.vue';

export default {
    components: {
        AddProject,
        ProjectsList,
        EditProject,
        DeleteProject
    },

    data() {
        return {
            page: 'projects-list',
            componentKey: 0
        }
    },

    methods: {
        setPage(cmp) {
            this.page = cmp;
        },

        changeKey() {
            this.componentKey += 1;
        }
    }
}

</script>