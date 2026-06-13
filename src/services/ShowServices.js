import apiClient from "./services";

export default {
  getShows() {
    return apiClient.get("shows");
  },
  getShow(id) {
    return apiClient.get("shows/" + id);
  },
  addShow(show) {
    return apiClient.post("shows", show);
  },
  updateShow(id, show) {
    return apiClient.put("shows/" + id, show); // show is now independent of Recipe? ID instead of show.id
  },
  deleteShow(showId) {
    return apiClient.delete("shows/" + showId);
  },
};
