<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'

import { useRouter } from "vue-router";
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import RecipeCardComponent from './RecipeCardComponent.vue';
import ShowServices from '../services/ShowServices.js';

const router = useRouter();

const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const shows = ref([]);

const carouselConfig = { 
  itemsToShow: 4,
  wrapAround: false,
}

// CSS Styles

const slide = ref('img')
const slideInfo = ref('infoDiv')
const CarouselPagination = ref('pagnation')
const CarouselStyle = ref("carousel")




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

// Clicking an event will open a Card

</script>

<template>
  <h1> Playing Soon </h1>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="show in shows" :key="show.name"> <!-- iterate through events list -->
      
      <div class="infoDiv" @click="navigateToSelectedShow(show)">
   
      <img id="playingsoon" :src="show.imageURL || '/planetarium-frontend/default.png'" class="carousel__item" /> 
      <h3> {{ show.name }}</h3>

  
      </div>
    </Slide>

    <template #addons> <!-- add ons for extra stuff -->
      <Navigation /> <!-- left and right arrows -->
    </template>
  </Carousel>


</template>


<style>


.infoDiv{
  text-align: center;
  margin:o 10%;

}

#playingsoon{
  width: 80%;
  height: 15%;
  
  border-radius: 5%;


}



#carousel{
  margin: 0% 0% 0% 4%;
  padding: 5%;

}


.infoDiv {
  cursor: pointer;  
}

</style>