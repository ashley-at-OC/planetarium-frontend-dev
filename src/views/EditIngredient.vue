<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import IngredientServices from "../services/IngredientServices.js";
import ShowtimeServices from "../services/ShowtimeServices.js";
import ShowCardComponent from "../components/ShowCardComponent.vue"
//import RecipeIngredientServices from "../services/RecipeIngredientServices";
//import RecipeStepServices from "../services/RecipeStepServices";
//import RecipeServices from "../services/RecipeServices";


const route = useRoute();
// got rid of a lot of stuff for now
const ingredients = ref([]); // change to shows later
const showtimes = ref([]); 
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

//props wouldn't work well here

const ingredient = ref({
  id: null,
  name: "",
  description: "",
  price: 0,
  duration: 0,
});




onMounted(async () => {
  getIngredient();
  getShowtimes();
    user.value = JSON.parse(localStorage.getItem("user"));
});

async function getIngredient() {
  await IngredientServices.getIngredient(route.params.id)
    .then((response) => {
      ingredient.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


async function updateIngredient() { 

  await IngredientServices.updateIngredient(ingredient.value.id, ingredient.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${ingredient.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getIngredient();
}



// -------------------- Showtimes -------------------


const newShowtime = ref({
  id: undefined,
  ingredientId: ingredient.value.id,
  startDateTime: undefined,
  endDateTime: undefined,
  attendeeCount: undefined,
  isActive: undefined,
});




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

  console.log("Ingredient ID used:", ingredient.value.id);
  user.value = JSON.parse(localStorage.getItem("user"));
    await ShowtimeServices.getShowtimesForIngredient(ingredient.value.id)
      .then((response) => {
        showtimes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
}



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


function closeSnackBar() {
  snackbar.value.value = false;
}



</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Show
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
                  v-model="ingredient.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="ingredient.price"
                  label="Ticket Price"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="ingredient.duration"
                  label="Duration (in minutes)"
                  type="number"
                ></v-text-field>
                <v-switch
                  v-model="ingredient.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${ingredient.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="ingredient.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-file-input 
              v-model="ingredient.image"
              label="Upload cover image"
              show-size
              clearable
              show-image
            > </v-file-input>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateIngredient()"
              >Update Show</v-btn
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