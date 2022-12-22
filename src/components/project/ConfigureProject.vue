<template>
    <section class="row flex-column mx-0">
        <div class="px-0 col-xl-6">
            <div class="h4 my-4">Configure project</div>
        </div>
        <div class="px-0 col-xl-6 form-group">
            <label>Select project</label>
            <select v-model="selectedProjectId" @change="forceRender" class="form-control">
                <option value="empty"></option>
                <option v-for="p in projects" :key="p.id" :value="p.id">{{p.name}}</option>
            </select>
        </div>
        <div v-if="isProjectSelected">
            <div class="col-xl-6 px-0">
                <ul class=" my-4 nav nav-tabs">
                    <li class="nav-item">
                        <button @click="setButtonActive(1)" data-toggle="dropdown" class="nav-link active dropdown-toggle">Project</button>
                        <div class="dropdown-menu">
                            <a @click="setComponent('project-configuration')" class="dropdown-item" href="#">Project configuration</a>
                            <a @click="setComponent('edit-project')" class="dropdown-item" href="#">Edit project data</a>
                        </div>
                    </li>
                    <li class="nav-item">
                        <button @click="setButtonActive(2)" data-toggle="dropdown" class="nav-link dropdown-toggle">Tasks</button>
                        <div class="dropdown-menu">
                            <a @click="setComponent('task-lists')" class="dropdown-item" href="#">Task lists</a>
                            <a @click="setComponent('create-task')" class="dropdown-item" href="#">Create task</a>
                            <a @click="setComponent('edit-task')" class="dropdown-item" href="#">Edit task</a>
                            <a @click="setComponent('delete-task')" class="dropdown-item" href="#">Delete task</a>
                        </div>
                    </li>
                </ul>
            </div>
            <div>
                <component 
                    :selectedProjectId="selectedProjectId" 
                    :is="componentName" 
                    :key="componentKey">
                </component>
            </div>
        </div>
    </section>
</template>

<script>

import ProjectConfiguration from './project-config/ProjectConfiguration.vue';
import EditProject from './project-config/EditProject.vue';
import CreateTask from './project-config/CreateTask.vue';
import TaskLists from './project-config/TaskLists.vue';
import DeleteTask from './project-config/DeleteTask.vue';
import EditTask from './project-config/EditTask.vue';

export default {

    components: {
        ProjectConfiguration,
        EditProject,
        TaskLists,
        CreateTask,
        DeleteTask,
        EditTask
    },

    data() {
        return {
            selectedProjectId: 'empty',
            projects: [],
            componentName: 'project-configuration',
            isProjectSelected: false,
            componentKey: 0
        }
    },

    watch: {
        selectedProjectId(newValue) {
            if(newValue !== 'empty') {
                this.isProjectSelected = true;
            } else {
                this.isProjectSelected = false;
            }
        },
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json')
        .then((response) => response.json())
        .then((data) => {
            for(const id in data) {
                this.projects.push({
                    id: id,
                    name: data[id].name,
                    projectManager: data[id].projectManager,
                    startDate: data[id].startDate,
                    endDate: data[id].endDate,
                    team: data[id].team,
                });
            }
        });
    },

    methods: {
        setComponent(name) {
            this.componentName = name;
        },

        setButtonActive(number) {
            $('.nav-link').each( function() {
                $(this).removeClass('active');
            });
            const selector = 'ul li:nth-child(' + number +') button';
            $(selector).addClass('active');
        },

        forceRender() {
            this.componentKey += 1;
        }
    }

}

</script>