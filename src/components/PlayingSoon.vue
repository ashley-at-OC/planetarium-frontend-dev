<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'
import RecipeCardComponent from './RecipeCardComponent.vue';


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



// Clicking an event will open a Card

</script>

<template>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="event in events" :key="event.id"> <!-- iterate through events list -->
      <div class="infoDiv">
      <img :src="event.src" class="carousel__item" /> 
      <h3> {{ event.title }}</h3>
      <p> {{ event.description }}</p>
      <p> {{ event.time }}</p>
      <p> {{ event.date }}</p>
      </div>
    </Slide>

    <template #addons> <!-- add ons for extra stuff -->
      <Navigation /> <!-- left and right arrows -->
      <Pagination class="pagination" /> <!-- little segments at the bottom indicating index -->
    </template>
  </Carousel>


</template>


<style>

img{
  width:30%;
  height:100%;
}

.infoDiv{
  margin:0%;
}

.pagination{
  margin: 0% 0% -4% 0%;
}

#carousel{
  margin: 0% 0% 0% 4%;
  padding: 5%;

}



</style>