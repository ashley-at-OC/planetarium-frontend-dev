<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import BookingServices from "../services/BookingServices.js";
import UserServices from "../services/UserServices.js";
import PaymentTable from "./PaymentTable.vue";


const props = defineProps({ // props only works for components within a View (parent --> child)
   user: { required: true }
});


// user -> booking -> payment

const user = ref(props.user);  // change to user
const isEdit = ref(false);
const isAdd = ref(false);
const currentUser = ref(null);
const router = useRouter();
const bookings = ref([]);




const userDetails = ref(false); // expanded or not expanded
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});


const newBooking = ref(
  {
    id: undefined,
    userId: user.value.id,
    bookingStatus: undefined,
    totalPrice: undefined,
  }
)


onMounted(async () => {
  console.log("USER ID:", user.value.id);
  getBookingsByUserId(user.value.id); 

  currentUser.value = JSON.parse(localStorage.getItem("user"));
});


// ---------------------- Booking functions --------------------------------------


// opening the dialog
function openAdd() {
  newBooking.value.startDateTime = "";
  newBooking.value.endDateTime = "";
  newBooking.value.attendeeCount = undefined;
  newBooking.value.isActive = false;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

async function addBooking() {
  isAdd.value = false;
  newBooking.value.userId = user.value.id; // redundant but just in case
  console.log("AddBooking:", newBooking.value);

  await BookingServices.addBooking(newBooking.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newBooking.value.name} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getBookingsByUserId(user.value.id); 
}



async function editBooking() {
  isEdit.value = false; // closes the dialog pop-up
  newBooking.value.userId = user.value.id; // redundant but just in case
  await BookingServices.updateBooking(newBooking.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newBooking.value.name} editted successfully!`; 
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getBookingsByUserId(user.value.id); 
}

/*

*/



// still needs to be updated to Booking + Transactions
async function getBookingsByUserId() {
    await BookingServices.getBookingsByUserId(user.value.id)
      .then((response) => {
        bookings.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 

// for Booking, Show gets editted elsewhere
function openEdit(item) {
  newBooking.value.id = item.id;
  newBooking.value.userId = item.userId;
  newBooking.value.startDateTime = item.startDateTime;
  newBooking.value.endDateTime = item.endDateTime;
  newBooking.value.attendeeCount = item.attendeeCount;
  newBooking.value.isActive = item.isActive;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}





  
async function deleteUser() { // still on Show functions
  await UserServices.deleteUser(user.value.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `User deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

 await getUsers();
}


// directly pass item into deleteBooking since there is no specific booking ref

async function deleteBooking(item) { // still on Show functions
  await BookingServices.deleteBooking(item)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Booking deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getBookingsByUserId(user.value.id); 
}



function navigateToEdit() {

  console.log("SHOW:", user);
  console.log("SHOW ID:", user.value.id);
  // console.log("SHOW ID:", show.id);


 router.push({ name: "editUser", params: { id: user.value.id } });

}




function closeSnackBar() {
  snackbar.value.value = false;
}


</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="userDetails = !userDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          ID {{ user.firstName }} {{ user.lastName }}
          <!-- change color of chip for different user types? -->
          <v-chip class="ma-2" color="blue" label>
            <v-icon start icon="mdi-account-circle"></v-icon>
            {{ user.role }} 
          </v-chip>
          
        </v-col>
        <v-col>
    

          <v-icon
            v-if="currentUser !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
            <v-icon
            v-if="currentUser !== null"
            size="small"
            icon="mdi-delete"
            @click.stop="deleteUser()"
          ></v-icon>
        </v-col>

      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="userDetails">
         {{ user.email }}

         <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">First Name</th>
            <th class="text-left">Last Name</th>
            <th class="text-left">Email</th>
            <th class="text-left">Created At</th>
            <th class="text-left">Updated At</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ user.id }}</td>
            <td>{{ user.firstName }}</td>
            <td>{{ user.lastName }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.createdAt}}</td>
            <td>{{ user.updatedAt }}</td>
          </tr>

          </tbody>
      </v-table>
   

        <br>
        <hr>
        <br>


        <v-row>
            <v-col class="d-flex justify-center">
        <h3>Bookings</h3>

               <v-icon 
              size="small"
              icon="mdi-plus" class="ml-2" 
              @click="openAdd()">
            </v-icon>
        <v-table>
          <thead>
            <tr>
                <th>ID</th>
                <th>User ID</th>
              <th>Status</th>
              <th>Total Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in bookings" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ item.userId }}</td>
              <td>{{ item.bookingStatus }}</td>
              <td>{{ item.totalPrice }}</td>

              <td>
                  <v-icon size="small" icon="mdi-pencil" @click="openEdit(item)" />
                <v-icon size="small" icon="mdi-delete" class="ml-2" @click.stop="deleteBooking(item)" />
              </td>
            </tr>
          </tbody>
        </v-table>

        
      </v-col>

        <v-col cols="6">
          <h3>Payments</h3>
    <v-table>
     <thead>
         <tr>
              <th>ID</th>
              <th>Booking ID</th>
              <th>Method</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
       <tbody>
  <PaymentTable v-for="item in bookings" :key="item.id" :booking="item" />
</tbody>
        </v-table>
    
        </v-col>

        </v-row>


    

       <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Booking </v-card-title>
          <v-card-text>
  
            <v-text-field
              v-model.number="newBooking.bookingStatus"
              label="Booking Status"
            ></v-text-field>
              <v-text-field
              v-model.number="newBooking.totalPrice"
              label="Total Price"
              type="number"
            ></v-text-field>
    
      
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addBooking()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!-- Edit Booking -->
       <v-dialog persistent v-model="isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"> Edit User </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newBooking.id"
              label="ID"
              type="datetime-local"
              required
            ></v-text-field>

            <v-text-field
              v-model="newBooking.userId"
              label="User ID"
              type="datetime-local"
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newBooking.totalPrice"
              label="Total price"
              type="number"
            ></v-text-field>

            <v-text-field
              v-model.number="newBooking.bookingStatus"
              label="Total price"
              type="number"
            ></v-text-field>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeEdit()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="editBooking()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
     
      </v-card-text>
    </v-expand-transition>
  </v-card>


  

  

   <v-snackbar v-model="snackbar.value" rounded="pill">
      {{ snackbar.text }}

      <template v-slot:actions>
        <v-btn :color="snackbar.color" variant="text" @click="closeSnackBar()">
          Close
        </v-btn>
      </template>
    </v-snackbar>

</template>

