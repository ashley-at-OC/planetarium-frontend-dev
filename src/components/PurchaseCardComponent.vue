<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import PaymentServices from "../services/PaymentServices.js";

const router = useRouter();

const props = defineProps({
  booking: { required: true }
});

const booking = ref(props.booking);
const user = ref(null);
const payments = ref([]);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


function navigateToRefund() {
  router.push({ name: "refunds", params: { id: booking.value.id } });
}

onMounted(async () => {
  await getPayments();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getPayments() {
  try {
    const response = await PaymentServices.getPaymentsForBooking(booking.value.id);
    payments.value = response.data;
  } catch (error) {
    console.log(error);

  }
}





</script>

 

<template>
  <v-card class="rounded-lg elevation-5 mb-8 pa-4">

    <v-card-title class="headline mb-4">
      Booking #{{ booking.id }}
      <br>
      <hr>
    </v-card-title>
    <v-row>
    <v-col>
    <v-card-text>
      <p><b>Show:</b> {{ booking.showName }}</p>
      <p><b>Date Purchased:</b> {{ booking.createdAt }}</p>
      <p><b>Seats Reserved:</b> {{ }}</p>
      <br>
      
      <h3>Payment Details</h3>
      <div v-for="payment in payments" :key="payment.id" class="mb-2">
        <p><b>Method:</b> {{ payment.paymentMethod }}</p>
        <p><b>Payment Status:</b> {{ payment.paymentStatus }}</p>
        <p><b>Amount to be refunded:</b> ${{ payment.amount }}</p>

      
      </div>
    </v-card-text>
      </v-col>
      <v-col class="d-flex justify-end"> <!-- v-if="payments.length > 0" ensures payments isn't null. Take advantage of using incline code within tags -->
    <button class="refundButton" v-if="payments.length > 0" @click="navigateToRefund()" :disabled="payments[0].paymentStatus == 'refunded'">
          {{ payments[0].paymentStatus == 'refunded' ? "Refunded" : "Submit Refund" }}
        </button>
 

      </v-col>
  </v-row>

  </v-card>


    


</template>

<style>
.refundButton {
  background-color: red;
  color: white;
  height:30%;
  width:25%;
  margin: 6.5% 5% 0% 0%;

}

.refundButton:disabled {
  background-color: grey; 
  color: lightgray;
}



</style>
