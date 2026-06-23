<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import ShowtimeServices from "../services/ShowtimeServices.js";
import ShowServices from "../services/ShowServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   show: { required: true }
});

const show = ref(props.show);
const isEdit = ref(false);
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
   console.log("Show ID:", show.value.id);
  getShowtimes();
  user.value = JSON.parse(localStorage.getItem("user"));
  
 // SHOW
    // convert DateTime format into more readable date time format (mm:dd, hh:mm)
      var rawCreatedAt = new Date(show.value.createdAt);
      var rawUpdatedAt = new Date(show.value.updatedAt);
      var createdAtDate = rawCreatedAt.toLocaleDateString([], { month: "short",  day: "numeric" });
      var updatedAtDate = rawUpdatedAt.toLocaleDateString([], { month: "short",  day: "numeric" });
      var createdAtTime = rawCreatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      var updatedAtTime = rawUpdatedAt.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
      show.value.formattedCreatedAt = `${createdAtDate} ${createdAtTime}`; // store back into shows under formattedTime (you can dynamically add a new property in Vue)
      show.value.formattedUpdatedAt = `${updatedAtDate} ${createdAtTime}`; 
    

      
});


// ---------------------- Showtime functions --------------------------------------

const newShowtime = ref({
  id: undefined,
  showId: show.value.id,
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
  newShowtime.value.showId = show.value.id; // redundant but just in case
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
  newShowtime.value.showId = show.value.id; // redundant but just in case
  await ShowtimeServices.updateShowtime(newShowtime.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShowtime.value.id} editted successfully!`; 
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
  newShowtime.value.showId = item.showId;
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
    await ShowtimeServices.getShowtimesForShow(show.value.id)
      .then((response) => {
        showtimes.value = response.data;
      for (let i = 0; i < showtimes.value.length; i++) {
        var rawStart = new Date(showtimes.value[i].startDateTime);
        var rawEnd = new Date(showtimes.value[i].endDateTime);
        var startDate = rawStart.toLocaleDateString([], { month: "short", day: "numeric" });
        var endDate = rawEnd.toLocaleDateString([], { month: "short", day: "numeric" });
        var startTime = rawStart.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
        var endTime = rawEnd.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

        showtimes.value[i].formattedStartDateTime = `${startDate} ${startTime}`;
        showtimes.value[i].formattedEndDateTime = `${endDate} ${endTime}`;
      }


      })
      .catch((error) => {
        console.log(error);
      });
  } 



  
async function deleteShow() { // still on Show functions
  await ShowServices.deleteShow(show.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${show.value.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getShows();
}


// directly pass item into deleteShowtime since there is no specific showtime ref

async function deleteShowtime(item) { // still on Show functions
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

  await getShowtimesForShow();
}



function navigateToEdit() {
  router.push({ name: "editShow", params: { id: show.value.id } });
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
          ID {{ show.id }} - {{ show.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash"></v-icon>
            ${{ show.price }} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ show.durationMinutes }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
                 <v-icon
              v-if="user !== null && user.role === 'admin'"
              title="Add showtime"
              size="small"
              icon="mdi-plus" class="ml-2"
              @click="openAdd()">
            </v-icon>

          <v-icon
            v-if="user !== null && user.role === 'admin'"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
            <v-icon
            v-if="user !== null && user.role === 'admin'"
            size="small"
            icon="mdi-delete"
            @click.stop="deleteShow(item)"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="showDetails">
    <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Name</th>
            <th class="text-left">Price</th>
            <th class="text-left">Created At</th>
            <th class="text-left">Updated At</th>
    
            <th class="text-left">Description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ show.id }}</td>
            <td>{{ show.name }}</td>
            <td>{{ show.price}}</td>
            <td>{{ show.formattedCreatedAt}}</td>
            <td>{{ show.formattedUpdatedAt }}</td>
            <td>{{ show.description }}</td>
          </tr>

          </tbody>
      </v-table>







        <!-- how do I make this bold -->
        <h1>Showtime</h1>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Showtime ID</th>
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
            <td>{{ item.showId }}</td>
            <td>{{ item.formattedStartDateTime }}</td>
            <td>{{ item.formattedEndDateTime }}</td>
            <td>{{ item.attendeeCount }}</td>
            <td>{{ item.isActive }}</td>
            <td>
              <v-icon
                v-if="user !== null && user.role === 'admin'"
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
              <v-icon
                v-if="user !== null && user.role === 'admin'"
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


