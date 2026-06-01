<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import RecipeCard from "../components/RecipeCardComponent.vue";
import RecipeServices from "../services/RecipeServices.js";

const recipes = ref([]);
const isAdd = ref(false);
const user = ref(null);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newRecipe = ref({
  name: "",
  description: "",
  servings: 0,
  time: "30",
  isPublished: false,
});

onMounted(async () => {
  await getRecipes();
  user.value = JSON.parse(localStorage.getItem("user"));
});

async function getRecipes() {
  user.value = JSON.parse(localStorage.getItem("user"));
  if (user.value !== null && user.value.id !== null) {
    await RecipeServices.getRecipesByUserId(user.value.id)
      .then((response) => {
        recipes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  } else {
    await RecipeServices.getRecipes()
      .then((response) => {
        recipes.value = response.data;
      })
      .catch((error) => {
        console.log(error);
        snackbar.value.value = true;
        snackbar.value.color = "error";
        snackbar.value.text = error.response.data.message;
      });
  }
}

async function addRecipe() {
  isAdd.value = false;
  newRecipe.value.userId = user.value.id;
  await RecipeServices.addRecipe(newRecipe.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newRecipe.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipes();
}

function openAdd() {
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <div id="body">
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Playing soon (or just any event in general for testing)
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAdd()"
            >Add</v-btn
          >
        </v-col>
      </v-row>

      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
        @deletedList="getLists()" 
      />

      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>
  </v-container>
</template>
