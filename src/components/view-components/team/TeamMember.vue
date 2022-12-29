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

tr:hover {
    cursor: pointer;
    background-color: #73c586;
}

.selected {
    color: #fff;
    background-color: #73c586;
}

.selectedAsTeamLeader {
    pointer-events: none;
    color: #fff;
    background-color: #28a745;
}

</style>