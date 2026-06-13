<script setup>
import { onMounted, ref } from "vue";
import Seatchart from "seatchart"; //SeatChart.js library
import "seatchart/dist/seatchart.min.css";
import { useRouter } from "vue-router";
import SeatServices from "../services/SeatServices.js"; // Fetches seat data from the backend.
import ShowServices from "../services/ShowServices.js"; // Fetches show data from the backend

// For SeatChart.js to draw the seating chart.
const containerRef = ref(null);

// Used to push the user to the payment page.
const router = useRouter();

// Convert backend letters to integers for SeatChart.js. For example, A -> 0, B -> 1, ...
const rowToIndex = (row) => row.charCodeAt(0) - "A".charCodeAt(0);

// Fetch the seat list from the backend then hand the data to SeatChart.js
onMounted(async () => {
  try {
    const response = await SeatServices.getSeats();
    const seats = response.data;

    // Look up the show fromSelectedShow.vue). Fall back to $15 if it fails.
    let seatPrice = 15;
    const selectedShowId = localStorage.getItem("selectedShowId");
    if (selectedShowId) {
      try {
        const showResponse = await ShowServices.getShow(
          selectedShowId
        );
        const show = Array.isArray(showResponse.data)
          ? showResponse.data[0]
          : showResponse.data;
        if (show?.price) seatPrice = Number(show.price);
      } catch (showError) {
        console.log("Could not load show price; using fallback.", showError);
      }
    }

    // Pull out the handicap seats so we can pass them to SeatChart.js as a
    // special seat type. Subtract 1 from the backend to match the SeatChart library.
    const handicapSeats = seats
      .filter((s) => s.seatType === "handicap")
      .map((s) => ({ row: rowToIndex(s.seatRow), col: s.seatColumn - 1 }));

    // Build the reserved seat list from the backend's isBooked flag.
    const reservedSeats = seats
      .filter((s) => s.isBooked)
      .map((s) => ({ row: rowToIndex(s.seatRow), col: s.seatColumn - 1 }));

    // Compute grid size from the data.
    const rows = Math.max(...seats.map((s) => rowToIndex(s.seatRow))) + 1;
    const columns = Math.max(...seats.map((s) => s.seatColumn));

    // Create the SeatChart.js
    const seatchart = new Seatchart(containerRef.value, {
      map: {
        rows,
        columns,
        seatTypes: {
          default: {
            label: "Standard",
            cssClass: "Standard",
            price: seatPrice,
          },
          handicap: {
            label: "Handicap Accessible",
            cssClass: "Handicap",
            price: seatPrice,
            seats: handicapSeats,
          },
        },
        // Mark already booked seats as unavailable.
        reservedSeats,
        // Walkway between column 5 and column 6.
        columnSpacers: [5],
      },
      // Configure the built-in cart from SeatChart.js.
      cart: {
        visible: true,
        currency: "$",
        submitLabel: "Checkout",
      },
    });

    // When the user clicks checkout button we stash it in localStorage
    seatchart.addEventListener("submit", (event) => {
      // Convert each selected seat in the cart to its backend `id` by matching on row/col. 
      const selectedSeatIds = event.cart
        .map((cartSeat) => {
          const seat = seats.find(
            (s) =>
              rowToIndex(s.seatRow) === cartSeat.index.row &&
              s.seatColumn - 1 === cartSeat.index.col
          );
          return seat?.id;
        })

      // Stash the selection so the payment page can read it and POST it.
      localStorage.setItem("selectedSeatIds", JSON.stringify(selectedSeatIds));
      localStorage.setItem("selectedTotal", event.total);

      // Send the user to the payment page.
      router.push({ name: "payment" });
    });
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-2">Select Your Seats</h1>
    <p class="mb-4">
      Click on the available seats to select them. Then click "Checkout" to
      proceed to payment.
    </p>
    <!-- SeatChart.js renders the seating chart -->
    <div ref="containerRef" class="seatchart-container"></div>
  </v-container>
</template>

<style scoped>
/* Centers the SeatChart.js container on the page. */
.seatchart-container {
  margin: 0 auto;
}
</style>

<style>
/* Adds animation for seats on hover or click. */
.sc-seat {
  transition: transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease;
}

.sc-seat-available {
  background-color: #eab308 !important;
  color: white !important;
}

.sc-seat-available:hover {
  opacity: 1 !important;
  transform: scale(1.15);
  background-color: #ca8a04 !important;
  cursor: pointer;
  position: relative;
  z-index: 10;
}

/* Styles seats after the user selects them. */
.sc-seat-selected {
  background-color: #10b47d !important;
  color: white !important;
}

/* Reserved seats can't be clicked. */
.sc-seat-reserved:hover {
  cursor: not-allowed;
}

/* Handicap seats */
.sc-seat-available.Handicap {
  background-color: #3e84f5 !important;
  color: transparent !important; /* hide the "A1"/"A2" label */
  position: relative;
}
.sc-seat-available.Handicap::after {
  content: "♿";
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}
.sc-seat-available.Handicap:hover {
  background-color: #1e3fac !important;
}
</style>