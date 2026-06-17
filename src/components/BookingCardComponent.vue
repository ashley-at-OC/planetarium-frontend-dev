<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import RecipeReports from "../reports/RecipeReports.js";
import PaymentServices from "../services/PaymentServices.js";
import BookingServices from "../services/BookingServices.js";

const props = defineProps({ // props only works for components within a View (parent --> child)
   booking: { required: true }
});

const booking = ref(props.booking);
const isEdit = ref(false);
const isAdd = ref(false);
const user = ref(null);
const router = useRouter();
const payments = ref([]);
const bookingDetails = ref(false); // expanded or not expanded
const snackbar = ref({
  value: false,
  color: "",
  text: "",
});




onMounted(async () => {
    await getPayments();
    user.value = JSON.parse(localStorage.getItem("user"));
});






// ---------------------- Payment functions --------------------------------------






const newPayment = ref({
  id: undefined,
  bookingId: undefined,
  paymentStatus: undefined,
  paymentMethod: undefined,
  amount: undefined,

});



// opening the dialog
function openAdd() {
  newPayment.value.paymentStatus = "";
  newPayment.value.paymentMethod = "";
  newPayment.value.amount = undefined;
  isAdd.value = true;
}

function closeAdd() {
  isAdd.value = false;
}

async function addPayment() {
  isAdd.value = false;
  newPayment.value.bookingId = booking.value.id; // redundant but just in case
  console.log("Add Payment:", newPayment.value);

  await PaymentServices.addPayment(newPayment.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Payment #${newPayment.value.id} added successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getPayments();
}



async function editPayment() {
  isEdit.value = false; // closes the dialog pop-up
  newPayment.value.bookingId = booking.value.id; // redundant but just in case
  console.log("NEW PAYMENT " + newPayment.value.id);
  await PaymentServices.updatePayment(newPayment.value.id, newPayment.value)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `${newPayment.value.id} editted successfully!`; 
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });
  await getPayments();
}


// for Payment, Booking gets editted elsewhere
function openEdit(item) {
  newPayment.value.id = item.id;
  newPayment.value.bookingId = item.bookingId;
  newPayment.value.paymentStatus = item.paymentStatus;
  newPayment.value.paymentMethod = item.paymentMethod;
  newPayment.value.amount = item.amount;
  isEdit.value = true;
}

function closeEdit() {
  isEdit.value = false;
}



async function getPayments() {
    await PaymentServices.getPaymentsForBooking(booking.value.id)
      .then((response) => {
        payments.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
  } 

  
async function deleteBooking() { // still on Booking functions
  await BookingServices.deleteBooking(booking.value.id)
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

  await getBookings();
}


// directly pass item into deletePayment since there is no specific payment ref

async function deletePayment(item) { // still on Booking functions
  await PaymentServices.deletePayment(item.id)
    .then(() => {
      snackbar.value.value = true;
      snackbar.value.color = "green";
      snackbar.value.text = `Payment deleted successfully!`;
    })
    .catch((error) => {
      console.log(error);
      snackbar.value.value = true;
      snackbar.value.color = "error";
      snackbar.value.text = error.response.data.message;
    });

  await getPayments();
}



function navigateToEdit() {
  router.push({ name: "editBooking", params: { id: booking.value.id } });
}




function closeSnackBar() {
  snackbar.value.value = false;
}


</script>

<template>
  <v-card
    class="rounded-lg elevation-5 mb-8"
    @click="bookingDetails = !bookingDetails"
  >
    <v-card-title class="headline">
      <v-row align="center">
        <v-col cols="10">
          ID {{ booking.id }} - {{ booking.name }}
          <v-chip class="ma-2" color="primary" label>
            <v-icon start icon="mdi-cash"></v-icon>
            ${{ booking.price }} 
          </v-chip>
          <v-chip class="ma-2" color="accent" label>
            <v-icon start icon="mdi-clock-outline"></v-icon>
            {{ booking.durationMinutes }} minutes
          </v-chip>
        </v-col>
        <v-col class="d-flex justify-end">
                 <v-icon 
              size="small"
              icon="mdi-plus" class="ml-2" 
              @click="openAdd()">
            </v-icon>

          <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-pencil"
            @click="navigateToEdit()"
          ></v-icon>
            <v-icon
            v-if="user !== null"
            size="small"
            icon="mdi-delete"
            @click.stop="deleteBooking(item)"
          ></v-icon>
        </v-col>
      </v-row>
    </v-card-title>

    <v-expand-transition>
       
      <v-card-text class="pt-0" v-show="bookingDetails">
    <v-table>
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">User Id</th>
            <th class="text-left">Status</th>
            <th class="text-left">Total Price</th>
            <th class="text-left">Created At</th>
            <th class="text-left">Updated At</th>
            <th class="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ booking.id }}</td>
            <td>{{ booking.userId }}</td>
            <td>{{ booking.bookingStatus }}</td>
            <td>{{ booking.totalPrice}}</td>
            <td>{{ booking.createdAt}}</td>
            <td>{{ booking.updatedAt }}</td>
          </tr>

          </tbody>
      </v-table>

      <!-- id            | int                                                     | NO   | PRI | NULL    | auto_increment |
| bookingStatus | enum('pending','paid','cancelled','refunded','expired') | NO   |     | pending |                |
| totalPrice    | decimal(8,2)                                            | NO   |     | 0.00    |                |
| createdAt     | datetime                                                | NO   |     | NULL    |                |
| updatedAt     | datetime                                                | NO   |     | NULL    |                |
| userId   -->






        <!-- how do I make this bold -->
        <h1>Payment</h1>

      <v-table>
        <thead>
          <tr>
            <th class="text-left">Payment ID</th>
            <th class="text-left">Booking ID</th>
            <th class="text-left">Payment Method</th>
            <th class="text-left">Payment Status</th>
            <th class="text-left">Amount</th>
            <th class="text-left">Actions</th>
 
 
 
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in payments" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.bookingId }}</td>
            <td>{{ item.paymentStatus }}</td>
            <td>{{ item.paymentMethod }}</td>
            <td>{{ item.amount }}</td>
            <td>
              <v-icon
                size="small"
                icon="mdi-pencil"
                @click="openEdit(item)"
              ></v-icon>
              <v-icon 
              size="small"
              icon="mdi-delete" class="ml-2" 
              @click.stop="deletePayment(item)">
            </v-icon>
  
            </td>
          
   

          </tr>
        </tbody>
      </v-table>


       <v-dialog persistent v-model="isAdd" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2">Add a new Payment </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newPayment.paymentStatus"
              label="Payment Status"
    
              required
            ></v-text-field>

            <v-text-field
              v-model="newPayment.paymentMethod"
              label="Payment Method"
        
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newPayment.amount"
              label="Amount"
              type="number"
            ></v-text-field>
    
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeAdd()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="addPayment()"
              >Save</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>



      <!-- Edit Payment -->
       <v-dialog persistent v-model="isEdit" width="800">
        <v-card class="rounded-lg elevation-5">
          <v-card-title class="headline mb-2"> Edit Payment </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="newPayment.paymentStatus"
              label="Payment Status"
           
              required
            ></v-text-field>

            <v-text-field
              v-model="newPayment.paymentMethod"
              label="Payment Method"
        
              required
            ></v-text-field>
            <v-text-field
              v-model.number="newPayment.amount"
              label="Amount"
              type="number"
            ></v-text-field>
     
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="flat" color="secondary" @click="closeEdit()"
              >Close</v-btn
            >
            <v-btn variant="flat" color="primary" @click="editPayment()"
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


