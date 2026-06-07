<script setup>
// Import onMounted so we can create the seat chart after the page element exists.
import { onMounted, ref } from "vue";
// Import the SeatChart.js library
import Seatchart from "seatchart";
// Import the default SeatChart.js styles
import "seatchart/dist/seatchart.min.css";

// Create a Vue ref for the div where SeatChart.js will draw the seating chart.
const containerRef = ref(null);
// Later, these reserved seats will come from the backend.
const reservedSeats = [
  { row: 0, col: 4 },
  { row: 1, col: 5 },
  { row: 2, col: 2 },
  { row: 3, col: 7 },
  { row: 4, col: 0 },
];

// Run this once the component is mounted.
onMounted(() => {
  // Create the SeatChart.js instance inside the container div.
  new Seatchart(containerRef.value, {
    // Configure seat map layout.
    map: {
      rows: 6,
      columns: 10,
      // Define the seat type.
      seatTypes: {
        default: {
          label: "Standard",
          cssClass: "Standard",
          price: 15,
        },
        handicap: {
          label: "Handicap Accessible",
          cssClass: "Handicap",
          price: 15,
          seats: [
            { row: 0, col: 0 },
            { row: 0, col: 1 },
            { row: 0, col: 8 },
            { row: 0, col: 9 },
          ],
        },
      },

      // Mark already booked seats as unavailable.
      reservedSeats,
      // Add a visual walkway in the middle.
      columnSpacers: [5],
    },

    // Configure the built in cart from SeatChart.js.
    cart: {
      visible: true,
      currency: "$",
      submitLabel: "Checkout",
    },
  });
});
</script>

<template>
  <v-container>
    <h1 class="text-h4 mb-2">Select Your Seats</h1>
    <p class="mb-4">
      Click on the available seats to select them. Then click "Checkout" to
      proceed to payment.
    </p>
    <!-- SeatChart.js renders the seating chart inside this div. -->
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