<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import ShowtimeServices from "../services/ShowtimeServices.js";
import IngredientServices from "../services/IngredientServices.js";
import UserServices from "../services/UserServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   ingredient: { required: true }
});

const ingredient = ref(props.ingredient);  // change to user
const isEdit = ref(false);
const isAdd = ref(false);
const currentUser = ref(null);
const router = useRouter();
const showtimes = ref([]);
const showDetails = ref(false); // expanded or not expanded
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
   console.log("Ingredient ID:", ingredient.value.id);
  getShowtimes();
  currentUser.value = JSON.parse(localStorage.getItem("user"));
});


// ---------------------- Showtime functions --------------------------------------


// opening the dialog
function openAdd() {
  newShowtime.value.startDateTime = "";
  newShowtime.value.endDateTime = "";
  newShowtime.value.attendeeCount = undefined;
  newShowtime.value.isActive = false;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

async function addShowtime() {
  isAdd.value = false;
  newShowtime.value.ingredientId = ingredient.value.id; // redundant but just in case
  console.log("AddShowtime:", newShowtime.value);

  await ShowtimeServices.addShowtime(newShowtime.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShowtime.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShowtimes();
}



async function editShowtime() {
  isEdit.value = false; // closes the dialog pop-up
  newShowtime.value.ingredientId = ingredient.value.id; // redundant but just in case
  await ShowtimeServices.updateShowtime(newShowtime.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShowtime.value.name} editted successfully!`; 
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShowtimes();
}


// for Showtime, Show gets editted elsewhere
function openEdit(item) {
  newShowtime.value.id = item.id;
  newShowtime.value.ingredientId = item.ingredientId;
  newShowtime.value.startDateTime = item.startDateTime;
  newShowtime.value.endDateTime = item.endDateTime;
  newShowtime.value.attendeeCount = item.attendeeCount;
  newShowtime.value.isActive = item.isActive;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}



async function getShowtimes() {
    await ShowtimeServices.getShowtimesForIngredient(ingredient.value.id)
      .then((response) => {
        showtimes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 



  
async function deleteShow() { // still on Ingredient functions
  await IngredientServices.deleteIngredient(ingredient.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Show deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getIngredients();
}


// directly pass item into deleteShowtime since there is no specific showtime ref

async function deleteShowtime(item) { // still on Ingredient functions
  await ShowtimeServices.deleteShowtime(item)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Showtime deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getShowtimesForIngredient();
}



function navigateToEdit() {
  router.push({ name: "editIngredient", params: { id: ingredient.value.id } });
}




function closeSnackBar() {
  snackbar.value.value = false;
}


</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          ID {{ ingredient.firstName }} {{ ingredient.lastName }}
          <!-- change color of chip for different user types? -->
          <v-chip class="ma-2" color="blue" label>
            <v-icon start icon="mdi-account-circle"></v-icon>
            {{ ingredient.role }} 
          </v-chip>
          
        </v-col>
        <v-col class="d-flex justify-end">
              <v-icon 
              size="small"
              icon="mdi-plus" class="ml-2" 
              @click="openAdd()">
            </v-icon>

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
            @click.stop="deleteShow(item)"
          ></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="showDetails">
         {{ ingredient.email }}

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
            <td>{{ ingredient.id }}</td>
            <td>{{ ingredient.firstName }}</td>
            <td>{{ ingredient.lastName }}</td>
            <td>{{ ingredient.email }}</td>
            <td>{{ ingredient.createdAt}}</td>
            <td>{{ ingredient.updatedAt }}</td>
          </tr>

          </tbody>
      </v-table>
   

        <br>
        <hr>
        <br>
        <h3>Accounts</h3>

         <v-card-text class="body-1">

    </v-card-text>
        
      <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Show ID</th>
            <th class="text-left">Start datetime</th>
            <th class="text-left">End datetime</th>
            <th class="text-left">Attendee Count</th>
            <th class="text-left">Active?</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in showtimes" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.ingredientId }}</td>
            <td>{{ item.startDateTime }}</td>
            <td>{{ item.endDateTime }}</td>
            <td>{{ item.attendeeCount }}</td>
            <td>{{ item.isActive }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
              <v-icon 
              size="small"
              icon="mdi-delete" class="ml-2" 
              @click.stop="deleteShowtime(item)">
            </v-icon>
  
            </td>
          
   

          </tr>
        </tbody>
      </v-table>


       <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Showtime </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newShowtime.startDateTime"
              label="Start datetime"
              type="datetime-local"
              required
            ></v-text-field>

            <v-text-field
              v-model="newShowtime.endDateTime"
              label="End datetime"
              type="datetime-local"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newShowtime.attendeeCount"
              label="Attendee Count"
              type="number"
            ></v-text-field>
            <!-- binded to a boolean by default -->
            <v-switch  
              v-model="newShowtime.isActive"
              hide-details
              inset
              :label="`Active? ${newShowtime.isActive ? 'Yes' : 'No'}`"
            ></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addShowtime()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!-- Edit Showtime -->
       <v-dialog persistent v-model="isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"> Edit Showtime </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newShowtime.startDateTime"
              label="Start datetime"
              type="datetime-local"
              required
            ></v-text-field>

            <v-text-field
              v-model="newShowtime.endDateTime"
              label="End datetime"
              type="datetime-local"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newShowtime.attendeeCount"
              label="Attendee Count"
              type="number"
            ></v-text-field>
            <!-- binded to a boolean by default -->
            <v-switch  
              v-model="newShowtime.isActive"
              hide-details
              inset
              :label="`Active? ${newShowtime.isActive ? 'Yes' : 'No'}`"
            ></v-switch>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeEdit()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="editShowtime()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
     
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


