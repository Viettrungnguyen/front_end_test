import Vue from "vue";
import Router from "vue-router";
import AccountList from "@/components/AccountList.vue";
import AccountDetail from "@/components/AccountDetail.vue";
import CreateAccount from "@/components/CreateAccount.vue";
import UpdateAccount from "@/components/UpdateAccount.vue";
import ShowSerialpaso from "@/components/ShowSerialpaso.vue";
import CompareFolders from "@/components/CompareFolders.vue";
import VueTest from "@/components/MainComponent.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  routes: [
    { path: "/", name: "test1", component: AccountList },
    { path: "/accounts/:id", name: "account-detail", component: AccountDetail },
    {
      path: "/create-account",
      name: "create-account",
      component: CreateAccount,
    },
    {
      path: "/update-account/:id",
      name: "update-account",
      component: UpdateAccount,
    },
    {
      path: "/showSerialpaso",
      name: "test2",
      component: ShowSerialpaso,
    },
    {
      path: "/compare-folders",
      name: "test3",
      component: CompareFolders,
    },
    {
      path: "/vue-test",
      name: "vue-test",
      component: VueTest,
    },
  ],
});
