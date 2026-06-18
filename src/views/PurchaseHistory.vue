<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import BookingServices from "../services/BookingServices";
import PaymentServices from "../services/PaymentServices";
import PurchaseCardComponent from "../components/PurchaseCardComponent.vue";
import BookingCardComponent from "../components/BookingCardComponent.vue";



const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const user = ref(null);
//const bookings
const bookings = ref([]);
// const bookingDates = ref([]);
// get list of Booking createdAt


onMounted(async () => {
   user.value = JSON.parse(localStorage.getItem("user"));
  console.log("USER" + user.value.id);

  await getBookingsByUserId();

  /*
  // get unique list of Booking createdAt to sort by date 
  for (let i = 0; i < bookings.value.length; i++) {
    const date = bookings.value[i].createdAt;
    if (!bookingDates.value.includes(date)) {
      bookingDates.value.push(date);
    console.log("All dates:", bookingDates.value);
    }
  }
*/

});


async function getBookingsByUserId() {
  await BookingServices.getBookingsByUserId(user.value.id) // change to bookings plural? Why is this singular?
    .then((response) => {
      bookings.value = response.data;

    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}




function closeSnackBar() {
  snackbar.value.value = false;
}



</script>



<template>
  <v-container>
     <div id="body">


        <h1>Your purchase history...</h1>
  

      <!--
      put bookingDates in here, should be iterating through an array of dates 
      <PurchaseCardComponent
        v-for="date in bookingDates" 
        :key="date"
        :date="date"
      />
      -->

          <PurchaseCardComponent
        v-for="booking in bookings" 
        :key="booking"
        :booking="booking"
      />

        

     </div>
  </v-container>
</template>