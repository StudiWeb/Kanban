<template>
    <section class="row mx-0 d-flex flex-column">
        <div class="col-xl-6 px-0">
            <div class="h5 my-4">List of employees</div>
        </div>
        <table class="col-xl-6 table table-striped">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Job Position</th>
                    <th scope="col" class="text-center">Project Manager</th>
                    <th scope="col" class="text-center">Team Leader</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(e,index) in employees" :key="e.id">
                    <td>{{++index}}</td>
                    <td>{{e.name}}</td>
                    <td>{{e.job}}</td>
                    <td class="text-center">
                        <svg v-if="e.isProjectManager" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </td>
                    <td class="text-center">
                        <svg v-if="e.isTeamLeader" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16">
                            <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/>
                        </svg>
                    </td>
                </tr>
            </tbody>
        </table>
    </section>
</template>

<script>

export default {

    data() {
        return {
            employees: [],
        }
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json',{
        method: 'GET',
        })
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            const results = [];
            for (const id in data) {
                results.push({ 
                    name: data[id].name,
                    job: data[id].job,
                    isProjectManager: data[id].isProjectManager,
                    isTeamLeader: data[id].isTeamLeader,
                });
            }
            this.employees = results;
        })
    } 
}

</script>