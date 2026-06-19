<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import SeatServices from "../services/SeatServices.js";
import TicketServices from "../services/TicketServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   ticket: { required: true }
});

const ticket = ref(props.ticket);
const isEdit = ref(false);
const isAdd = ref(false);
const user = ref(null);
const router = useRouter();
const seats = ref([]);
const ticketDetails = ref(false); // expanded or not expanded
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});




onMounted(async () => {
    await getSeats();
    user.value = JSON.parse(localStorage.getItem("user"));
});






// ---------------------- Seat functions --------------------------------------



const seatStatuses = ref(["pending", "completed", "failed", "refunded"]);

const seatMethods = ref(['credit_card', "debit_card", "paypal"]);


const newSeat = ref({
  id: undefined,
  ticketId: undefined,
  seatStatus: undefined,
  seatMethod: undefined,
  amount: undefined,

});



// opening the dialog
function openAdd() {
  newSeat.value.seatStatus = "";
  newSeat.value.seatMethod = "";
  newSeat.value.amount = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

async function addSeat() {
  isAdd.value = false;
  newSeat.value.ticketId = ticket.value.id; // redundant but just in case
  console.log("Add Seat:", newSeat.value);

  await SeatServices.addSeat(newSeat.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Seat #${newSeat.value.id} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getSeats();
}



async function editSeat() {
  isEdit.value = false; // closes the dialog pop-up
  newSeat.value.ticketId = ticket.value.id; // redundant but just in case
  console.log("NEW SEAT " + newSeat.value.id);
  await SeatServices.updateSeat(newSeat.value.id, newSeat.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newSeat.value.id} editted successfully!`; 
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getSeats();
}


// for Seat, Ticket gets editted elsewhere
function openEdit(item) {
  newSeat.value.id = item.id;
  newSeat.value.ticketId = item.ticketId;
  newSeat.value.seatStatus = item.seatStatus;
  newSeat.value.seatMethod = item.seatMethod;
  newSeat.value.amount = item.amount;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}



async function getSeats() {
    await SeatServices.getSeatsForTicket(ticket.value.id)
      .then((response) => {
        seats.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 

  
async function deleteTicket() { // still on Ticket functions
  await TicketServices.deleteTicket(ticket.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Ticket deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getTickets();
}


// directly pass item into deleteSeat since there is no specific seat ref

async function deleteSeat(item) { // still on Ticket functions
  await SeatServices.deleteSeat(item.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Seat deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getSeats();
}



function navigateToEdit() {
  router.push({ name: "editTicket", params: { id: ticket.value.id } });
}




function closeSnackBar() {
  snackbar.value.value = false;
}


</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="ticketDetails = !ticketDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          ID {{ ticket.id }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash"></v-icon>
            {{ ticket.ticketStatus }} 
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
            <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-delete"
            @click.stop="deleteTicket(item)"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="ticketDetails">
    <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Booking Id</th>
            <th class="text-left">Showtime ID</th>
            <th class="text-left">Seat ID</th>
            <th class="text-left">Status</th>
            <th class="text-left">Type</th>
            <th class="text-left">Price</th>
        <th class="text-left">Emailed At</th>
        <th class="text-left">Scanned At</th>
            <th class="text-left">Created At</th>
            <th class="text-left">Updated At</th>
                    <th class="text-left">QR Code</th>
    
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ ticket.id }}</td>
            <td>{{ ticket.bookingId }}</td>
            <td>{{ ticket.showtimeId }}</td>
            <td>{{ ticket.seatId}}</td>
            <td>{{ ticket.ticketStatus}}</td>
            <td>{{ ticket.ticketType}}</td>
            <td>{{ ticket.ticketPrice}}</td>
            <td>{{ ticket.emailedAt}}</td>
            <td>{{ ticket.scannedAt}}</td>
            <td>{{ ticket.createdAt}}</td>
            <td>{{ ticket.updatedAt }}</td>
          </tr>

          </tbody>
      </v-table>




       <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Seat for ticket {{ ticket.id}}</v-card-title>
          <v-card-text>
            <v-select
              v-model="newSeat.seatStatus"
              label="Seat Status"
              :items="seatStatuses"
              required
            ></v-select>

            <v-select
              v-model="newSeat.seatMethod"
              label="Seat Method"
              :items="seatMethods"
              required
            ></v-select>
            <v-text-field
              v-model.number="newSeat.amount"
              label="Amount"
              type="number"
            ></v-text-field>
    
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addSeat()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!-- Edit Seat -->
       <v-dialog persistent v-model="isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"> Edit Seat </v-card-title>
          <v-card-text>
            <v-select
              v-model="newSeat.seatStatus"
              label="Seat Status"
              :items="seatStatuses"
              required
            ></v-select>

            <v-select
              v-model="newSeat.seatMethod"
              label="Seat Method"
              :items="seatMethods"
              required
            ></v-select>
            <v-text-field
              v-model.number="newSeat.amount"
              label="Amount"
              type="number"
            ></v-text-field>
     
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeEdit()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="editSeat()"
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


