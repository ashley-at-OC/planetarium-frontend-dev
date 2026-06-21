<script setup>
import { onMounted } from "vue";
import { ref } from "vue";
import { Tabs, Tab } from 'super-vue3-tabs';
import ShowServices from "../services/ShowServices.js";
import SeatServices from "../services/SeatServices.js";
import ShowtimeServices from "../services/ShowtimeServices.js";
import UserServices from "../services/UserServices.js";
import BookingServices from "../services/BookingServices.js";
import TicketServices from "../services/TicketServices.js";
import ShowCardComponent from "../components/ShowCardComponent.vue";
import UserCardComponent from "../components/UserCardComponent.vue";
import BookingCardComponent from "../components/BookingCardComponent.vue";
import TicketCardComponent from "../components/TicketCardComponent.vue";

// Tab
const activeTab = ref('0');



// Snackbar
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

// Data retrieved from database gets put here
const shows = ref([]); // shows
const seats = ref([]); // seats
const users = ref([]);
const bookings = ref([]);
const tickets = ref([]);
const showtimes = ref([]);
const unreservedSeats = ref([]);

const ticketsForShowtime = ref([]);


// Dialog
const isAddShow = ref(false); // probably cleaner to pass in a value of "Show" or "User" + "Add" or "Edit" but editing happens in another page
const isAddUser= ref(false); 
const isAddBooking = ref(false);
const isAddTicket = ref(false);

// Currently logged in user
const user = ref(null);

// New object being built by user
const newShow = ref({
  id: undefined,
  name: undefined,
  description: undefined,
  price: undefined,
  // image: undefined,
  imageURL: undefined,
});

const newUser = ref({
  id: undefined,
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  password: undefined,
  role: undefined,
});

const newBooking = ref({
  id: undefined,
  userId: undefined,
  bookingStatus: undefined,
  totalPrice: undefined,
});


const newTicket = ref({
  id: undefined,
  bookingId: undefined,
  showtimeId: undefined,
  seatId: undefined,
  qrCode: undefined, 
  ticketStatus: undefined,
  ticketType: undefined,
  ticketPrice: undefined, 
  emailedAt: undefined,
  scannedAt: undefined
});



// Dropdown 
const dropdownSelectedShow = ref(null); // just to filter showtimes

//const dropdownSelectedShowtimeId = ref(null); // just to filter seats // actually do not need this because newTicket is global

const roles = ref(["customer", "admin"]);
const bookingStatuses = ref(["pending", "paid", "cancelled", "refunded", "expired"]);
const registeredUsers = ref([]);
const ticketTypes = ref(["adult", "child_under_8"]);
const ticketStatuses = ref(["valid", "used", "cancelled"])


// const registeredShows = ref([]); just use the shows array
const registeredSeats = ref([]);
const registeredShowtimes = ref([]);

// Stuff that gets displayed 
onMounted(async () => {

  await getShows(); 

  await getUsers();
  await getBookings();
  await getTickets();



  // get UserIds for registeredUsers
  for (let i = 0; i < users.value.length; i++) {
      registeredUsers.value.push(users.value[i].id);
    }
  console.log(registeredUsers);


  user.value = JSON.parse(localStorage.getItem("user")); // still not super sure what this is for? Maybe used for getting objects specific to a user account
});


function onChangeShowSelection() {
  console.log(dropdownSelectedShow.value.name + " " + dropdownSelectedShow.value.price);
  console.log("!!!SHOW ID " + dropdownSelectedShow.value.id);
  getShowtimes(dropdownSelectedShow.value.id);
  if(dropdownSelectedShow.value)
  newTicket.value.ticketPrice = dropdownSelectedShow.value.price;
}

function onChangeShowtimeSelection() {
  console.log("!!!SHOWTIME ID: " + newTicket.value.showtimeId);
  getTicketsForShowtime(newTicket.value.showtimeId);
  
}



