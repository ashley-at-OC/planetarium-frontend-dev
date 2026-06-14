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
    https://github.com/ashley-at-OC/planetarium-frontend-dev/pull/20/conflict?name=src%252Fcomponents%252FMenuBar.vue&ancestor_oid=91e3868929218daafb6dd368a7ce7f6d18662f8e&base_oid=bac45a9e7cbc9bf27775dc4a03725e021d3cee6e&head_oid=d662122328d12ac5c6ba7928125637d351cd2b4c  props: true,
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
      path: "/purchases",
      name: "purchases",
      component: () => import("./views/PurchaseHistory.vue"),
    },
  ],
});

export default router;
