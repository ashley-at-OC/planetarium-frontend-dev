<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShowServices from "../services/ShowServices.js";
import ShowtimeServices from "../services/ShowtimeServices.js";
import ShowCardComponent from "../components/ShowCardComponent.vue"
//import RecipeShowServices from "../services/RecipeShowServices";
//import RecipeStepServices from "../services/RecipeStepServices";
//import RecipeServices from "../services/RecipeServices";

const router = useRouter();
const route = useRoute();
// got rid of a lot of stuff for now
const shows = ref([]); // change to shows later
const showtimes = ref([]); 
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

//props wouldn't work well here

const show = ref({
  id: null,
  name: "",
  description: "",
  price: 0,
  durationMinutes: 0,
  imageURL: null,
});




onMounted(async () => {
  getShow();
  getShowtimes();
    user.value = JSON.parse(localStorage.getItem("user"));
});

async function getShow() {
  await ShowServices.getShow(route.params.id)
    .then((response) => {
      show.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


async function updateShow() { 

  await ShowServices.updateShow(show.value.id, show.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${show.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShow();
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
            <v-icon
      size="80"
      icon="mdi-keyboard-backspace"
       @click="navigateToManagementPage()"
      />
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
                  v-model="show.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="show.price"
                  label="Ticket Price"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="show.durationMinutes"
                  label="Duration(in minutes)"
                  type="number"
                ></v-text-field>
                <v-switch
                  v-model="show.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${show.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="show.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <!-- <v-file-input 
              v-model="show.image"
              label="Upload cover image"
              show-size
              clearable
              show-image
            > </v-file-input> -->
              <v-text-field 
                v-model="show.imageURL"
                label="Upload image url"
                show-size
                clearable
            > </v-text-field>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateShow()"
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