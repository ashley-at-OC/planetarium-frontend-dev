import apiClient from "./services";

export default {
    getShowtimes(showId) {
        return apiClient.get("shows/" + showId + "/showtimes"); // showtimes should always come with an showId
    },
    getShowtimesForShow(showId) {
        return apiClient.get("shows/" + showId + "/showtimes");
    },

    getShowtime(showtime) {
        return apiClient.get(
            "shows/" + showtime.showId + "/showtimes/" + showtime.id
        );
    },
    addShowtime(showtime) {
        return apiClient.post(
            "shows/" + showtime.showId + "/showtimes",
            showtime
        );
    },
    updateShowtime(showtime) {
        return apiClient.put(
            "shows/" + showtime.showId + "/showtimes/" + showtime.id,
            showtime
        );
    },
    deleteShowtime(showtime) {
        return apiClient.delete(
            "shows/" + showtime.showId + "/showtimes/" + showtime.id
        );
    },
};