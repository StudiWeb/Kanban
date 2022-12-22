<template>
    <tr data-html="true" data-toggle="tooltip" data-placement="bottom" :title="getTeamMembers">
        <td>{{projectName}}</td>
        <td>{{projectManager}}</td>
        <td>{{teamName}}</td>
        <td>{{startDate}}</td>
        <td>{{endDate}}</td>
    </tr>
</template>

<script>

export default {
    props: ['projectName','projectManager','teamName','startDate','endDate','members'],

    mounted() {
        //to show tooltip
        $('[data-toggle="tooltip"]').tooltip();
        console.log(this.members)
    },

    computed: {
        getTeamMembers() {
            if(this.members) {

                let tooltip = '<div class="card bg-light"><div class="card-body">';
                let name = '';
                let job = '';

                this.members.forEach((m) => {
                    name = m.name;
                    if (m.isSelectedAsProjectManager === true && m.isSelectedAsTeamLeader === true) {
                        job = m.job + ' <b>(PM)</b> ' + '<b>(TL)</b>';
                    } 
                    else if(m.isSelectedAsProjectManager === true) {
                        job = m.job + ' <b>(PM)</b>';
                    } 
                    else if (m.isSelectedAsTeamLeader === true) {
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
    }



}

</script>