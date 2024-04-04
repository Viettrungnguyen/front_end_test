<template>
  <div class="container">
    <h1>Account List</h1>
    <div class="d-flex justify-content-end">
      <router-link
        :to="{ name: 'create-account' }"
        class="btn btn-success mb-3 ml-auto"
        >Create New Account</router-link
      >
    </div>

    <ul class="list-group">
      <li
        v-for="account in paginatedAccounts"
        :key="account.registerID"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <router-link
          :to="{ name: 'account-detail', params: { id: account.registerID } }"
          class="text-primary"
        >
          {{ account.login }}
        </router-link>
        <div>
          <router-link
            :to="{ name: 'update-account', params: { id: account.registerID } }"
            class="btn btn-primary btn-sm mx-2"
          >
            Update
          </router-link>
          <button
            class="btn btn-danger btn-sm ml-2"
            @click="deleteAccount(account.registerID)"
          >
            Delete
          </button>
        </div>
      </li>
    </ul>
    <nav aria-label="Page navigation">
      <ul class="pagination mt-3">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            @click="prevPage"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: page === currentPage }"
        >
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import axios from "axios";
import Vue from "vue";
import VueToast from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
Vue.use(VueToast);

export default {
  data() {
    return {
      accounts: [],
      currentPage: 1,
      itemsPerPage: 10,
    };
  },
  mounted() {
    this.fetchAccounts();
  },
  computed: {
    totalPages() {
      return Math.ceil(this.accounts.length / this.itemsPerPage);
    },
    paginatedAccounts() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.accounts.slice(startIndex, endIndex);
    },
  },
  methods: {
    fetchAccounts() {
      axios
        .get(`${process.env.VUE_APP_API_URL}/accounts`)
        .then((response) => {
          this.accounts = response.data.data;
        })
        .catch((error) => {
          console.error("Error fetching accounts:", error);
        });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    deleteAccount(accountId) {
      axios
        .delete(`${process.env.VUE_APP_API_URL}/accounts/?id=${accountId}`)
        .then(() => {
          this.fetchAccounts();
          Vue.$toast.success("Account deleted successfully");
        })
        .catch(() => {
          Vue.$toast.error("Account deleted failed");
        });
    },
  },
};
</script>
