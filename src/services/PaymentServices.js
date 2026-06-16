import apiClient from "./services";

export default {
    getPayments() {
        return apiClient.get("payments/");
    },
    getPaymentsByBookingId(bookingId) {
        return apiClient.get("payments/booking/" + bookingId);
    },
    getPayment(id) {
        return apiClient.get("payments/" + id);
    },
    addPayment(payment) {
        return apiClient.post("payments/", payment);
    },
    updatePayment(paymentId, payment) {
        return apiClient.put("payments/" + paymentId, payment);
    },
    deletePayment(paymentId) {
        return apiClient.delete("payments/" + paymentId);
    },
};
