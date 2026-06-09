<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import ShowtimeServices from "../services/ShowtimeServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   ingredient: { required: true }
});

const ingredient = ref(props.ingredient);

const isAdd = ref(false);
const user = ref(null);
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
  user.value = JSON.parse(localStorage.getItem("user"));
});


// ---------------------- Showtime functions --------------------------------------

const newShowtime = ref({
  id: undefined,
  ingredientId: ingredient.value.id,
  startDateTime: undefined,
  endDateTime: undefined,
  attendeeCount: undefined,
  isActive: undefined,
});


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
  delete newShowtime.value.id;
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


async function getShowtimes() {
    await ShowtimeServices.getShowtimesForIngredient(ingredient.value.id)
      .then((response) => {
        showtimes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
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
          ID {{ ingredient.id }} - {{ ingredient.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash"></v-icon>
            ${{ ingredient.price }} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ ingredient.duration }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
                 <v-icon 
              size="small"
              icon="mdi-plus" class="ml-2" 
              @click="openAdd()">
            </v-icon>

          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ ingredient.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Showtime</h3>
        
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
                @click="editFunctionWheneverItsReady()"
              ></v-icon>
              <v-icon 
              size="small"
              icon="mdi-delete" class="ml-2" 
              @click="deleteFunctionWheneverItsReady()">
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