<template>
    <tr @click="selectEmployee">
        <td>{{name}}</td>
        <td>{{job}}</td>
    </tr>
</template>

<script>

export default {
    props: ['id','name','job'],

    emits: ['select-member'],

    methods: {
        selectEmployee() {
            this.$emit('select-member',this.id);
        }
    }
}

</script>

<style scoped>
.selected {
    pointer-events: none;
    background-color: #6c757d;
}
</style>