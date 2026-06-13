import apiClient from "./services";

export default {
  getRecipeShows() {
    return apiClient.get("recipeShows");
  },
  getRecipeShowsForRecipe(recipeId) {
    return apiClient.get("recipes/" + recipeId + "/recipeShows");
  },
  getRecipeShowsForRecipeStep(recipeId, recipeStepId) {
    return apiClient.get(
      "recipes/" +
      recipeId +
      "/recipeSteps/" +
      recipeStepId +
      "/recipeShowsWithShows"
    );
  },
  getRecipeShow(recipeShow) {
    return apiClient.get(
      "recipes/" +
      recipeShow.recipeId +
      "/recipeShows/" +
      recipeShow.id
    );
  },
  addRecipeShow(recipeShow) {
    return apiClient.post(
      "recipes/" + recipeShow.recipeId + "/recipeShows",
      recipeShow
    );
  },
  updateRecipeShow(recipeShow) {
    return apiClient.put(
      "recipes/" +
      recipeShow.recipeId +
      "/recipeShows/" +
      recipeShow.id,
      recipeShow
    );
  },
  deleteRecipeShow(recipeShow) {
    return apiClient.delete(
      "recipes/" +
      recipeShow.recipeId +
      "/recipeShows/" +
      recipeShow.id
    );
  },
};
