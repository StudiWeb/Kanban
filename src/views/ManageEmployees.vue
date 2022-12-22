<template>
    <div class="row mb-4">
        <div class="px-0 d-flex flex-wrap">
            <base-button @click="setPage('employee-list')" class="m-2 btn-primary">LIST OF EMPLOYEES</base-button>
            <base-button @click="setPage('add-employee')" class="m-2 btn-success">ADD EMPLOYEE</base-button>
            <base-button @click="setPage('edit-employee')" class="m-2 btn-warning">EDIT EMPLOYEE</base-button>
            <base-button @click="setPage('delete-employee')" class="m-2 btn-danger">DELETE EMPLOYEE</base-button>
        </div>
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
        setPage(cmp) {
            this.page = cmp;
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
