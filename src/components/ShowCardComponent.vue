
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";

const router = useRouter();

const showDetails = ref(false);

const user = ref(null);

const props = defineProps({
  ingredient: {
    required: true,
  },
});

onMounted(async () => {
  user.value = JSON.parse(localStorage.getItem("user"));
});

const showtimes = 
[
  { id: 1, name: "Thursdays", unit:"gallon", pricePerUnit: 2 },
  { id: 2, name: "Fridays", unit:"gallon", pricePerUnit: 2 },

]


function navigateToEdit() {
  router.push({ name: "editIngredient", params: { id: props.ingredient.id } });
}
</script>



<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="showDetails = !showDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          {{ ingredient.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ ingredient.unit }} Servings
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ ingredient.pricePerUnit }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-file-pdf-box"
            @click.stop="RecipeReports.generateRecipePDF(ingredient)"
          ></v-icon>
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="body-1">
      {{ ingredient.name }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Showtime</h3>
        <v-list> <!-- fill with actual data later -->
          <v-list-item
            v-for="showtime in showtimes" 
            :key="showtime.id"
          >
            {{ showtime.name }}
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
