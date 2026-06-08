
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";

const router = useRouter();

const showDetails = ref(false);

const user = ref(null);

const props = defineProps({ // show passed in from parent (IngredientList.vue)
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
            <v-icon start icon="mdi-cash"></v-icon>
            ${{ ingredient.price }} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ ingredient.duration }} minutes
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
      {{ ingredient.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Showtime</h3>
        
      <v-table>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Unit</th>
            <th class="text-left">Price Per Unit</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ingredients" :key="item.name">
            <td>{{ item.name }}</td>
            <td>{{ item.unit }}</td>
            <td>${{ item.pricePerUnit }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
            </td>
          </tr>
        </tbody>
      </v-table>
     
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
