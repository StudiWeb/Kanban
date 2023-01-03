<template>
    <tr @click="selectEmployee">
        <td>{{name}}</td>
        <td>{{job}}</td>
    </tr>
</template>

<script>

export default {
    props: ['id','name','job','class'],

    emits: ['select-member'],

    methods: {
        selectEmployee() {
            this.$emit('select-member',this.id);
        }
    }
}

</script>

<style scoped>

tr:hover {
    cursor: pointer;
}

tr[class=""]:hover {
    cursor: pointer;
    background-color: #f8f9fa;
}

.selectedToMove {
    color: #fff;
    background-color: #28a745;
}

.selectedToMove:hover {
    color: #fff;
    background-color: #28a745;
}

.selectedToDelete {
    color: #fff;
    background-color: #dc3545;
}

</style>