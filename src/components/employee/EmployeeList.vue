<template>
    <section class="row mx-0 d-flex flex-column">
        <div class="col-xl-6 px-0">
            <div class="h5 my-4">List of employees</div>
        </div>
        <div v-if="numberOfEmployees === 0" class="d-flex align-items-center alert alert-info col-xl-6" role="alert">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-exclamation-octagon" viewBox="0 0 16 16">
                <path d="M4.54.146A.5.5 0 0 1 4.893 0h6.214a.5.5 0 0 1 .353.146l4.394 4.394a.5.5 0 0 1 .146.353v6.214a.5.5 0 0 1-.146.353l-4.394 4.394a.5.5 0 0 1-.353.146H4.893a.5.5 0 0 1-.353-.146L.146 11.46A.5.5 0 0 1 0 11.107V4.893a.5.5 0 0 1 .146-.353L4.54.146zM5.1 1 1 5.1v5.8L5.1 15h5.8l4.1-4.1V5.1L10.9 1H5.1z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
            </svg>
            <div class="ml-2">There are no any employees.</div>
        </div>
        <table v-else class="col-xl-6 table table-striped">
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
            numberOfEmployees: 0
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
            for (const id in data) {
                this.employees.push({ 
                    name: data[id].name,
                    job: data[id].job,
                    isProjectManager: data[id].isProjectManager,
                    isTeamLeader: data[id].isTeamLeader,
                });
            }
            this.numberOfEmployees = this.employees.length;
        })
    } 
}

</script>