<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import ShowServices from "../services/ShowServices.js";
import RecipeShowServices from "../services/RecipeShowServices";
import RecipeStepServices from "../services/RecipeStepServices";
import RecipeServices from "../services/RecipeServices";

const route = useRoute();

const recipe = ref({});
const shows = ref([]);
const selectedShow = ref({});
const recipeShows = ref([]);
const recipeSteps = ref([]);
const isAddShow = ref(false);
const isEditShow = ref(false);
const isAddStep = ref(false);
const isEditStep = ref(false);
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});
const newStep = ref({
  id: undefined,
  stepNumber: undefined,
  instruction: undefined,
  recipeId: undefined,
  recipeShow: [],
});
const newShow = ref({
  id: undefined,
  quantity: undefined,
  recipeId: undefined,
  recipeStepId: undefined,
  showId: undefined,
});

onMounted(async () => {
  await getRecipe();
  await getRecipeShows();
  await getShows();
  await getRecipeSteps();
});

async function getRecipe() {
  await RecipeServices.getRecipe(route.params.id)
    .then((response) => {
      recipe.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });
}

async function updateRecipe() {
  await RecipeServices.updateRecipe(recipe.value.id, recipe.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${recipe.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipe();
}

async function getShows() {
  await ShowServices.getShows()
    .then((response) => {
      shows.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}

async function getRecipeShows() {
  await RecipeShowServices.getRecipeShowsForRecipe(route.params.id)
    .then((response) => {
      recipeShows.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addShow() {
  isAddShow.value = false;
  newShow.value.recipeId = recipe.value.id;
  newShow.value.showId = selectedShow.value.id;
  delete newShow.value.id;
  await RecipeShowServices.addRecipeShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Show added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeShows();
}

async function updateShow() {
  isEditShow.value = false;
  newShow.value.recipeId = recipe.value.id;
  newShow.value.showId = selectedShow.value.id;
  console.log(newShow);

  await RecipeShowServices.updateRecipeShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${selectedShow.value.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeShows();
}

async function deleteShow(show) {
  await RecipeShowServices.deleteRecipeShow(show)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${show.show.name} deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getRecipeShows();
}

async function checkUpdateShow() {
  if (newStep.value.recipeShow.length > 0) {
    console.log(newStep.value.recipeShow);
    for (let i = 0; i < newStep.value.recipeShow.length; i++) {
      newShow.value.id = newStep.value.recipeShow[i].id;
      newShow.value.quantity = newStep.value.recipeShow[i].quantity;
      newShow.value.recipeStepId = newStep.value.id;
      selectedShow.value.id =
        newStep.value.recipeShow[i].showId;
      await updateShow();
    }
  }
}

async function getRecipeSteps() {
  await RecipeStepServices.getRecipeStepsForRecipeWithShows(
    route.params.id
  )
    .then((response) => {
      recipeSteps.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

async function addStep() {
  isAddStep.value = false;
  newStep.value.recipeId = recipe.value.id;
  delete newStep.value.id;
  await RecipeStepServices.addRecipeStep(newStep.value)
    .then((data) => {
      newStep.value.id = data.data.id;
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateShow();

  await getRecipeSteps();
}

async function updateStep() {
  isEditStep.value = false;
  await RecipeStepServices.updateRecipeStep(newStep.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await checkUpdateShow();

  await getRecipeSteps();
}

async function deleteStep(step) {
  await RecipeStepServices.deleteRecipeStep(step)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Step deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getRecipeSteps();
}

function openAddShow() {
  newShow.value.id = undefined;
  newShow.value.quantity = undefined;
  newShow.value.recipeStepId = undefined;
  newShow.value.showId = undefined;
  selectedShow.value = undefined;
  isAddShow.value = true;
}

function openEditShow(show) {
  newShow.value.id = show.id;
  newShow.value.quantity = show.quantity;
  newShow.value.recipeStepId = show.recipeStepId;
  newShow.value.showId = show.showId;
  selectedShow.value = show.show;
  isEditShow.value = true;
}

function openAddStep() {
  newStep.value.id = undefined;
  newStep.value.stepNumber = undefined;
  newStep.value.instruction = undefined;
  newStep.value.recipeShow = [];
  isAddStep.value = true;
}

function openEditStep(step) {
  newStep.value.id = step.id;
  newStep.value.stepNumber = step.stepNumber;
  newStep.value.instruction = step.instruction;
  newStep.value.recipeShow = step.recipeShow;
  isEditStep.value = true;
}

function closeAddShow() {
  isAddShow.value = false;
}

function closeEditShow() {
  isEditShow.value = false;
}

function closeAddStep() {
  isAddStep.value = false;
}

function closeEditStep() {
  isEditStep.value = false;
}

function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>
  <v-container>
    <v-row align="center">
      <v-col cols="10"
        ><v-card-title class="pl-0 text-h4 font-weight-bold"
          >Edit Recipe
        </v-card-title>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-text>
            <v-row>
              <v-col>
                <v-text-field
                  v-model="recipe.name"
                  label="Name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model.number="recipe.servings"
                  label="Number of Servings"
                  type="number"
                ></v-text-field>
                <v-text-field
                  v-model.number="recipe.time"
                  label="Time to Make (in minutes)"
                  type="number"
                ></v-text-field>
                <v-switch
                  v-model="recipe.isPublished"
                  hide-details
                  inset
                  :label="`Publish? ${recipe.isPublished ? 'Yes' : 'No'}`"
                ></v-switch>
              </v-col>
              <v-col>
                <v-textarea
                  v-model="recipe.description"
                  rows="10"
                  label="Description"
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pt-0">
            <v-btn variant="flat" color="primary" @click="updateRecipe()"
              >Update Recipe</v-btn
            >
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Shows </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddShow()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
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
                <template v-slot:append>
                  <v-row>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditShow(recipeShow)"
                    ></v-icon>
                    <v-icon
                      class="mx-2"
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteShow(recipeShow)"
                    ></v-icon>
                  </v-row>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="rounded-lg elevation-5">
          <v-card-title
            ><v-row align="center">
              <v-col cols="10"
                ><v-card-title class="headline">Steps </v-card-title>
              </v-col>
              <v-col class="d-flex justify-end" cols="2">
                <v-btn color="accent" @click="openAddStep()">Add</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-table>
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
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-pencil"
                      @click="openEditStep(step)"
                    ></v-icon>
                  </td>
                  <td>
                    <v-icon
                      size="x-small"
                      icon="mdi-trash-can"
                      @click="deleteStep(step)"
                    >
                    </v-icon>
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card-text> </v-card
      ></v-col>
    </v-row>

    <v-dialog
      persistent
      :model-value="isAddShow || isEditShow"
      width="800"
    >
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">{{
          isAddShow
            ? "Add Show"
            : isEditShow
            ? "Edit Show"
            : ""
        }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-text-field
                v-model="newShow.quantity"
                label="Quantity"
                type="number"
                required
              >
              </v-text-field>
            </v-col>

            <v-col>
              <v-select
                v-model="selectedShow"
                :items="shows"
                item-title="name"
                item-value="unit"
                label="Shows"
                return-object
                required
              >
                <template v-slot:prepend>
                  {{
                    `${
                      selectedShow && selectedShow.unit
                        ? selectedShow.unit
                        : ""
                    }${newShow.quantity > 1 ? "s" : ""}`
                  }}
                  of
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddShow
                ? closeAddShow()
                : isEditShow
                ? closeEditShow()
                : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="
              isAddShow
                ? addShow()
                : isEditShow
                ? updateShow()
                : false
            "
            >{{
              isAddShow
                ? "Add Show"
                : isEditShow
                ? "Update Show"
                : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog persistent :model-value="isAddStep || isEditStep" width="800">
      <v-card class="rounded-lg elevation-5">
        <v-card-title class="headline mb-2">
          {{ isAddStep ? "Add Step" : isEditStep ? "Edit Step" : "" }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="newStep.stepNumber"
            label="Number"
            type="number"
            required
          ></v-text-field>

          <v-textarea
            v-model="newStep.instruction"
            label="Instruction"
            required
          ></v-textarea>

          <v-select
            v-model="newStep.recipeShow"
            :items="recipeShows"
            item-title="show.name"
            item-value="id"
            label="Shows"
            return-object
            multiple
            chips
            required
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            variant="flat"
            color="secondary"
            @click="
              isAddStep ? closeAddStep() : isEditStep ? closeEditStep() : false
            "
            >Close</v-btn
          >
          <v-btn
            variant="flat"
            color="primary"
            @click="isAddStep ? addStep() : isEditStep ? updateStep() : false"
            >{{
              isAddStep ? "Add Step" : isEditStep ? "Update Step" : ""
            }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>
