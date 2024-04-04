// router/index.js

import Vue from "vue";
import Router from "vue-router";
import AccountList from "@/components/AccountList.vue";
import AccountDetail from "@/components/AccountDetail.vue";
import CreateAccount from "@/components/CreateAccount.vue";
import UpdateAccount from "@/components/UpdateAccount.vue";
import DeleteAccount from "@/components/DeleteAccount.vue";

Vue.use(Router);

export default new Router({
  routes: [
    { path: "/", component: AccountList },
    { path: "/accounts/:id", component: AccountDetail },
    { path: "/create-account", component: CreateAccount },
    { path: "/update-account/:id", component: UpdateAccount },
    { path: "/delete-account/:id", component: DeleteAccount },
  ],
});
