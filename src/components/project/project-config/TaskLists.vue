<template>
    <div class="col-xl-6 px-0">
        <div class="h5 my-3">List of tasks</div>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Description</th>
                    <th scope="col">Employees</th>
                    <th scope="col">Start date</th>
                    <th scope="col">End date</th>
                    <th scope="col">Status</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="task in tasks">
                    <td>{{task.name}}</td>
                    <td>{{task.description}}</td>
                    <td>
                        <div v-if="task.employees === 'none'">none</div>
                        <div v-else class="my-1" v-for="e in task.employees" :key="e.id">{{e.name}} - <span class="font-italic">{{e.job}}</span></div>
                    </td>
                    <td>{{task.startDate}}</td>
                    <td>{{task.endDate}}</td>
                    <td>{{task.status}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

export default {
    props: ['selectedProjectId'],

    data() {
        return{
            tasks: []
        };
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            for(const id in data) {
                if(id === this.selectedProjectId) {
                    for(const t in data[id].tasks) {
                        this.tasks.push(data[id].tasks[t]);
                    }
                }             
            }
        });
    },

}

</script>