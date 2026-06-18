<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import BookingServices from "../services/BookingServices";
import PaymentServices from "../services/PaymentServices";
import PurchaseCardComponent from "../components/PurchaseCardComponent.vue";
import BookingCardComponent from "../components/BookingCardComponent.vue";

const router = useRouter(); // do I even need this...
const route = useRoute();




const refundReasonings = ref(['I made an accidental purchase.', 'I need to make a change on my booking.', "I had a change in plans.", "I am facing financial difficulties."]);




const booking = ref("");
const payments = ref([])

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


onMounted(async () => {
  await getBooking();
  await getPayments(booking.value.id);

});



async function getBooking() {
  await BookingServices.getBooking(route.params.id) // params from PurchaseCardComponent are passed here
    .then((response) => {
      booking.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


async function getPayments(id) {
    await PaymentServices.getPaymentsForBooking(id)
      .then((response) => {
        payments.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 

 // need to consider stopping the user if passed the show's 24 hour mark
  async function confirmRefund()
  {
    // take status values and change them to "refunded"
    booking.value.bookingStatus = "refunded";
    payments.value[0].paymentStatus = "refunded";

    console.log("Booking:" + booking.value.id);
    console.log("Payment:" + payments.value[0].id);
    await PaymentServices.updatePayment(payments.value[0].id, payments.value[0]) // updatePayment(id, payment)
      .then((response) => {
        payments.value[0] = response.data;
      })
      .catch((error) => {
        console.log(error);
      });


    await BookingServices.updateBooking(booking.value.id, booking.value) // updateBooking (id, booking)
      .then((response) => {
        booking.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });


      
    console.log("Booking Status:" + booking.value.bookingStatus);
    console.log("Payment Status:" + payments.value[0].paymentStatus);
  } 

function closeSnackBar() {
  snackbar.value.value = false;
}




</script>


<template>


<v-container>
 <v-card
    class="rounded-lg elevation-5 mb-8">
    <v-card-title class="headline">
        Refund Request for booking {{ booking.id }}. <!-- change this to Show name -->
      </v-card-title>
 
<p class="refundText"> All refund decisions are final.</p>
      




<v-select class="refundText"

:items="refundReasonings">

</v-select>

<button class="refundButtonStyle" @click=confirmRefund()> Confirm Refund</button>
    </v-card>


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


<style>

.refundText{

  margin: 3%;
}

.refundButtonStyle{
  background-color: rgb(195, 37, 37);
  color:aliceblue;
  width: 20%;

  margin: 0% 40% 0% 40%;
  
}

</style>