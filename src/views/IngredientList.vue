<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import RecipeCard from "../components/RecipeCardComponent.vue";
import RecipeServices from "../services/RecipeServices.js";

// CSS Style Refs
const thStyle = ref("text-left");

// Refs

const recipes = ref([]); // list of recipes
const accounts = ref([]); // list of recipes
const transaction = ref([]); // list of recipes
const isAdd = ref(false); // creating a recipe but not yet saving it, isAdd = true when you finally save. I think?
const user = ref(null); 
const snackbar = ref({ // the little status bar popup
  value: false,
  color: "",
  text: "",
});
const newRecipe = ref({ // no need for a Recipe model, I guess?
  name: "",
  description: "",
  ticketPrice: 0,
  time: "30", // change to DateTime later
  date: "30", // chang to DateTime later
  attendeesCount: 0,
});

const accountTypes =
[ "attendee", "admin" ]


onMounted(async () => { // what's being displayed
  await getRecipes();
  user.value = JSON.parse(localStorage.getItem("user"));  // replace user with something else. All events should be accessible and visible to everyone
});

async function getRecipes() { // probably not working right now because DB is set up to get Recipe based on userID
  await RecipeServices.getRecipes()
    .then((response) => {
      recipes.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addRecipe() {
  isAdd.value = false;
  // newRecipe.value.userId = user.value.id;  // Events won't be associated with a userID
  await RecipeServices.addRecipe(newRecipe.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newRecipe.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipes();
}





async function updateRecipe() {
  isEdit.value = false;
  await RecipeServices.updateRecipe(newRecipe.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newRecipe.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipes();
}

function openAdd() {
  newRecipe.value.name = undefined;
  newRecipe.value.unit = undefined;
  newRecipe.value.pricePerUnit = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newRecipe.value.id = item.id;
  newRecipe.value.name = item.name;
  newRecipe.value.unit = item.unit;
  newRecipe.value.pricePerUnit = item.pricePerUnit;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <!-- Events -->
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold">
            Events
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >+</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">EventID</th>
            <th class="text-left">Title</th>
            <th class="text-left">Description</th>
            <th class="text-left">Ticket Price</th>
            <th class="text-left">Time</th>
            <th class="text-left">Date</th>
            <th class="text-left">Attendees</th>
            <th class="text-left">Edit</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recipes" :key="item.title">
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>${{ item.ticketPrice }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.date }}</td>
            <td>{{ item.attendeesCount }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>



      <!-- Accounts -->
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold">
            Accounts
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >+</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">AccountID</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Password (Encrypted)</th>
            <th class="text-left">Date Created</th>
        
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recipes" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.unit }}</td>
            <td>${{ item.pricePerUnit }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>


       <!-- Transactions -->
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold">
            Transactions
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >+</v-btn
          >
        </v-col>
      </v-row>

      <v-table class="rounded-lg elevation-5">
        <thead>
          <tr>
            <th class="text-left">TransactionID</th>
            <th class="text-left">AccountID</th>
            <th class="text-left">EventID</th>
            <th class="text-left">Refunded?</th>
            <th class="text-left">Time Purchased</th>
            <th class="text-left">Date Purchased</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recipes" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.unit }}</td>
            <td>${{ item.pricePerUnit }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>






      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Event" : isEdit ? "Edit Event" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newRecipe.title"
              label="Title"
              required
            ></v-text-field>
            <v-select
              v-model="newRecipe.description"
              :items="units"
              label="Description"
              required
            >
            </v-select>
            <v-text-field
              v-model="newRecipe.ticketPrice"
              label="Ticket Price"
              type="number"
              required
            ></v-text-field>
            <v-text-field
              v-model="newRecipe.time"
              label="Time (WIP change to Datetime)"
              type="number" 
              required
            ></v-text-field>
            <v-text-field
              v-model="newRecipe.date"
              label="Ticket Price (WIP change to Datetime)"
              type="number"
              required
            ></v-text-field>
              <v-text-field
              v-model="newRecipe.date"
              label="Attendee"
              type="number"
              required
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              variant="flat"
              color="secondary"
              @click="isAdd ? closeAdd() : isEdit ? closeEdit() : false"
              >Close</v-btn
            >
            <v-btn
              variant="flat"
              color="primary"
              @click="
                isAdd ? addRecipe() : isEdit ? updateRecipe() : false
              "
              >{{
                isAdd ? "Add recipe" : isEdit ? "Update recipe" : ""
              }}</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>

<style>

.text-left{
  color:red; 
}

</style>
