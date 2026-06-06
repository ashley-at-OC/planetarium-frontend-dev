<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import { ref } from 'vue';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const carouselConfig = { 
  itemsToShow: 1, // 2.5 cuts off slide, do a whole number
  wrapAround: true,
  autoplay:"5000"
}

// CSS Styles
const slide = ref('img')
const slideInfo = ref('infoDiv')
const CarouselPagination = ref('pagnation')
const CarouselStyle = ref("carousel")
const getTicketsButton = ref("getTicketsButton")
const events = 
[
  { id: 1, src: "/oc_logo.png", title: "Event1", description: "Description1", time: "12:00PM - 1:00PM", date: "May 2nd" },
  { id: 2, src: "/oc_logo.png", title: "Event2", description: "Description2", time: "3:00PM - 4:00PM", date: "May 2nd"  },
  { id: 3, src: "/oc_logo.png", title: "Event3", description: "Description3", time: "5:00PM - 6:00PM", date: "May 2nd"  }
]
</script>

<template>
  <Carousel id="carousel" v-bind="carouselConfig">
    <Slide v-for="event in events" :key="event.id"> <!-- iterate through events list -->
     <img :src="event.src" class="carousel__item" /> 
      <div class="infoDiv">
      <h3> {{ event.title }}</h3>
      <p> {{ event.description }}</p>
      <p> {{ event.time }}</p>
      <p> {{ event.date }}</p>
      <button id="getTicketsButton"> Get tickets now! </button>
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



#carousel{
  margin: 5% 0% 10% 0%;
}

#getTicketsButton{
  margin: 10% 0% 0% 0%;
  padding: 15% 0% 15% 0%;
  background-color: blue;
  color: aliceblue;
  width:200%;
  
  
}

</style>