<template>
    <div class="h4 my-4">Create team</div>
    <div class="col-xl-6 px-0 form-group">
        <label>Team name</label>
        <input @input="setTeamName" type="text" class="form-control">
    </div>
    <div class="col-xl-6 px-0 form-group">
        <label>Project manager</label>
        <select @change="selectProjectManager" class="form-control">
            <option selected value="empty"></option>
            <option v-for="pm in projectManagers" :key="pm.id" :value="pm.id">{{pm.name}}</option>
        </select>
    </div>
    <div class="col-xl-6 px-0 form-group">
        <label>Team leader</label>
        <select @change="selectTeamLeader" class="form-control">
            <option selected value="empty"></option>
            <option v-for="tl in teamLeaders" :key="tl.id" :value="tl.id">{{tl.name}}</option>
        </select>
    </div>
</template>

<script>

export default {

    props: ['projectManagers','teamLeaders'],

    emits: ['team-name','project-manager','team-leader'],

    methods: {
        setTeamName(e) {
            this.$emit('team-name',e.target.value);
        },

        selectProjectManager(e) {
            this.$emit('project-manager',e.target.value);
        },

        selectTeamLeader(e) {
            this.$emit('team-leader',e.target.value);
        }
    }

}

</script>