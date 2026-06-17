import apiClient from "./services";

export default {
    getPayments() {
        return apiClient.get("payments");
    },
    getPayment(id) {
        return apiClient.get("payments/" + id);
    },
    getPaymentsForBooking(bookingId) {
        return apiClient.get("bookings/" + bookingId + "/payments");
    },
    addPayment(payment) {
        return apiClient.post("payments", payment);
    },
    updatePayment(id, payment) {
        return apiClient.put("payments/" + id, payment); // payment is now independent of Recipe? ID instead of payment.id
    },
    deletePayment(paymentId) {
        return apiClient.delete("payments/" + paymentId);
    },
};
