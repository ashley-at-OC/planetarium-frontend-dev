<script setup>
import { onMounted, ref } from "vue";
import Seatchart from "seatchart"; //SeatChart.js library
import "seatchart/dist/seatchart.min.css";
import { useRoute, useRouter } from "vue-router";
import SeatServices from "../services/SeatServices.js"; // Fetches seat data from the backend.
import ShowServices from "../services/ShowServices.js"; // Fetches show data from the backend
import BookingServices from "../services/BookingServices.js";
import TicketServices from "../services/TicketServices.js"; 


let seats = ref([]);
const booking = ref(null);
const seatsWithTickets = ref([]);
// need to make multiple tickets...

const ticketsForShowtime = ref([]);
const user = ref(null);


// For SeatChart.js to draw the seating chart.
const containerRef = ref(null);

// Used to push the user to the payment page.
const router = useRouter();
const route = useRoute();

// Convert backend letters to integers for SeatChart.js. For example, A -> 0, B -> 1, ...
const rowToIndex = (row) => row.charCodeAt(0) - "A".charCodeAt(0);

// Fetch the seat list from the backend then hand the data to SeatChart.js
onMounted(async () => {

user.value = JSON.parse(localStorage.getItem("user"));

  try {
    const response = await SeatServices.getSeats();
    seats.value = response.data;
    console.log("SEAT" + seats.value[0].id);
    console.log("SEAT" + seats.value[1].id);



      
    getTicketsForShowtime(route.params.showtimeId);
    // Look up the show fromSelectedShow.vue. Fall back to $15 if it fails.
    let seatPrice = 15;
  //  const selectedShowId = localStorage.getItem("selectedShowId");
    console.log("ROUTE SHOWID:" + route.params.showId)
    if (route.params.showId) {
      try {
    console.log("Before" + route.params.showId);
        const showResponse = await ShowServices.getShow(route.params.showId);
        console.log(showResponse);
        const show = Array.isArray(showResponse.data)
          // If true the backend returns an array, take the first element. If false take the object directly. (Conditional)
          ? showResponse.data[0] : showResponse.data;
          // If show is null, show.price becomes undefined, the condition is false, seatPrice is not updated.
          // If a valid price exists, set seatPrice = show.price as Number for seat chart. (Optional Chaining).
        if (show?.price) seatPrice = Number(show.price);  
      } catch (showError) {
        console.log("Could not load show price; using fallback.", showError);
      }
    }

    // Pull out the handicap seats so we can pass them to SeatChart.js as a
    // special seat type. Subtract 1 from the backend to match the SeatChart library.
  
    const handicapSeats = seats.value 



    // Filters through the backend seat list array and only keeps the seats where s.seatType equals "handicap".
      .filter((s) => s.seatType === "handicap") 
      .map((s) => ({ row: rowToIndex(s.seatRow), col: s.seatColumn - 1 }));

    // Build the reserved seat list from the backend's isBooked flag.
    const reservedSeats = seatsWithTickets.value // doesn't work with Kim's database... need to do something else REPLACE

   // Filters through the seat list array and only keeps the seats where s.isBooked is true.
      .filter((s) => s.isBooked)
      .map((s) => ({ row: rowToIndex(s.seatRow), col: s.seatColumn - 1 }));

    // Compute grid size from the data.
    // Iterate through the seat list to find the max row and column.
    // Use ... to spread seat list into individual numbers to feed into Math.max which pulls the largest number.
    const rows = Math.max(...seats.value.map((s) => rowToIndex(s.seatRow))) + 1;
    const columns = Math.max(...seats.value.map((s) => s.seatColumn));

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
    seatchart.addEventListener("submit", async (event) => { // make async so that await can be used
      // Convert each selected seat in the cart to its backend `id` by matching on row/col. 
      const selectedSeatIds = event.cart
        .map((cartSeat) => {
          const seat = seats.value.find(
            (s) =>
              rowToIndex(s.seatRow) === cartSeat.index.row &&
              s.seatColumn - 1 === cartSeat.index.col
          );
          return seat?.id;
        })

      // Stash the selection so the payment page can read it and POST it.
      localStorage.setItem("selectedSeatIds", JSON.stringify(selectedSeatIds));
      localStorage.setItem("selectedTotal", event.total);

        // ------------------- Create booking and tickets --------------- (deletes itself later if the user doesn't commit to it)
        const newBooking = {
            id: undefined,
            userId: user.value.id,
            bookingStatus: "pending",
            totalPrice: event.total, // I think this is the total price?
        }

        const pendingBooking = await BookingServices.addBooking(newBooking); // need to return a booking so that ticket can use the bookingID
        console.log("new booking added:" + pendingBooking.id);
        const selectedTicketIds = [];
        const selectedSeatNumbers = [];

        // make a new ticket for every seat 
        for (let i = 0; i < selectedSeatIds.length; ++i)
        {
          const newTicket = {
            id: undefined,
            showtimeId: route.params.showtimeId,
            seatId: selectedSeatIds[i],
            bookingId: pendingBooking.id, // will this work...?
            ticketStatus: "valid",
            ticketType: "adult",
            ticketPrice: seatPrice,
            qrCode:  Date.now().toString() + Math.random().toString(36).slice(2) // asked AI to make a random string placeholder for the QR
          };
          const pendingTicket = await TicketServices.addTicket(newTicket);
             console.log("new ticket added:" + pendingTicket.data.id);
                console.log("new seat added:" + seats.value[i].seatNumber);
          selectedTicketIds.push(pendingTicket.data.id);
          selectedSeatNumbers.push(seats.value[selectedSeatIds[i]].seatNumber);
     
        }

    
      // Send the user to the payment page.
      // don't actually need to send bookingId because tickets should have the bookingId already
      router.push({ name: "payment", params: {seatNumbers: selectedSeatNumbers, ticketIds: selectedTicketIds }});

      
     
    });
  } catch (error) {
    console.log(error);
  }
});

//--------------------------------------------------------------


// Tickets 

// PASS ROUTE.PARAMS.SHOWTIMEID HERE
async function getTicketsForShowtime(showtimeId) {
  const response =  await TicketServices.getTicketsForShowtime(showtimeId); 
   
   ticketsForShowtime.value = response.data; 
     await getReservedSeatsForShowtime(ticketsForShowtime.value);
 
}

async function getReservedSeatsForShowtime(ticketsForShowtime) { // array of seats whose seatId is not flagged by tickets
      // use global seats variable

     let isReservedList = Array(60).fill(false);  // making a boolean map kind of // are there 75 or 60 seats? Come back to this later...
    
       for (var i = 0; i < ticketsForShowtime.length; ++i) // put true where ticket's seat ID is
       {
         isReservedList[ticketsForShowtime[i].seatId] = true;
       }
  //       console.log(isReservedList);


  //       console.log("SEATS LENGTH" + seats.value.length)
       // push seats into reservedSeats list
for(var i = 0; i < seats.value.length; ++i)   // hard code loop for now
      {

        let seat = seats.value[i];
        if(seat.id == 0 || seat.id == 1 || seat.id == 9)  // make A1, A2, A9, A10 handicap seats ... something in Lance's code makes the second to last seat handicapped
      {
        seat.seatType = "handicap";
      }

        if (isReservedList[seat.id]) // includes is for values, not objects. Read this as "at index seat.id, is this reserved?"
          {

              seatsWithTickets.value.push(seat);
         //     console.log("SEAT WITH TICKETS ARRAY");
              console.log("SEAT: " + seat.id + " " + seat.seatNumber + " ");


          }
      }
};



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