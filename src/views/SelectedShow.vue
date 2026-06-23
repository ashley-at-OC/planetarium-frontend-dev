<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import ShowServices from "../services/ShowServices.js";
import ShowtimeServices from "../services/ShowtimeServices.js";

const route = useRoute();
const router = useRouter();



// Stash the selected show's id so SeatMap.vue can fetch its price from the backend
function goToSeatMap(selectedShowId, selectedShowtimeId) {
  // localStorage.setItem("selectedShowId", show.value.id);  
router.push({name: "seatMap",params: {showId: selectedShowId, showtimeId: selectedShowtimeId}
});
}


// reminder: need to have a reference when pulling data from DB
const showtimes = ref([]); // a list of all showtimes fetched using the 


const show = ref({
  id: null,
  name: "",
  description: "",
  price: 0,
  durationMinutes: 0,
});


// CSS Styles
const showDetails = ref("showDetails");
const showDetailsImage = ref("showDetailsImage");
const buttonList = ref("buttonList");
const showtimeButton = ref("showtimeButton");



onMounted(async () => {
  await getShow();
  await getShowtimes(); // a list of all showtimes fetched using the show (show) id
});



async function getShow() {
  await ShowServices.getShow(route.params.id) // catch from Carousel's route.push() 
    .then((response) => {
      show.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}


// stole from ShowCardComponent
async function getShowtimes() {
    await ShowtimeServices.getShowtimesForShow(show.value.id)
      .then((response) => {
        showtimes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });

      // convert DateTime format into more readable time format (hh:mm)
      // shouldn't modify database
      for (let i = 0; i < showtimes.value.length; ++i)
      {
        var date = new Date(showtimes.value[i].startDateTime);
        var time = date.toLocaleTimeString([],  {  
           hour: "numeric", minute: "2-digit"
        });
        showtimes.value[i].formattedTime = time; // store back into showtimes under formattedTime (you can dynamically add a new property in Vue)
      }


  } 

 function navigateToHome()
 {
    router.push({ name: "recipes"});
 }


</script>


<template>
    <v-container>
      <v-icon
      size="80"
      icon="mdi-keyboard-backspace"
       @click="navigateToHome()"
      />
 
<h1> 
{{ show.name }}

</h1>
  <div id="showDetails">   
  <img id="showDetailsImage" :src="'/default.png'" /> 
  <div id="text">
<p>{{ show.description }}</p>

<div id="chips">
<v-chip>{{show.durationMinutes }} minutes</v-chip>
<v-chip>${{show.price }}</v-chip>
</div>
</div>

</div>

<!-- <button id="getTicketsButton" @click="goToSeatMap"> View show </button> -->
  
<div id="buttonList"> 


  <button id="showtimeButton" v-for="showtime in showtimes" :key="showtime.id" @click="goToSeatMap(show.id, showtime.id)"> 
  <h3> {{ showtime.formattedTime }}</h3>
</button>
</div>

</v-container>
</template>

<style>

#showDetails {
  margin: 4%;
  display: flex;

}

#showDetailsImage
{
  margin: 0% 5% 0% 5%;
  width: 40%;
  height: 30%;
}

#showtimeButton{
  margin: 0% 3% 0% 3%;
  background-color: rgb(228, 222, 222);
  color:black;
  width: 10%;
  font-size: medium;
}

#buttonList{
  display: flex;



}

</style>