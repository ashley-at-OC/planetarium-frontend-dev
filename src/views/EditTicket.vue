<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import TicketServices from "../services/TicketServices.js";

const route = useRoute();

const router = useRouter();

const ticketsForShowtime = ref([]);

const currentUser = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

// Dropdown options
const ticketTypes = ref(["adult", "child_under_8"]);
const ticketStatuses = ref(["valid", "used", "cancelled"])

const ticket = ref({
  id: null,
  bookingId: 0,
  showtimeId: 0,
  seatId: 0, 
  qrCode: "",
  ticketType: "",
  ticketStatus: "",
  ticketPrice: 0,
});



onMounted(async () => {
  getTicket();
  currentUser.value = JSON.parse(localStorage.getItem("user"));
});

async function getTicket() {
  await TicketServices.getTicket(route.params.id) // get it through the router rather than props
    .then((response) => {
      ticket.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


function navigateToManagementPage()
{
  router.push({ name: "shows" });
}

async function updateTicket() { 

  await TicketServices.updateTicket(ticket.value.id, ticket.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Ticket with ID ${ticket.value.id} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getTicket();
}


function closeSnackBar() {
  snackbar.value.value = false;
}



</script>

<template>
  <v-container>

          <v-icon
      size="80"
      icon="mdi-keyboard-backspace"
       @click="navigateToManagementPage()"
      />
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Ticket - ID {{ticket.id}}
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                
               <v-select
              v-model="ticket.bookingId"
              label="Booking" 
    
            ></v-select>

       
      
            <v-select
              v-model="ticket.ticketType"
              label="Type"
              :items="ticketTypes"
            ></v-select>


             <v-text-field
              v-model="ticket.ticketPrice"
              label="Price"

            ></v-text-field>

                  
            <v-select
              v-model="ticket.ticketStatus"
              label="Status"
              :items="ticketStatuses"
            ></v-select>
            

                   <v-text-field
              v-model="ticket.qrCode"
              label="QR Code"

            ></v-text-field>
            

              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateTicket()"
              >Update Ticket</v-btn
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