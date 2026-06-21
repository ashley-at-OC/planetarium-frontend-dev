<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import RecipeCardComponent from './RecipeCardComponent.vue';
import ShowServices from '../services/ShowServices.js';
import { useRouter } from "vue-router";


const router = useRouter();
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
  <h1> What's new? </h1>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="show in shows" :key="show.name"> <!-- iterate through events list -->
          <div class="infoDiv" @click="navigateToSelectedShow(show)">
      <img id="whatsNew" :src="show.imageURL || '/planetarium-frontend/default.png'" class="carousel__item" /> 
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
  margin: 10%;

}

#whatsNew{
  width: 70%;
  height: 10%;


}



#carousel{
  margin: 0% 0% 0% 4%;
  padding: 5%;

}

</style>