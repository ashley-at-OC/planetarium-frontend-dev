<!-- Reference: https://vue3-carousel.ismail9k.com/getting-started.html --> 
<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Pagination, Navigation } from 'vue3-carousel'

const carouselConfig = { 
  itemsToShow: 3, // 2.5 cuts off slide
  wrapAround: true
}

const events = 
[
  { id: 1, src: "/oc_logo.png" },
  { id: 2, src: "/oc_logo.png" },
  { id: 3, src: "/oc_logo.png" }
]
</script>

<template>
  <Carousel v-bind="carouselConfig">
    <Slide v-for="event in events" :key="event.id">
     <img :src="event.src" class="carousel__item" />
    </Slide>

    <template #addons> <!-- add ons for extra stuff -->
      <Navigation /> <!-- left and right arrows -->
      <Pagination /> <!-- little segments at the bottom indicating index -->
    </template>
  </Carousel>
</template>


<style>




</style>