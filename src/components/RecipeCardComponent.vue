<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeShowServices from "../services/RecipeShowServices.js";
import RecipeStepServices from "../services/RecipeStepServices";
import RecipeReports from "../reports/RecipeReports.js";

const router = useRouter();

const showDetails = ref(false);
const recipeShows = ref([]);
const recipeSteps = ref([]);
const user = ref(null);

const props = defineProps({
  recipe: {
    required: true,
  },
});

onMounted(async () => {
  await getRecipeShows();
  await getRecipeSteps();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getRecipeShows() {
  await RecipeShowServices.getRecipeShowsForRecipe(props.recipe.id)
    .then((response) => {
      recipeShows.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithShows(
    props.recipe.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

function navigateToEdit() {
  router.push({ name: "editRecipe", params: { id: props.recipe.id } });
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
          {{ recipe.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-account-circle-outline"></v-icon>
            {{ recipe.servings }} Servings
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ recipe.time }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-file-pdf-box"
            @click.stop="RecipeReports.generateRecipePDF(recipe)"
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
      {{ recipe.description }}
    </v-card-text>
    <v-expand-transition>
      <v-card-text class="pt-0" v-show="showDetails">
        <h3>Shows</h3>
        <v-list>
          <v-list-item
            v-for="recipeShow in recipeShows"
            :key="recipeShow.id"
          >
            <b
              >{{ recipeShow.quantity }}
              {{
                `${recipeShow.show.unit}${
                  recipeShow.quantity > 1 ? "s" : ""
                }`
              }}</b
            >
            of {{ recipeShow.show.name }} (${{
              recipeShow.show.pricePerUnit
            }}/{{ recipeShow.show.unit }})
          </v-list-item>
        </v-list>
        <h3>Recipe Steps</h3>
        <v-table>
          <thead>
            <tr>
              <th class="text-left">Step</th>
              <th class="text-left">Instruction</th>
              <th class="text-left">Shows</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="step in recipeSteps" :key="step.id">
              <td>{{ step.stepNumber }}</td>
              <td>{{ step.instruction }}</td>
              <td>
                <v-chip
                  size="small"
                  v-for="show in step.recipeShow"
                  :key="show.id"
                  pill
                  >{{ show.show.name }}</v-chip
                >
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-card-text>
    </v-expand-transition>
  </v-card>
</template>
