<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import UserServices from "../services/UserServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   user: { required: true }
});

const user = ref(props.user);  // change to user
const isEdit = ref(false);
const isAdd = ref(false);
const currentUser = ref(null);
const router = useRouter();
const userDetails = ref(false); // expanded or not expanded
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  console.log("USER ID:", user.value.id);
  currentUser.value = JSON.parse(localStorage.getItem("user"));

 // USER
    // convert DateTime format into more readable date time format (mm:dd, hh:mm)
      var rawCreatedAt = new Date(user.value.createdAt);
      var rawUpdatedAt = new Date(user.value.updatedAt);
      var createdAtDate = rawCreatedAt.toLocaleDateString([], { month: "short",  day: "numeric" });
      var updatedAtDate = rawUpdatedAt.toLocaleDateString([], { month: "short",  day: "numeric" });
      var createdAtTime = rawCreatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      var updatedAtTime = rawUpdatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      user.value.formattedCreatedAt = `${createdAtDate} ${createdAtTime}`; // store back into users under formattedTime (you can dynamically add a new property in Vue)
      user.value.formattedUpdatedAt = `${updatedAtDate} ${createdAtTime}`; 
    

});


// ---------------------- User funtions  --------------------------------------


async function deleteUser() { 
  await UserServices.deleteUser(user.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `User deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getUsers();
}

function navigateToEdit() {

  console.log("USER ID:", user.value.id);


 router.push({ name: "editUser", params: { id: user.value.id } });

}




function closeSnackBar() {
  snackbar.value.value = false;
}


</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="userDetails = !userDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          ID {{ user.firstName }} {{ user.lastName }}
          <!-- change color of chip for different user types? -->
          <v-chip class="ma-2" color="blue" label>
            <v-icon start icon="mdi-account-circle"></v-icon>
            {{ user.role }} 
          </v-chip>
          
        </v-col>
        <v-col class="d-flex justify-end">
      
          <v-icon
            v-if="currentUser !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
            <v-icon
            v-if="currentUser !== null"
            size="small"
            icon="mdi-delete"
            @click.stop="deleteUser(item)"
          ></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="userDetails">
         {{ user.email }}

         <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Created At</th>
            <th class="text-left">Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.formattedCreatedAt}}</td>
            <td>{{ user.formattedUpdatedAt }}</td>
          </tr>

          </tbody>
      </v-table>
   
    
      </v-card-text>
    </v-expand-transition>
  </v-card>


  

  

   <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>

</template>


