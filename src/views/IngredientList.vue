<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import IngredientServices from "../services/IngredientServices.js";


// CSS Style Refs
const thStyle = ref("text-left");

// Refs
const events = ref([]); // list of events
const accounts = ref([]); // list of accounts
const transaction = ref([]); // list of transactions
const isAdd = ref(false); // creating an object but not yet saving it, isAdd = true when finally saved. I think?
const isEdit = ref(false); 
const user = ref(null);
const snackbar = ref({ // the little status bar popup
  value: false,
  color: "",
  text: "",
});



// Dropdown choices
const units = [
  "cup",
  "gallon",
  "gram",
  "kilogram",
  "liter",
  "milliliter",
  "ounce",
  "pint",
  "piece",
  "pound",
  "quart",
  "tablespoon",
  "teaspoon",
  "unit",
];

// Model?
const newIngredient = ref({
  id: undefined,
  name: undefined,
  unit: undefined,
  pricePerUnit: undefined,
});


// whatever gets displayed
onMounted(async () => {
  await getIngredients();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getIngredients() { // replace Ingredients later
  await IngredientServices.getIngredients()
    .then((response) => {
      events.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addIngredient() {
  isAdd.value = false;
  delete newIngredient.id;
  await IngredientServices.addIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newIngredient.value.title} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getIngredients();
}

async function updateIngredient() {
  isEdit.value = false;
  await IngredientServices.updateIngredient(newIngredient.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newIngredient.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getIngredients();
}

function openAdd() {
  newIngredient.value.title = undefined;
  newIngredient.value.description = undefined;
  newIngredient.value.ticketPrice = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function openEdit(item) {
  newIngredient.value.id = item.id;
  newIngredient.value.title = item.title;
  newIngredient.value.description = item.description;
  newIngredient.value.ticketPrice = item.ticketPrice;
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
            <th class="text-left">Attendees</th>
            <th class="text-left">Actions</th>

          </tr>
        </thead>
        <tbody>
          <tr v-for="item in events" :key="item.title">
            <td>{{ item.id }}</td>
            <td>{{ item.title }}</td>
            <td>{{ item.description }}</td>
            <td>${{ item.ticketPrice }}</td>
            <td>{{ item.dateTime }}</td>
            <td>{{ item.attendeeCount }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
                <v-icon
                size="small"
                icon="mdi-delete"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!-- used for both Add and Edit actions -->
  
      <v-dialog persistent :model-value="isAdd || isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-item>
            <v-card-title class="headline mb-2"
              >{{ isAdd ? "Add Ingredient" : isEdit ? "Edit Ingredient" : "" }}
            </v-card-title>
          </v-card-item>
          <v-card-text>
            <v-text-field
              v-model="newIngredient.title"
              label="Title"
              required
            ></v-text-field>
            <v-select
              v-model="newIngredient.description"
              :items="units"
              label="Description"
              required
            >
            </v-select>
            <v-text-field
              v-model="newIngredient.ticketPrice"
              label="Ticket Price"
              type="number"
            ></v-text-field>

            <v-text-field
              v-model="newIngredient.dateTime"
              label="Date and Time"
              type="datetime-local"
            ></v-text-field>

            <v-text-field
              v-model="newIngredient.attendeeCount"
              label="Attendee Count"
              type="number"
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
                isAdd ? addIngredient() : isEdit ? updateIngredient() : false
              "
              >{{
                isAdd ? "Add Ingredient" : isEdit ? "Update Ingredient" : ""
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


