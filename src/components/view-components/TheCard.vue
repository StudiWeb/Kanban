<template>
    <div class="card p-0" style="min-height: 480px; max-height: 640px;">
        <div class="card-header h5 text-center text-uppercase">{{title}}</div>
        <div class="card-body d-flex flex-column align-items-center">
            <slot></slot>
        </div>
    </div>
</template>

<script>

export default {
    props: ['title'],
}

</script>

<style scoped>

.card-body {
    overflow-y: scroll;
}

</style>