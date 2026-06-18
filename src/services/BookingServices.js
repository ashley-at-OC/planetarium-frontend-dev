import apiClient from "./services";

export default {
    getBookings() {
        return apiClient.get("bookings");
    },
    getBooking(id) {
        return apiClient.get("bookings/" + id);
    },
    getBookingsByUserId(id) {
        return apiClient.get("bookings/user/" + id);
    },




    addBooking(booking) {
        return apiClient.post("bookings", booking);
    },
    updateBooking(id, booking) {
        return apiClient.put("bookings/" + id, booking); // booking is now independent of Recipe? ID instead of booking.id
    },
    deleteBooking(bookingId) {
        return apiClient.delete("bookings/" + bookingId);
    },
};
