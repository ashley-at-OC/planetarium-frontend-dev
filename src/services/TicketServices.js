import apiClient from "./services";

export default {
    getTickets() {
        return apiClient.get("tickets");
    },

    getTicket(id) {
        return apiClient.get("tickets/" + id);
    },
    getTicketsForBooking(bookingId) {
        return apiClient.get("tickets/booking/" + bookingId);
    },

    getTicketsForShowtime(showtimeId) {
        return apiClient.get("tickets/showtime/" + showtimeId);
    },
    addTicket(ticket) {
        return apiClient.post("tickets", ticket);
    },
    updateTicket(id, ticket) { // NOTICE THAT THIS HAS TWO PARAMETERS AND NOT ONE. 
        return apiClient.put("tickets/" + id, ticket);
    },
    deleteTicket(ticketId) {
        return apiClient.delete("tickets/" + ticketId);
    },
};
