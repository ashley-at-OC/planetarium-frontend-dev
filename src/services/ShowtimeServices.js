import apiClient from "./services";

export default {
    getShowtimes(ingredientId) {
        return apiClient.get("ingredients/" + ingredientId + "/showtimes"); // showtimes should always come with an ingredientId
    },
    getShowtimesForIngredient(ingredientId) {
        return apiClient.get("ingredients/" + ingredientId + "/showtimes");
    },

    getShowtime(showtime) {
        return apiClient.get(
            "ingredients/" + showtime.ingredientId + "/showtimes/" + showtime.id
        );
    },
    addShowtime(showtime) {
        return apiClient.post(
            "ingredients/" + showtime.ingredientId + "/showtimes",
            showtime
        );
    },
    updateShowtime(showtime) {
        return apiClient.put(
            "ingredients/" + showtime.ingredientId + "/showtimes/" + showtime.id,
            showtime
        );
    },
    deleteShowtime(showtime) {
        return apiClient.delete(
            "ingredients/" + showtime.ingredientId + "/showtimes/" + showtime.id
        );
    },
};