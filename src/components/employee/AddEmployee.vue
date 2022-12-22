<template>
    <section class="row flex-column mx-0">
        <div class="col-xl-6 px-0">
                <div class="h4 my-4 px-0">Add employee</div>
            </div>
        <div class="card col-xl-6 px-0">
            <div class="card-body">
                <form @submit.prevent="openModal">
                    <div class="form-group">
                        <label for="name">Name</label>
                        <input v-model="name" type="text" class="form-control" id="name">
                        <div class="invalid-feedback">This field cannot be empty!</div>
                    </div>
                    <div class="form-group">
                        <label for="job-position">Job position</label>
                        <input v-model="job" type="text" class="form-control" id="job-position">
                        <div class="invalid-feedback">This field cannot be empty!</div>
                    </div>
                    <div class="form-check">
                        <input v-model="isProjectManager" class="form-check-input" type="checkbox" value="" id="project-manager">
                        <label class="form-check-label" for="project-manager">Project manager</label>
                    </div>
                    <div class="form-check">
                        <input v-model="isTeamLeader" class="form-check-input" type="checkbox" value="" id="team-leader">
                        <label class="form-check-label" for="team-leader">Team leader</label>
                    </div>
                    <div class="form-check px-0 my-2">
                        <button data-target="#modal" class="btn btn-success" type="submit">Add employee</button>
                    </div>
                </form>
            </div>
        </div>
        <teleport to="body">
        <base-modal>
            <template #header>
                Adding new employee
            </template>
                <template #body>
                    <p><span class="font-weight-bold">Name:</span>  {{name}}</p>
                    <p><span class="font-weight-bold">Job position:</span>  {{job}}</p>
                    <p><span class="font-weight-bold">Project manager:</span> {{isProjectManager ? 'Yes' : 'No'}}</p>
                    <p><span class="font-weight-bold">Team leader:</span> {{isTeamLeader ? 'Yes' : 'No'}}</p>
                </template>
                <template #footer>
                    <div class="d-flex justify-content-between align-items-baseline">
                        Are you sure do you want to add this employee?
                        <div>
                            <button @click="createEmployee" class="btn btn-success mr-2">Yes</button>
                            <button @click="closeModal" class="btn btn-primary">No</button>
                        </div>
                    </div>
                </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-modal id="serverResponseModal" data-backdrop="static">
            <template #header>Server response</template>
            <template #body>You have just added a new employee to app successfully!</template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="closeServerResponseModal" class="btn btn-primary">Ok</button>
                </div>
            </template>
        </base-modal>
    </teleport>
    </section>
</template>

<script>

export default {

    emits: ['change-key'],

    data() {
        return {
            name: '',
            job: '',
            isProjectManager: false,
            isTeamLeader: false,
            hasFirebaseErrorOccurred: false,
        }
    },

    watch: {
        name(value) {
            if(value !== '') {
                $('#name').removeClass('is-invalid');
                $('#name').addClass('is-valid');
            } else {
                $('#name').removeClass('is-valid');
            }
        },

        job(value) {
            if(value !== '') {
                $('#job-position').removeClass('is-invalid');
                $('#job-position').addClass('is-valid');
            } else {
                $('#job-position').removeClass('is-valid');
            }
        },

        hasFirebaseErrorOccurred(value) {
            if(value) {
                $('#toast').toast('show');
            } else {
                $('#toast').toast('hide');
            }
        }
    },

    methods: {

        openModal() {
            if(this.name === '' && this.job === '') {
                $('#name').addClass('is-invalid');
                $('#job-position').addClass('is-invalid');
                $('#modal').modal('hide');
            } else if(this.name === '') {
                $('#name').addClass('is-invalid');
                $('#modal').modal('hide');
            } else if(this.job === '') {
                $('#job-position').addClass('is-invalid');
                $('#modal').modal('hide');
            } else {
                $('#modal').modal('show');
            }
        },

        createEmployee() {

            fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/employees.json',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name : this.name.trim(),
                    job: this.job.trim(),
                    isProjectManager: this.isProjectManager,
                    isTeamLeader: this.isTeamLeader,
                })
            })
            .then((response) => {
                this.name = '';
                this.job = '';
                this.isProjectManager = null;
                this.isTeamLeader = null;
            });

            $('#modal').modal('hide');
            $('#serverResponseModal').modal('show');
        },

        closeModal() {
            $('#modal').modal('hide');
        },

        closeServerResponseModal() {
            $('#serverResponseModal').modal('hide');
            this.$emit('change-key');
        }

    }
}

</script>