import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/recipes",
      name: "recipes",
      component: () => import("./views/RecipeList.vue"),
    },
    {
      path: "/recipe/:id",
      name: "editRecipe",
      props: true,
      component: () => import("./views/EditRecipe.vue"),
    },
    {
      path: "/shows",
      name: "shows",
      component: () => import("./views/ShowList.vue"),
    },
    {
      path: "/show/:id",
      name: "editShow",
      props: true,
      component: () => import("./views/EditShow.vue"),
    },
    {
      path: "/show/:id",
      name: "selectedShow",
      props: true,
      component: () => import("./views/SelectedShow.vue"),
    },
    {
      path: "/payment/:id?",
      name: "payment",
      props: true,
      component: () => import("./views/Payment.vue"),
    },
    {
      path: "/seats",
      name: "seatMap",
      component: () => import("./views/SeatMap.vue"),
    },
    {
      path: "/users/:id",
      name: "editUser",
      props: true,
      component: () => import("./views/EditUser.vue"),
    },
    {
      path: "/bookings/:id",
      name: "editBooking",
      props: true,
      component: () => import("./views/EditBooking.vue"),
    },
    { // ?
      path: "/purchases",
      name: "purchases",
      component: () => import("./views/PurchaseHistory.vue"),
    },

    {
      path: "/refunds/:id",
      name: "refunds",
      component: () => import("./views/Refund.vue"),
    },
  ],
});

export default router;
