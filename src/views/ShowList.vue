<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import ShowServices from "../services/ShowServices.js";
import UserServices from "../services/UserServices.js";
import ShowCardComponent from "../components/ShowCardComponent.vue";
import { Tabs, Tab } from 'super-vue3-tabs';
import UserCardComponent from "../components/UserCardComponent.vue";

// Tab
const activeTab = ref('0');

// Snackbar
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

// Data retrieved from database gets put here
const shows = ref([]); // shows
const users = ref([]);

// Dialog
const isAddShow = ref(false); // probably cleaner to pass in a value of "Show" or "User" + "Add" or "Edit" but editing happens in another page
const isAddUser= ref(false); 

// Currently logged in user
const user = ref(null);

// New object being built by user
const newShow = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  price: undefined,
  image: undefined,
});

const newUser = ref({
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
  role: undefined,
});


// Dropdown Options

const roles = ref(["customer", "admin"]);

// Stuff that gets displayed 
onMounted(async () => {

  await getShows(); 
  await getUsers();
  user.value = JSON.parse(localStorage.getItem("user")); // still not super sure what this is for? Maybe used for getting objects specific to a user account
});

// --------------------------------------------------- Shows
async function getShows() {
  await ShowServices.getShows()
    .then((response) => {
      shows.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function addShow() {
  isAddShow.value = false;
  delete newShow.id;
  await ShowServices.addShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShow.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShows();
}

async function updateShow() {
  isEditShow.value = false;
  await ShowServices.updateShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShow.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShows();
}

function openAddShow() {
  newShow.value.name = undefined;
  newShow.value.description = undefined;
  newShow.value.price = undefined;
  newShow.value.image = undefined;

  isAddShow.value = true;
}

function closeAddShow() {
  isAddShow.value = false;
}


// ----------------------------------- Users
async function getUsers() {
  await UserServices.getUsers() // change to users plural? Why is this singular?
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


async function addUser() { // adding a new user does not have immediate changes (have to refresh)
  isAddUser.value = false;
  delete newUser.id;
  await UserServices.addUser(newUser.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newUser.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUsers();
}


function openAddUser() {
  newUser.value.id = undefined;
  newUser.value.firstName = undefined;
  newUser.value.lastName = undefined;
  newUser.value.email = undefined;
  newUser.value.password = undefined;
  newUser.value.role = undefined;
  isAddUser.value = true;


}

function closeAddUser() {
  isAddUser.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>










  <v-container>
 
  <!-- https://mdsaban.com/packages/super-vue3-tabs-component/demo/ -->
  <Tabs>
    <Tab value="Shows">
      <template #icon>
        <i class="fas fa-home"></i>
      </template>
      
      <p>Maybe add some totals or something here</p>

      <!-- SHOWS -->

      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Shows
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.role === 'admin'" color="accent" @click="openAddShow()"
            >Add Show</v-btn
          >
        </v-col>
      </v-row>

      <!-- put showtime details in here -->
      <ShowCardComponent
        v-for="show in shows"
        :key="show.id"
        :show="show"
        @deletedList="getShows()"
      />


      <v-dialog persistent v-model="isAddShow" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Show</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newShow.name"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="newShow.description"
              label="Description"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newShow.price"
              label="Ticket Price"
              type="number"
            ></v-text-field>

           <v-text-field
              v-model.number="newShow.durationMinutes"
              label="Duration(in minutes)"
              type="number"
            ></v-text-field>        


             <!-- https://vuetifyjs.com/en/components/file-inputs/#usage -->
            <!-- need to try this later -->
            <v-file-input 
              v-model="newShow.image"
              label="Upload cover image"
              show-size
              clearable
            > </v-file-input>

            <!-- doesn't need a switch, probably need to copy this to Showtime -->
            <v-switch 
              v-model="newShow.isPublished"
              hide-details
              inset
              :label="`Publish? ${newShow.isPublished ? 'Yes' : 'No'}`"
            ></v-switch>


          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddShow()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addShow()"
              >Add Show</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Tab>



    <!-- USERS   -->
    <Tab value="Users">
      <template #icon>
        <i class="fas fa-user"></i>
      </template>  
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Users
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.role === 'admin'" color="accent" @click="openAddUser()"
            >Add User</v-btn
          >
        </v-col>
      </v-row>
      <!-- put Booking and Transaction details in here -->
       <!-- using account instead of user to not get confused with th eLOGGED IN user -->
      <UserCardComponent
        v-for="account in users" 
        :key="account.id"
        :show="account"
        @deletedList="getUsers()"
      />

    </Tab>
    <Tab value="Seats">
      <template #icon>
        <i class="fas fa-cog"></i>
      </template>
  
    </Tab>

    <Tab value="Ticket">
      <template #icon>
        <i class="fas fa-cog"></i>
      </template>
  
    </Tab>
  </Tabs>
  
     <div id="body">


     
      <v-dialog persistent v-model="isAddUser" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new User</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newUser.firstName"
              label="First name"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.lastName"
              label="Last name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newUser.email"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.password"
              label="Password"
              required
           
            ></v-text-field>

            <v-select
              v-model="newUser.role"
              label="Account Role"
              :items="roles"
            ></v-select>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddUser()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addUser()"
              >Add User</v-btn
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
