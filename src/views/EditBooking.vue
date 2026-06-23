<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import BookingServices from "../services/BookingServices.js";

const route = useRoute();

const router = useRouter();

const user = ref(null);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const booking = ref({
  id: null,
  bookingStatus: "",
  totalPrice: 0,
});


const bookingStatuses = ref(["pending", "paid", "cancelled", "refunded", "expired"]);

onMounted(async () => {
  getBooking();
  currentUser.value = JSON.parse(localStorage.getItem("user"));
});

async function getBooking() {
  await BookingServices.getBooking(route.params.id) // get it through the router rather than props
    .then((response) => {
      booking.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToManagementPage()
{
  router.push({ name: "shows" });
}

async function updateBooking() { 

  await BookingServices.updateBooking(booking.value.id, booking.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Booking with ID ${booking.value.id} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getBooking();
}


function closeSnackBar() {
  snackbar.value.value = false;
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
          >Edit Booking Account
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
                  v-model="booking.bookingStatus"
                  label="Booking status"
                  :items="bookingStatuses"
                  required
                ></v-select>
                <v-text-field
                  v-model="booking.totalPrice"
                  type="number"
                  label="Total price"
                ></v-text-field>
        
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateBooking()"
              >Update Booking</v-btn
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