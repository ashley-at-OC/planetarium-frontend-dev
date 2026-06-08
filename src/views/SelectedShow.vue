<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import IngredientServices from "../services/IngredientServices.js";


const route = useRoute();
const router = useRouter();

function goToSeatMap() {
  router.push({ name: "seatMap" });
}
// got rid of a lot of stuff for now
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
  <img id="showDetailsImage" :src="'/oc_logo.png'" /> 
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
  background-color: blue;
  color:white;
  width: 10%;

}


</style>