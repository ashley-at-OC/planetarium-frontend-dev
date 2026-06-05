import apiClient from "./services";

export default {
  getIngredients() {
    return apiClient.get("ingredients");
  },
  getIngredient(id) {
    return apiClient.get("ingredients/" + id);
  },
  addIngredient(ingredient) {
    return apiClient.post("ingredients", ingredient);
  },
  updateIngredient(id, ingredient) {
    return apiClient.put("ingredients/" + id, ingredient); // ingredient is now independent of Recipe? ID instead of ingredient.id
  },
  deleteIngredient(ingredientId) {
    return apiClient.delete("ingredients/" + ingredientId);
  },
};
