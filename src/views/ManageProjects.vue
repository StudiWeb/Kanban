<template>
    <div class="row">
       <div class="h3 ml-2">Manage projects</div> 
    </div>
    <div class="row mt-4">
        <ul class="nav nav-pills">
            <li class="nav-item">
                <button @click="setPage('projects-list','list')" id="list" class="nav-link active-list ml-2">List of projects</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('add-project','add')" id="add" class="nav-link" href="#">Add project</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('edit-project','edit')" id="edit" class="nav-link" href="#">Configure project</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('delete-project','delete')" id="delete" class="nav-link">Delete project</button>
            </li>
        </ul>
    </div>
    <component :is="page" :key="componentKey" @change-key="changeKey"></component>
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
        }
    }
}

</script>