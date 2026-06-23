<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import QrcodeVue from "qrcode.vue";

const route = useRoute();
const router = useRouter();

const seatNumbers = ref([]);
const email = ref("");
const qrValue = ref("http://ec2-54-227-117-253.compute-1.amazonaws.com/planetarium-frontend/"); 

onMounted(() => {
  // Grab the passed seats and store them into seatNumbers
  const seats = route.params.seatNumbers;
  // Error handling mainly for AC2
  if (!seats) {
    errorMessage.value = "Ticket information could not be found.";
    return;
  }
  // If array keep it; otherwise convert it to an array.
  if (Array.isArray(seats)) {
    seatNumbers.value = seats;
  } else {
    seatNumbers.value = [seats];
  }
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
    email.value = user.email;

});

function goHome() {
  router.push({ name: "recipe" });
}
</script>

<template>
  <v-container>
    <v-card class="rounded-lg elevation-5 pa-6 text-center">
      <v-icon size="64" color="green">mdi-check-circle</v-icon>

      <v-card-title class="text-h4 font-weight-bold mt-4">
        Thank you for your purchase!
      </v-card-title>

      <v-card-text>
        <p class="text-h6 mt-2">
          <span v-if="seatNumbers.length > 1">Your seats are: </span>
          <span v-else>Your seat is: </span>
          <!-- Turn array into string -->
          <strong>{{ seatNumbers.join(", ") }}</strong> 
        </p>

        <!-- QR code -->
        <v-sheet
          class="mx-auto mt-6 mb-4 d-flex align-center justify-center"
          color="grey-lighten-3"
          rounded
          width="160"
          height="160"
        >
           <QrcodeVue :value="qrValue" :size="140" />
        </v-sheet>
        
        <p v-if="email" class="text-body-1 mt-2">
        Tickets have been emailed to <strong>{{ email }}</strong>
        </p>
        <!-- Error handeling for AC2 -->
        <p v-else class="text-body-1 mt-2">
        Your tickets are ready.
        </p>
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn variant="flat" color="primary" @click="goHome()">Back to Home</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>
