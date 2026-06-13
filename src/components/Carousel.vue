<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRouter } from "vue-router";
import ShowServices from '../services/ShowServices.js';

const router = useRouter();


function goToSeatMap() {
  router.push({ name: 'seatMap' });
}

const carouselConfig = { 
  itemsToShow: 1, // 2.5 cuts off slide, do a whole number
  wrapAround: true,
  autoplay:"5000"
}

const shows = ref([]);
// CSS Styles
const slide = ref('img')
const slideInfo = ref('infoDiv')
const CarouselPagination = ref('pagnation')
const CarouselStyle = ref("carousel")
const navigationStyle = ref("navigation")
const getTicketsButton = ref("getTicketsButton")


onMounted(async () => {
  await getShows();

});

async function getShows() {

    await ShowServices.getShows()
      .then((response) => {
        shows.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } 

  function navigateToSelectedShow(show) { // can't use props here because this isn't the parent of SelectedShow?
  router.push({ name: "selectedShow", params: { id: show.id } }); // just push the show through
}




</script>

<template>
  <Carousel id="bannerCarousel" v-bind="carouselConfig">
    <Slide v-for="show in shows" :key="show.id"> <!-- iterate through shows list -->
     <img :src="'/default.png'" class="carousel__item" /> 
      <div class="infoDiv">
      <h3> {{ show.name }}</h3>
      <p> {{ show.description }}</p>

         
      <button id="getTicketsButton" @click="navigateToSelectedShow(show)"> View show </button>
      </div>
    </Slide>

    <template #addons> <!-- add ons for extra stuff -->
      <Navigation id="navigation" /> <!-- left and right arrows -->
    </template>
  </Carousel>
</template>


<style>

img{
  width:50%;
  height:90%;
}

.infoDiv{
  margin:4%;
  text-align: left;
}



#bannerCarousel{
  margin: 5% 0% 10% 0%;
  background-color: rgb(66, 58, 59);
  color:white;
}

#getTicketsButton{
  margin: 10% 0% 0% 0%;
  background-color: rgb(255, 0, 0);
  color: aliceblue;
  width:200px;
  height: 50px;
  
  
}

#navigation{
  margin: 0% -7% 0% -7%;
}

</style>