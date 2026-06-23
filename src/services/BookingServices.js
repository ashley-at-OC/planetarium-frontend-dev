import apiClient from "./services";

export default {
    getBookings() {
        return apiClient.get("bookings");
    },
    getBooking(id) {
        return apiClient.get("bookings/" + id);
    },
    async addBooking(booking) { // need to return response for ticket creation in SeatMap.vue
        let response = await apiClient.post("bookings", booking);
        return response.data;
    },
    getBookingsByUserId(id) {
        return apiClient.get("bookings/user/" + id);
    },
    updateBooking(id, booking) {
        return apiClient.put("bookings/" + id, booking); // booking is now independent of Recipe? ID instead of booking.id
    },
    deleteBooking(bookingId) {
        return apiClient.delete("bookings/" + bookingId);
    },
    //email confirmation
    sendConfirmationEmail(bookingId, email) {
        return apiClient.post(`bookings/${bookingId}/email-confirmation`, {email,});
    },
};
