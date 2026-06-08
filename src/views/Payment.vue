<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const paymentMethod = ref("credit_card");
const cardName = ref("");
const cardNumber = ref("");
const expiration = ref("");
const cvv = ref("");
const email = ref("");
const agree = ref(false);
const loading = ref(false);

const snackbar = ref({
  value: false,
  color: "",
  text: "",
});

const orderSummary = ref({
  showName: route.query.showName || "Planetarium Show",
  showtime: route.query.showtime || "Today at 7:00 PM",
  seats: route.query.seats || "A1, A2",
  adultTickets: Number(route.query.adults || 2),
  childTickets: Number(route.query.children || 0),
  ticketPrice: Number(route.query.price || 15),
});

const subtotal = computed(() => {
  return orderSummary.value.adultTickets * orderSummary.value.ticketPrice;
});

const serviceFee = computed(() => {
  return subtotal.value > 0 ? 2.5 : 0;
});

const total = computed(() => {
  return subtotal.value + serviceFee.value;
});

const isCardPayment = computed(() => {
  return paymentMethod.value === "credit_card" || paymentMethod.value === "debit_card";
});

function formatCurrency(value) {
  return Number(value).toFixed(2);
}

function submitPayment() {
  if (!email.value) {
    showSnack("error", "Please enter an email address for ticket delivery.");
    return;
  }

  if (isCardPayment.value && (!cardName.value || !cardNumber.value || !expiration.value || !cvv.value)) {
    showSnack("error", "Please complete all card payment fields.");
    return;
  }

  if (!agree.value) {
    showSnack("error", "Please agree to the refund policy before paying.");
    return;
  }

  loading.value = true;

  setTimeout(() => {
    loading.value = false;
    showSnack("success", "Payment submitted. Your QR tickets will be emailed to you.");
  }, 700);
}

function showSnack(color, text) {
  snackbar.value.value = true;
  snackbar.value.color = color;
  snackbar.value.text = text;
}

function goBackToSeats() {
  router.push({ name: "seatMap", params: { id: route.params.id || 1 } });
}
</script>

<template>
  <v-container class="payment-page">
    <v-row>
      <v-col cols="12" md="8">
        <v-card class="rounded-lg elevation-5 payment-card">
          <v-card-title class="text-h4 font-weight-bold">
            Payment
          </v-card-title>

          <v-card-subtitle>
            Complete your purchase within the checkout time limit to keep your selected seats.
          </v-card-subtitle>

          <v-card-text>
            <v-alert type="info" variant="tonal" class="mb-6">
              Refunds are allowed up to 24 hours before the showtime.
            </v-alert>

            <h3 class="mb-3">Ticket Delivery</h3>
            <v-text-field
              v-model="email"
              label="Email for QR tickets"
              type="email"
              variant="outlined"
              required
            ></v-text-field>

            <h3 class="mt-4 mb-3">Payment Method</h3>
            <v-radio-group v-model="paymentMethod" inline>
              <v-radio label="Credit Card" value="credit_card"></v-radio>
              <v-radio label="Debit Card" value="debit_card"></v-radio>
              <v-radio label="PayPal" value="paypal"></v-radio>
            </v-radio-group>

            <div v-if="isCardPayment">
              <v-text-field
                v-model="cardName"
                label="Name on Card"
                variant="outlined"
              ></v-text-field>

              <v-text-field
                v-model="cardNumber"
                label="Card Number"
                variant="outlined"
                maxlength="19"
              ></v-text-field>

              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="expiration"
                    label="Expiration Date (MM/YY)"
                    variant="outlined"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="cvv"
                    label="CVV"
                    variant="outlined"
                    maxlength="4"
                  ></v-text-field>
                </v-col>
              </v-row>
            </div>

            <v-alert v-else type="info" variant="tonal" class="mb-4">
              You will be redirected to PayPal after clicking Pay Now.
            </v-alert>

            <v-checkbox
              v-model="agree"
              label="I understand tickets are refundable only with 24 hours notice."
            ></v-checkbox>
          </v-card-text>

          <v-card-actions class="px-6 pb-6">
            <v-btn variant="flat" color="secondary" @click="goBackToSeats">
              Back to Seats
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              variant="flat"
              :loading="loading"
              @click="submitPayment"
            >
              Pay Now
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card class="rounded-lg elevation-5 summary-card">
          <v-card-title class="text-h5 font-weight-bold">
            Order Summary
          </v-card-title>

          <v-card-text>
            <div class="summary-line">
              <strong>Show</strong>
              <span>{{ orderSummary.showName }}</span>
            </div>
            <div class="summary-line">
              <strong>Showtime</strong>
              <span>{{ orderSummary.showtime }}</span>
            </div>
            <div class="summary-line">
              <strong>Seats</strong>
              <span>{{ orderSummary.seats }}</span>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="summary-line">
              <span>Adult Tickets x {{ orderSummary.adultTickets }}</span>
              <span>${{ formatCurrency(subtotal) }}</span>
            </div>
            <div class="summary-line" v-if="orderSummary.childTickets > 0">
              <span>Children Under 8 x {{ orderSummary.childTickets }}</span>
              <span>Free</span>
            </div>
            <div class="summary-line">
              <span>Service Fee</span>
              <span>${{ formatCurrency(serviceFee) }}</span>
            </div>

            <v-divider class="my-4"></v-divider>

            <div class="summary-total">
              <strong>Total</strong>
              <strong>${{ formatCurrency(total) }}</strong>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar.value" rounded="pill" :color="snackbar.color">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.value = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<style scoped>
.payment-page {
  padding-top: 32px;
}

.payment-card,
.summary-card {
  background-color: white;
}

.summary-line {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 14px;
}

.summary-line span:last-child {
  text-align: right;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  font-size: 1.25rem;
}
</style>
