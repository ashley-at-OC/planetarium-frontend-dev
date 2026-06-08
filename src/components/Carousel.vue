<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import { useRouter } from "vue-router";
import IngredientServices from '../services/IngredientServices.js';

const router = useRouter();

const router = useRouter();

function goToSeatMap() {
  router.push({ name: 'seatMap' });
}

const carouselConfig = { 
  itemsToShow: 1, // 2.5 cuts off slide, do a whole number
  wrapAround: true,
  autoplay:"5000"
}

const ingredients = ref([]);
// CSS Styles
const slide = ref('img')
const slideInfo = ref('infoDiv')
const CarouselPagination = ref('pagnation')
const CarouselStyle = ref("carousel")
const getTicketsButton = ref("getTicketsButton")


onMounted(async () => {
  await getIngredients();

});

async function getIngredients() {

    await IngredientServices.getIngredients()
      .then((response) => {
        ingredients.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } 

  function navigateToSelectedShow(ingredient) { // can't use props here because this isn't the parent of SelectedShow?
  router.push({ name: "selectedShow", params: { id: ingredient.id } }); // just push the ingredient through
}




</script>

<template>
  <Carousel id="bannerCarousel" v-bind="carouselConfig">
    <Slide v-for="ingredient in ingredients" :key="ingredient.id"> <!-- iterate through ingredients list -->
     <img :src="'/oc_logo.png'" class="carousel__item" /> 
      <div class="infoDiv">
      <h3> {{ ingredient.name }}</h3>
      <p> {{ ingredient.description }}</p>

         
      <button id="getTicketsButton" @click="navigateToSelectedShow(ingredient)"> Get tickets now! </button>
      </div>
    </Slide>

    <template #addons> <!-- add ons for extra stuff -->
      <Navigation /> <!-- left and right arrows -->
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

</style>