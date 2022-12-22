<template>
    <sidebar-menu>
        <sidebar-heading>STAFF</sidebar-heading>
        <list-column>
            <NavItem title="Manage employees" page="manage-employees"/>
            <NavItem title="Manage teams" page="manage-teams"/>
        </list-column>
        <sidebar-heading>PROJECT MANAGMENT</sidebar-heading>
        <list-column>
            <NavItem title="Manage projects" page="manage-projects" />
        </list-column>
        <sidebar-heading>PROJECTS</sidebar-heading>
        <list-column>
            <NavItem title="Project XYZ" page="projects/p1"/>
        </list-column>
    </sidebar-menu>
</template>

<script>

import NavItem from './NavItem.vue'
import SidebarMenu from '../UI/SidebarMenu.vue'
import ListColumn from '../UI/ListColumn.vue'
import SidebarHeading from '../UI/SidebarHeading.vue'

export default {
    components: { 
        NavItem,
        SidebarMenu,
        ListColumn,
        SidebarHeading
    }
}

</script>