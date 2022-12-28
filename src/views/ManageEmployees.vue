<template>
    <div class="row">
       <div class="h3 ml-2">Manage employees</div> 
    </div>
    <div class="row mt-4">
        <ul class="nav nav-pills">
            <li class="nav-item">
                <button @click="setPage('employee-list','list')" id="list" class="nav-link active-list ml-2">List of employees</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('add-employee','add')" id="add" class="nav-link" href="#">Add employee</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('edit-employee','edit')" id="edit" class="nav-link" href="#">Edit employee</button>
            </li>
            <li class="nav-item">
                <button @click="setPage('delete-employee','delete')" id="delete" class="nav-link">Delete employee</button>
            </li>
        </ul>
    </div>
    <component 
        :is="page" 
        :key="componentKey" 
        @change-key="changeKey">
    </component>
</template>

<script>

import AddEmployee from '../components/employee/AddEmployee.vue'
import EditEmployee from '../components/employee/EditEmployee.vue'
import DeleteEmployee from '../components/employee/DeleteEmployee.vue'
import EmployeeList from '../components/employee/EmployeeList.vue'

export default {
    components: {
        AddEmployee,
        EditEmployee,
        DeleteEmployee,
        EmployeeList
    },

    data() {
        return {
            page: 'employee-list',
            componentKey: 0,
            canShowToast: false
        }
    },

    methods: {
        setPage(page,tab) {

            $('button.nav-link').each(function() {
                $(this).removeClass('active-list');
                $(this).removeClass('active-add');
                $(this).removeClass('active-edit');
                $(this).removeClass('active-delete');
            });
            
            switch(tab) {
                case 'list':
                    $('#list').addClass('active-list');
                    break;
                case 'add':
                    $('#add').addClass('active-add');
                    break;
                case 'edit':
                    $('#edit').addClass('active-edit');
                    break;
                case 'delete':
                    $('#delete').addClass('active-delete');
                    break;
            }

            this.page = page;
        },

        changeKey() {
            this.componentKey += 1;
            this.canShowToast = true;
        },

        hideToast() {
            this.canShowToast = false;
        }
    }
}

</script>


