<template>
    <section class="mt-5 d-flex justify-content-around">
        <the-card title="To Do">
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
        </the-card>
        <the-card title="Doing">
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
        </the-card>
        <the-card title="Testing">
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
        </the-card>
        <the-card title="Done">
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
            <the-task title="xd"></the-task>
        </the-card>
    </section>
</template>

<script>

import TheTask from './../components/view-components/TheTask.vue'
import TheCard from './../components/view-components/TheCard.vue'

export default {

    components: {
        TheCard,
        TheTask
    }

}

</script>