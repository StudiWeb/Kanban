<template>
    <div class="col-xl-6 px-0">
        <div class="card">
            <div class="card-body">
                <p class="card-text">Do you want to make this project visible?</p>
                <div>
                    <div class="form-check form-check-inline">
                        <input v-model="isProjectVisible" class="form-check-input" type="radio" id="yes" value="yes">
                        <label class="form-check-label" for="yes">Yes</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input v-model="isProjectVisible" class="form-check-input" type="radio" id="no" value="no">
                        <label class="form-check-label" for="no">No</label>
                    </div>
                </div>
                <button @click="openModal" class="mt-3 btn btn-primary">Confirm</button>
            </div>
        </div>
    </div>

    <teleport to="body">
        <base-modal>
            <template #header>Project configuration</template>
            <template #body>
                <div>{{modalMesseage}}</div>
            </template>
            <template #footer>
                <div class="d-flex justify-content-end">
                    <button @click="changeIsProjectVisible" class="btn btn-success mr-2">Yes</button>
                    <button @click="closeModal" class="btn btn-primary">No</button>
                </div>
            </template>
        </base-modal>
    </teleport>

    <teleport to="body">
        <base-toast>
            <template #header>Server response</template>
            <template #body>You have just changed project visible value to {{isProjectVisible}}.</template>
        </base-toast>
    </teleport>

</template>

<script>

import { initializeApp } from "firebase/app";
import { getDatabase , update , ref } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBiWEX-ygigO9Kj04kWtjASKLJ3RX20uuM",
    authDomain: "vue-kanban-5ad84.firebaseapp.com",
    databaseURL: "https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "vue-kanban-5ad84",
    storageBucket: "vue-kanban-5ad84.appspot.com",
    messagingSenderId: "538900623860",
    appId: "1:538900623860:web:330924a5a67488f22109a1"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export default {

    props: ['selectedProjectId'],

    data() {
        return {
            isProjectVisible: '',
            modalMesseage: '',
            canShowToast: false,
        };
    },

    watch: {
        isProjectVisible(newValue,oldValue) {

            if(newValue === 'yes') {
                newValue = true;
            } else {
                newValue = false;
            }

            fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects/' + this.selectedProjectId + '.json')
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                if(newValue !== data.isProjectVisible) {
                    this.modalMesseage = 'Are you sure you want to change project visible value to ' + newValue + '?';
                    this.canShowToast = true;
                } else {
                    this.modalMesseage = 'Project visible value is already set to ' + (newValue ? 'yes' : 'no')  + '.';
                    this.canShowToast = false;
                }
            });   
        }
    },

    mounted() {
        fetch('https://vue-kanban-5ad84-default-rtdb.europe-west1.firebasedatabase.app/projects/' + this.selectedProjectId + '.json')
        .then((response) => {
            if(response.ok) {
                return response.json();
            }
        })
        .then((data) => {
            if(data.isProjectVisible) {
                this.isProjectVisible = 'yes';
            } else {
                this.isProjectVisible = 'no';
            }
        });   
    },

    methods: {

        openModal() {
            $('#modal').modal('show');
        },

        closeModal() {
            $('#modal').modal('hide');
        },

        changeIsProjectVisible() {

            if(this.isProjectVisible === 'yes') {
                update(ref(database, 'projects/' + this.selectedProjectId), {
                    isProjectVisible: true
                });
            } else {
                update(ref(database, 'projects/' + this.selectedProjectId), {
                    isProjectVisible: false
                });
            }

            $('#modal').modal('hide');

            if(this.canShowToast) {
                $('#toast').toast('show');
            }

        }


    }


}

</script>