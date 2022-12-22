<template>
    <div class="row mb-4">
        <div class="px-0 d-flex flex-wrap">
            <base-button @click="setPage('team-list')" class="m-2 btn-primary">LIST OF TEAMS</base-button>
            <base-button @click="setPage('create-team')" class="m-2 btn-success">CREATE TEAM</base-button>
            <base-button @click="setPage('edit-team')" class="m-2 btn-warning">EDIT TEAM</base-button>
            <base-button @click="setPage('delete-team')" class="m-2 btn-danger">DELETE TEAM</base-button>
        </div>
    </div>
    <component
        :is="page"
        @change-key="changeKey" 
        :key="componentKey">
    </component>
</template>

<script>

import TeamList from '../components/team/TeamList.vue';
import CreateTeam from '../components/team/AddTeam.vue';
import EditTeam from '../components/team/EditTeam.vue';
import DeleteTeam from '../components/team/DeleteTeam.vue';

export default {
    components: { 
        TeamList,
        CreateTeam,
        EditTeam,
        DeleteTeam
    },

    data() {
        return {
            page: 'team-list',
            componentKey: 0,
        }
    },

    methods: {
        setPage(cmp) {
            this.page = cmp;
        },

        changeKey() {
            this.componentKey += 1;
        },
    }
}

</script>
