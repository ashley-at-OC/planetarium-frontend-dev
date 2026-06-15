import apiClient from "./services";

export default {
    getBookings() {
        return apiClient.get("bookings/");
    },
    getBookingsByUserId(userId) {
        return apiClient.get("bookings/user/" + userId);
    },
    getBooking(id) {
        return apiClient.get("bookings/" + id);
    },
    addBooking(booking) {
        return apiClient.post("bookings/", booking);
    },
    updateBooking(bookingId, booking) { // bookingId and Id...?
        return apiClient.put("bookings/" + bookingId, booking);
    },
    deleteBooking(bookingId) {
        return apiClient.delete("bookings/" + bookingId);
    },
};
