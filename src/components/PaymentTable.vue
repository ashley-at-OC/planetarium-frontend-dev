<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import BookingServices from "../services/BookingServices.js"
import PaymentServices from "../services/PaymentServices.js";

const props = defineProps({ // props only works for components within a View or component
   booking: { required: true }
});

const payments = ref([]);

const booking = ref(props.booking); // bookings passed in 
const isEdit = ref(false);
const isAdd = ref(false);
const router = useRouter();

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const newPayment = ref(
  {
    id: undefined,
    bookingId: booking.value.id,
    paymentMethod: undefined,
    paymentStatus: undefined,
    amount: undefined, 
    paidAt: undefined,
  }
)
async function addPayment() {

  newPayment.value.bookingId = booking.value.id; // redundant but just in case
  console.log("Add Payment:", newPayment.value);

  await PaymentServices.addPayment(newPayment.value) 
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Payment for ${booking.value.id} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getPaymentsByBookingId(booking.value.id); 
  
  }



async function getPaymentsByBookingId() {
    await PaymentServices.getPaymentsByBookingId(booking.value.id)
      .then((response) => {
        payments.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 


onMounted(() => {
  getPaymentsByBookingId();
});


</script>


<template>

       
            <tr v-for="item in payments" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.bookingId }}</td>
              <td>{{ item.paymentMethod }}</td>
              <td>{{ item.paymentStatus }}</td>
              <td>{{ item.amount }}</td>

              
            </tr>
        
     
</template>