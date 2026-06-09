import apiClient from "./services";

export default {
  getSeats() {
    return apiClient.get("seats");
  },
};
