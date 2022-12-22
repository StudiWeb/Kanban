<template>
    <div class="card my-2" style="width: 240px;">
    <div class="card-header d-flex justify-content-between align-items-baseline">
        <p class="h6">{{title}}</p>
        <button @click="showTask" type="button" class="btn btn-primary px-2 py-1">
                <svg v-if="showTaskDetails === false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                </svg>
                </button>
    </div>
    <div v-if="showTaskDetails" class="card-body d-flex flex-column">
        <div><span class="font-weight-bold">Employee: </span>Michal Michaczu</div>
        <div class="d-flex justify-content-between align-items-baseline flex-wrap">
            <span class="font-weight-bold">Task description</span>
            <button @click="showDescription" type="button" class="btn btn-primary px-2 py-1">
                <svg v-if="showTaskDescription === false" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
                    <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
                </svg>
                </button>
                <p v-if="showTaskDescription" class="col-12 my-2 border border-primary">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum volutpat aliquam molestie. Maecenas auctor eu mauris quis sollicitudin.</p>
        </div>
        <div><span class="font-weight-bold">Start date: </span>01/10/2022</div>
        <div><span class="font-weight-bold">End date: </span>01/01/2023</div>
    </div>
    </div>
</template>

<script>

export default {
    props: ['title'],

    data() {
        return {
            showTaskDetails: false,
            showTaskDescription: false
        }
    },

    methods: {
        showTask() {
            this.showTaskDetails = !this.showTaskDetails
        },

        showDescription() {
            this.showTaskDescription = !this.showTaskDescription
        }
    }
}

</script>