<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import PaymentServices from "../services/PaymentServices.js";
import BookingServices from "../services/BookingServices.js";

const router = useRouter();


const props = defineProps({ // props only works for components within a View (parent --> child)
   booking: { required: true }
});

const booking = ref(props.booking);

const user = ref(null);

const payments = ref([]);


const refundButtonStyle = ref("refundButton");



function navigateToRefund() {
  console.log("Booking ID:", booking.value.id);

  router.push({ name: "refunds", params: { id: booking.value.id } });
}





onMounted(async () => {
   await getPayments(); 
    user.value = JSON.parse(localStorage.getItem("user"));
});




async function getPayments() {
    await PaymentServices.getPaymentsForBooking(booking.value.id)
      .then((response) => {
        payments.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 








</script>


<template>
  <v-card
    class="rounded-lg elevation-5 mb-8">
    <v-card-title class="headline">
    Booking ID: <p>{{ booking.id }}</p>


    <!-- I want to add total amount of people/tickets/seats for booking and a show name or ID -->
    <!-- if we stick to 1 booking to many payments, keep the loop. Otherwise, remove it -->
     <p v-for="payment in payments">{{ payment.paymentMethod}}</p>


    <p v-for="payment in payments">{{ payment.paymentStatus}}</p>

    <p v-for="payment in payments">${{ payment.amount}}</p>

    </v-card-title>


    <button @click="navigateToRefund()" class="refundButton"> Need a refund? </button>

  </v-card>


  
</template>


<style>

.refundButton{
  background-color: red;
  color:aliceblue;
  padding: 1%;

}
</style>

