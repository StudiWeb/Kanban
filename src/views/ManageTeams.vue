<template>
    <div class="row">
       <div class="h3 ml-2">Manage teams</div> 
    </div>
    <div class="row mt-4">
        <ul class="nav nav-pills">
            <li class="nav-item">
                <button @click="setPage('team-list','list')" id="list" class="nav-link active-list ml-2">List of teams</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('create-team','add')" id="add" class="nav-link" href="#">Add team</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('edit-team','edit')" id="edit" class="nav-link" href="#">Edit team</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('delete-team','delete')" id="delete" class="nav-link">Delete team</button>
            </li>
        </ul>
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
        setPage(page,tab) {

            $('button.nav-link').each(function() {
                $(this).removeClass('active-list');
                $(this).removeClass('active-add');
                $(this).removeClass('active-edit');
                $(this).removeClass('active-delete');
            });

            switch(tab) {
                case 'list':
                    $('#list').addClass('active-list');
                    break;
                case 'add':
                    $('#add').addClass('active-add');
                    break;
                case 'edit':
                    $('#edit').addClass('active-edit');
                    break;
                case 'delete':
                    $('#delete').addClass('active-delete');
                    break;
            }

            this.page = page;
        },

        changeKey() {
            this.componentKey += 1;
        },
    }
}

</script>
