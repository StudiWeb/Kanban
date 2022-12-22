<template>
    <tr @mouseover="showTeamList" @mouseout="hideTeamList" data-html="true" data-toggle="tooltip" data-placement="bottom" :title="getTooltip">
        <td>{{name}}</td>
        <td>{{getTeamLeader}}</td>
    </tr>
</template>

<script>

export default {

    props: ['teamId','name','projectManager','teamLeader','members'],

    computed: {
        getProjectManager() {
            if(this.projectManager) {
                return this.projectManager.name;
            }
        },

        getTeamLeader() {
            if(this.teamLeader) {
                return this.teamLeader.name;
            }
        },

        getTooltip() {
            if(this.members) {
                //sorts by team leader
                this.members.sort(function(x,y) {
                    return (x === y) ? 0 : x.isSelectedAsTeamLeader ? -1 : 1
                });

                let tooltip = '<div class="card bg-light"><div class="card-body">';
                let name = '';
                let job = '';

                this.members.forEach((m) => {
                    name = m.name;
                    if(m.isSelectedAsTeamLeader === true) {
                        job = m.job + ' <b>(TL)</b>';
                    }
                    else {
                        job = m.job;
                    }

                    tooltip += '<p class="card-text">' + name + ' - ' + job +'</p>';
                });

                tooltip += '</div></div>';

                return tooltip;
            }
        },

        getMembersId() {
            if(teamId) {
                this.tooltipId = '#membersList' + teamId;
            }
        }
    },

    mounted() {
        $('[data-toggle="tooltip"]').tooltip();
    },
}

</script>

<style>
.tooltip-inner {
    min-width: 300px;
    color: #000;
    text-align: left;
    background-color: #f8f9fa; 
}

</style>