<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref, onMounted } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import RecipeCardComponent from './RecipeCardComponent.vue';
import IngredientServices from '../services/IngredientServices.js';


const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
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
const events = 
[
  { id: 1, src: "/oc_logo.png", title: "Event1", time: "12:00PM - 1:00PM", date: "May 2nd" },
  { id: 2, src: "/oc_logo.png", title: "Event2", time: "3:00PM - 4:00PM", date: "May 2nd"  },
  { id: 3, src: "/oc_logo.png", title: "Event3", time: "5:00PM - 6:00PM", date: "May 2nd"  },
  { id: 4, src: "/oc_logo.png", title: "Event4", time: "12:00PM - 1:00PM", date: "May 2nd" },
  { id: 5, src: "/oc_logo.png", title: "Event5", time: "3:00PM - 4:00PM", date: "May 2nd"  },
  { id: 6, src: "/oc_logo.png", title: "Event6", time: "5:00PM - 6:00PM", date: "May 2nd"  }
]



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


// Clicking an event will open a Card

</script>

<template>
  <h1> What's new? </h1>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="ingredient in ingredients" :key="ingredient.name"> <!-- iterate through events list -->
      <div class="infoDiv">
      <a class="text-link" href="www.google.com">
      <img id="whatsNew" :src="'/oc_logo.png'" class="carousel__item" /> 
      <h3> {{ ingredient.name }}</h3>
      </a>
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