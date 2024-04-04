<template>
  <div>
    <h1>Account List</h1>
    <ul>
      <li v-for="account in paginatedAccounts" :key="account.registerID">
        <!-- Display account details -->
      </li>
    </ul>
    <div>
      <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
      <span>{{ currentPage }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        Next
      </button>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      accounts: [],
      currentPage: 1,
      itemsPerPage: 10, // Change as per your requirement
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
  },
};
</script>