// --------------------------------------------------- Shows (and showtimes)
async function getShows() {
  await ShowServices.getShows()
    .then((response) => {
      shows.value = response.data;

      console.log("SHOWS: " + shows.value.id);
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}



async function getShowtimes(showId) {

  
registeredShowtimes.value = []; // clear out previously selected show
  await ShowtimeServices.getShowtimesForShow(showId)
    .then((response) => {
      showtimes.value = response.data;
      // get startDateTimes for registered showtimes
      for (let i = 0; i < showtimes.value.length; i++) {
          registeredShowtimes.value.push(showtimes.value[i]); // push in the entire object
        }
      console.log(registeredShowtimes.value);
      
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}



async function addShow() {
  //close the dialog/modal
  isAddShow.value = false;
  //don't want to generate id in db
  delete newShow.id;
  //call service
  await ShowServices.addShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShow.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
    //refresh the show lists
  await getShows();
}

async function updateShow() {
  isEditShow.value = false;
  await ShowServices.updateShow(newShow.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newShow.name} updated successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getShows();
}

function openAddShow() {
  newShow.value.name = undefined;
  newShow.value.description = undefined;
  newShow.value.price = undefined;
  // newShow.value.image = undefined;
  newShow.value.imageURL = undefined;
  isAddShow.value = true;
}

function closeAddShow() {
  isAddShow.value = false;
}


// ----------------------------------- Users
async function getUsers() {
  await UserServices.getUsers() // change to users plural? Why is this singular?
    .then((response) => {
      users.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}



async function addUser() { // adding a new user does not have immediate changes (have to refresh)
  isAddUser.value = false;
  delete newUser.id;
  await UserServices.addUser(newUser.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newUser.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getUsers();
}


function openAddUser() {
  newUser.value.id = undefined;
  newUser.value.firstName = undefined;
  newUser.value.lastName = undefined;
  newUser.value.email = undefined;
  newUser.value.password = undefined;
  newUser.value.role = undefined;
  isAddUser.value = true;


}

function closeAddUser() {
  isAddUser.value = false;
}



//----------------------------- Bookings

async function getBookings() {
  await BookingServices.getBookings() // change to bookings plural? Why is this singular?
    .then((response) => {
      bookings.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


async function addBooking() { // adding a new booking does not have immediate changes (have to refresh)
  isAddBooking.value = false;
  delete newBooking.id;
  await BookingServices.addBooking(newBooking.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newBooking.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getBookings();
}


function openAddBooking() {
  newBooking.value.id = undefined;
  newBooking.value.userId = undefined;
  newBooking.value.bookingStatus = undefined;
  newBooking.value.totalPrice = undefined;
  isAddBooking.value = true;

}

function closeAddBooking() {
  isAddBooking.value = false;
}





// Tickets 
async function getTickets() {
  await TicketServices.getTickets() 
    .then((response) => {
      tickets.value = response.data;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
}


// Tickets 
async function getTicketsForShowtime(showtimeId) {
  const response =  await TicketServices.getTicketsForShowtime(showtimeId);  // showtimeId: 1 
   // .then((response) => { have to get rid of .then  because it conflicts with internal await on getUnreservedSeatsForShowtime
   ticketsForShowtime.value = response.data; // array of tickets for showtimeId: 1, [ticket1{...}, ticket2{...}, ...]

   for (var i = 0; i < ticketsForShowtime.length; ++i){
      console.log("Tickets: " + ticketsForShowtime.value.showtimeId);
   }
     await getUnreservedSeatsForShowtime(ticketsForShowtime.value);
 
}



async function getUnreservedSeatsForShowtime(ticketsForShowtime) { // array of seats whose seatId is not flagged by tickets

      await SeatServices.getSeats()
      .then((response) => {
      seats.value = response.data; // array of all seat objects

      unreservedSeats.value = []; // reset when showtime is changed in the dropdown
       let isReservedList = Array(60).fill(false);  // making a boolean map kind of // are there 75 or 60 seats? Come back to this later...
     

       //
       for (var i = 0; i < ticketsForShowtime.length; ++i)
       {
        isReservedList[ticketsForShowtime[i].seatId] = true; // mark true anywhere that ticket.seatId is present
       }

       // get the reverse of IsReservedList 
      for(var i = 0; i < seats.value.length; ++i) 
      {
        let seat = seats.value[i];
      if (!isReservedList[seat.id]) // includes is for values, not objects. Read this as "at index seat.id, is this not reserved?"
        {
            unreservedSeats.value.push(seat);
           // console.log("SEAT: " + seat.id);
        }
      }

    });
    
    

}


async function addTicket() { // adding a new booking does not have immediate changes (have to refresh)
  isAddTicket.value = false;
  await TicketServices.addTicket(newTicket.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newTicket.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message ;
    });
  await getTickets();
}


function openAddTicket() { // clears newTicket every time add dialog opens
  newTicket.value.id = undefined,
  newTicket.value.bookingId = undefined,
  newTicket.value.showtimeId = undefined,
  newTicket.value.seatId = undefined,
  newTicket.value.qrCode = undefined, 
  newTicket.value.ticketStatus = undefined,
  newTicket.value.ticketType = undefined,
  newTicket.value.ticketPrice = undefined,
  newTicket.value.emailedAt = undefined,
  newTicket.value.scannedAt = undefined,
  isAddTicket.value = true

}

function closeAddTicket() {
  isAddTicket.value = false;
}





function closeSnackBar() {
  snackbar.value.value = false;
}
</script>

<template>


  <v-container>
 
  <!-- https://mdsaban.com/packages/super-vue3-tabs-component/demo/ -->
  <Tabs>
    <Tab value="Shows">
      <template #icon>
        <i class="fas fa-home"></i>
      </template>
      
      <p>Maybe add some totals or something here</p>

      <!-- SHOWS -->

      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Shows
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.role === 'admin'" color="accent" @click="openAddShow()"
            >Add Show</v-btn
          >
        </v-col>
      </v-row>

      <!-- put showtime details in here -->
      <ShowCardComponent
        v-for="show in shows"
        :key="show.id"
        :show="show"
        @deletedList="getShows()"
      />


      <v-dialog persistent v-model="isAddShow" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Show</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newShow.name"
              label="Name"
              required
            ></v-text-field>

            <v-text-field
              v-model="newShow.description"
              label="Description"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newShow.price"
              label="Ticket Price"
              type="number"
            ></v-text-field>

           <v-text-field
              v-model.number="newShow.durationMinutes"
              label="Duration(in minutes)"
              type="number"
            ></v-text-field>        


             <!-- https://vuetifyjs.com/en/components/file-inputs/#usage -->
            <!-- need to try this later -->
            <!-- <v-file-input 
              v-model="newShow.image"
              label="Upload cover image"
              show-size
              clearable
            > </v-file-input> -->

              <v-text-field 
              v-model="newShow.imageURL"
              label="Upload image url"
              show-size
              clearable
            > </v-text-field>

            <!-- doesn't need a switch, probably need to copy this to Showtime -->
            <v-switch 
              v-model="newShow.isPublished"
              hide-details
              inset
              :label="`Publish? ${newShow.isPublished ? 'Yes' : 'No'}`"
            ></v-switch>


          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddShow()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addShow()"
              >Add Show</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </Tab>



    <!-- USERS   -->
    <Tab value="Users">
      <template #icon>
        <i class="fas fa-user"></i>
      </template>  
      <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Users
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null && user.role === 'admin'" color="accent" @click="openAddUser()"
            >Add User</v-btn
          >
        </v-col>
      </v-row>
      <!-- put Booking and Transaction details in here -->
       <!-- using account instead of user to not get confused with th eLOGGED IN user -->
      <UserCardComponent
        v-for="account in users" 
        :key="account.id"
        :user="account"
        @deletedList="getUsers()"
      />

    </Tab>


    <Tab value="Bookings">
      <template #icon>
        <i class="fas fa-cog"></i>
      </template>

       <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Bookings
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAddBooking()"
            >Add Booking</v-btn
          >
        </v-col>
      </v-row>
      <BookingCardComponent
      v-for="booking in bookings"
      :key="booking.id"
      :booking="booking"
      @deletedList="getBookings()"
      />
  
    </Tab>


    <!-- Tickets -->
    <Tab value="Tickets">
      <template #icon>
        <i class="fas fa-cog"></i>
      </template>

         <v-row align="center" class="mb-4">
        <v-col cols="10"
          ><v-card-title class="pl-0 text-h4 font-weight-bold"
            >Tickets
          </v-card-title>
        </v-col>
        <v-col class="d-flex justify-end" cols="2">
          <v-btn v-if="user !== null" color="accent" @click="openAddTicket()"
            >Add Ticket</v-btn
          >
        </v-col>
      </v-row>
      <TicketCardComponent
      v-for="ticket in tickets"
      :key="ticket.id"
      :ticket="ticket"
      @deletedList="getTickets()"
      />
  
    </Tab>



  </Tabs>
  
     <div id="body">


     
      <v-dialog persistent v-model="isAddUser" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new User</v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newUser.firstName"
              label="First name"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.lastName"
              label="Last name"
              required
            ></v-text-field>
            <v-text-field
              v-model="newUser.email"
              label="Email"
              required
            ></v-text-field>

            <v-text-field
              v-model="newUser.password"
              label="Password"
              required
           
            ></v-text-field>

            <v-select
              v-model="newUser.role"
              label="Account Role"
              :items="roles"
            ></v-select>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddUser()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addUser()"
              >Add User</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>



        
      <v-dialog persistent v-model="isAddBooking" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Booking</v-card-title>
          <v-card-text>

            <v-select
              v-model="newBooking.userId"
              label="User"
              :items="registeredUsers"
            ></v-select>

            <v-text-field
              v-model="newBooking.totalPrice"
              label="Total Price"

              required
            ></v-text-field>

            <v-select
              v-model="newBooking.bookingStatus"
              label="Status"
              :items="bookingStatuses"
            ></v-select>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddBooking()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addBooking()"
              >Add Booking</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>




          
      <v-dialog persistent v-model="isAddTicket" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Ticket</v-card-title>
          <v-card-text>

            
               <v-select
              v-model="newTicket.bookingId"
              label="Booking" 
              :items="bookings"
              item-title="id"  
              item-value="id" 
   
    
            ></v-select>

            <!-- Show -->
               <v-select
              v-model="dropdownSelectedShow"
              label="Show"

              item-title="name"  

              :items="shows"
              :item-value="(item)=>item"
              @update:modelValue="onChangeShowSelection" 



    
            ></v-select>
              <!-- @change is outdated for Vue3? Fix with: @update:modelValue -->
              <!-- item-value references a property of the object, not the object itself. Fix with: (item) => item 
            

              <!-- ShowTimeId -->
               <v-select
              v-model="newTicket.showtimeId" 
              label="Showtime"
              :items="registeredShowtimes"
              item-title="startDateTime"
               item-value="id"
               @update:modelValue="onChangeShowtimeSelection" 
            ></v-select>

        
      
            
               <v-select
              v-model="newTicket.seatId"
              label="Seat"
                item-title="seatNumber"  
              item-value="id" 
              :items="unreservedSeats"
              
             
    
            ></v-select>

            
    
      
            <v-select
              v-model="newTicket.ticketType"
              label="Type"
              :items="ticketTypes"
            ></v-select>


             <v-text-field
              v-model="newTicket.ticketPrice"
              label="Price"

            ></v-text-field>


       

            


                  
            <v-select
              v-model="newTicket.ticketStatus"
              label="Status"
              :items="ticketStatuses"
            ></v-select>
            

                   <v-text-field
              v-model="newTicket.qrCode"
              label="QR Code"

            ></v-text-field>
            

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAddTicket()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addTicket()"
              >Add Ticket</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>


      <v-snackbar v-model="snackbar.value" rounded="pill">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn
            :color="snackbar.color"
            variant="text"
            @click="closeSnackBar()"
          >
            Close
          </v-btn>
        </template>
      </v-snackbar>
    </div>

  </v-container>
</template>
