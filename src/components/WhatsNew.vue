<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import RecipeCardComponent from './RecipeCardComponent.vue';
import IngredientServices from '../services/IngredientServices.js';
import { useRouter } from "vue-router";


const router = useRouter();
const ingredients = ref([]);

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

// Clicking an event will open a Card

</script>

<template>
  <h1> What's new? </h1>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="ingredient in ingredients" :key="ingredient.name"> <!-- iterate through events list -->
          <div class="infoDiv" @click="navigateToSelectedShow(ingredient)">
      <img id="whatsNew" :src="'/oc_logo.png'" class="carousel__item" /> 
      <h3> {{ ingredient.name }}</h3>
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