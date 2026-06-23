<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import UserServices from "../services/UserServices.js";

const router = useRouter();
const route = useRoute();

const currentUser = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const user = ref({
  id: null,
  firstName: "",
  lastName: "",
  email: 0,
  password: 0,
  role: 0,
});


const roles = ref([ "customer", "admin"]);
onMounted(async () => {
  getUser();
  currentUser.value = JSON.parse(localStorage.getItem("user"));
});

async function getUser() {
  await UserServices.getUser(route.params.id) // get it through the router rather than props
    .then((response) => {
      user.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


async function updateUser() { 

  await UserServices.updateUser(user.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${user.value.firstName} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUser();
}


function closeSnackBar() {
  snackbar.value.value = false;
}

function navigateToManagementPage()
{
  router.push({ name: "shows" });
}


</script>

<template>
  <v-container>
     
      <v-icon
      size="80"
      icon="mdi-keyboard-backspace"
       @click="navigateToManagementPage()"
      />
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit User Account
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="user.firstName"
                  label="First name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="user.lastName"
                  label="Last name"
            
                ></v-text-field>
                <v-text-field
                  v-model="user.email"
                  label="Email"
      
                ></v-text-field>

                <v-text-field
                  v-model.number="user.password"
                  label="Password"
          
                ></v-text-field>

                 <v-select
                  v-model="user.role"
                  label="Role"
                  :items="roles"
                ></v-select>
        
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateUser()"
              >Update User</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>


  

   <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>