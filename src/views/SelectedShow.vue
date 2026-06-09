<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import IngredientServices from "../services/IngredientServices.js";


const route = useRoute();
const router = useRouter();

// Stash the selected show's id so SeatMap.vue can fetch its price from the backend
function goToSeatMap() {
  localStorage.setItem("selectedShowId", ingredient.value.id);
  router.push({ name: "seatMap" });
}

const ingredients = ref([]);

const ingredient = ref({
  id: null,
  name: "",
  description: "",
  price: 0,
  duration: 0,
});


// CSS Styles
const showDetails = ref("showDetails");



onMounted(async () => {
  await getIngredient();
});

async function getIngredient() {
  await IngredientServices.getIngredient(route.params.id)
    .then((response) => {
      ingredient.value = Array.isArray(response.data) ? response.data[0] : response.data; // in case there is an array
    })
    .catch((error) => {
      console.log(error);
    });
}

</script>


<template>
    <v-container>
 
<h1> 
{{ ingredient.name }}

</h1>
  <div id="showDetails">   
  <img id="showDetailsImage" :src="'/default.png'" /> 
  <div id="text">
<p>{{ ingredient.description }}</p>

<div id="chips">
<v-chip>{{ingredient.duration }} minutes</v-chip>
<v-chip>${{ingredient.price }}</v-chip>
</div>
</div>

</div>

<button id="tempButton" @click="goToSeatMap"> Get Tickets </button>


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
  width: 20%;
  height: 30%;
}

#tempButton{
  margin: 0% 0% 0% 50%;
  background-color: rgb(255, 0, 0);
  color:white;
  width: 20%;
  font-size: medium;

}


</style>