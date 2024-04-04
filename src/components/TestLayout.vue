<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <div class="my-5">
            <div class="d-flex justify-content-between my-3">
              <span>Storage</span>
              <span>Change plan</span>
            </div>
            <div class="progress">
              <div
                class="progress-bar"
                role="progressbar"
                :aria-valuenow="progressPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
                :style="{ width: progressPercentage + '%' }"
              ></div>
            </div>
            <p>
              {{ Math.round(progressPercentage) + "%" }}
              <span>used of 2GB</span>
            </p>
          </div>

          <div>
            <p>Search</p>
            <input
              type="text"
              v-model="searchTerm"
              class="form-control mb-3"
              placeholder="Search..."
              @input="searchItems"
            />
          </div>
          <div>
            <div v-for="option in options" :key="option.id">
              <button
                @click="selectOption(option)"
                class="btn btn-primary mb-2"
              >
                {{ option.name }}
              </button>
              <div v-if="selectedOption && selectedOption.id === option.id">
                <ul class="list-group">
                  <li
                    v-for="child in option.children"
                    :key="child.id"
                    class="list-group-item"
                  >
                    <button
                      @click="showDetails(child)"
                      class="btn btn-light btn-block"
                    >
                      {{ child.name }}
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <!-- Search by photo_by select box -->
          <div class="d-flex justify-content-between my-3">
            <span>Members</span>
            <div>
              <span @click="selectAllPhotosByChanged">Select all</span>
            </div>
          </div>
          <div>
            <label v-for="photoBy in uniquePhotoBy" :key="photoBy">
              <input
                type="checkbox"
                v-model="selectedPhotoBy"
                :value="photoBy"
                @change="filterOptions"
              />
              {{ photoBy }}
            </label>
          </div>
        </div>
      </div>
      <div class="col-md-9">
        <table class="table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  v-model="selectAll"
                  @change="selectAllImages"
                />
                <span class="mx-4">Select all</span>
              </th>
              <th @click="sortBy('name')">Name</th>
              <th @click="sortBy('dimension')">Dimension</th>
              <th @click="sortBy('size')">Size</th>
            </tr>
          </thead>
          <tbody v-if="selectedItem != null">
            <tr tr v-for="child in sortedItems" :key="child.id">
              <td class="d-flex gap-3">
                <input
                  type="checkbox"
                  v-model="selectedImages"
                  :value="child.id"
                />
                <div>
                  <img
                    :src="child.url"
                    alt="Image"
                    style="
                      max-width: 100px;
                      cursor: pointer;
                      border-radius: 10px;
                    "
                    @click="openModal(child.url)"
                    @mouseover="showEnlargeText(child.id)"
                    @mouseleave="hideEnlargeText(child.id)"
                  />
                  <span
                    v-if="child.id === hoveredImageId && isEnlargeTextVisible"
                    class="enlarge-text"
                  >
                    Enlarge
                  </span>
                </div>
              </td>
              <td style="vertical-align: middle">{{ child.name }}</td>
              <td style="vertical-align: middle">{{ child.dimmension }}</td>
              <td style="vertical-align: middle">
                {{ formatSize(child.size) }}
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="7">No data available</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal" :class="{ 'is-active': isModalOpen }">
      <div class="modal-background"></div>
      <div class="modal-content">
        <img :src="modalImageUrl" class="img-fluid" alt="Full Image" />
      </div>
      <button
        class="modal-close is-large"
        aria-label="close"
        @click="closeModal"
      ></button>
    </div>
  </div>
</template>

<script>
import { options } from "@/constants/options";
export default {
  data() {
    return {
      options: options,
      selectedOption: null,
      selectedItem: null,
      isModalOpen: false,
      modalImageUrl: "",
      isEnlargeTextVisible: false,
      hoveredImageId: null,
      selectAll: false,
      selectedImages: [],
      sortByColumn: null,
      sortDirection: "asc",
      storageLimitGB: 2,
      searchTerm: "",
      selectedPhotoBy: [],
      selectAllPhotosBy: [],
    };
  },
  computed: {
    sortedItems() {
      if (!this.sortByColumn) {
        return this.selectedItem.children;
      }
      if (this.selectedItem) {
        return this.selectedItem.children.slice().sort((a, b) => {
          let modifier = 1;
          if (this.sortDirection === "desc") modifier = -1;
          if (a[this.sortByColumn] < b[this.sortByColumn]) return -1 * modifier;
          if (a[this.sortByColumn] > b[this.sortByColumn]) return 1 * modifier;
          return 0;
        });
      }
      return 0;
    },
    totalSize() {
      let total = 0;
      this.options.forEach((option) => {
        option.children.forEach((child) => {
          child.children.forEach((element) => {
            const size = parseInt(element.size);
            total += size;
          });
        });
      });
      return total;
    },
    progressPercentage() {
      const totalBytes = 2 * 1024 * 1024 * 1024;
      return (this.totalSize / totalBytes) * 100;
    },
    uniquePhotoBy() {
      const photoBySet = new Set();
      photoBySet.add("All");
      this.options.forEach((option) => {
        option.children.forEach((child) => {
          child.children.forEach((item) => {
            photoBySet.add(item.photo_by);
          });
        });
      });
      return Array.from(photoBySet);
    },
  },
  methods: {
    selectOption(option) {
      this.selectAll = false;
      this.selectedItem = false;
      this.selectedImages = [];
      this.selectedOption = option;
    },
    showDetails(item) {
      this.selectAll = false;
      this.selectedImages = [];
      this.selectedItem = item;
    },
    openModal(url) {
      this.modalImageUrl = url;
      this.isModalOpen = true;
    },
    closeModal() {
      this.isModalOpen = false;
    },
    showEnlargeText(id) {
      this.hoveredImageId = id;
      this.isEnlargeTextVisible = true;
    },
    hideEnlargeText(id) {
      if (id === this.hoveredImageId) {
        this.hoveredImageId = null;
        this.isEnlargeTextVisible = false;
      }
    },
    selectAllImages() {
      if (this.selectAll && this.selectedItem) {
        this.selectedImages = this.selectedItem.children.map(
          (child) => child.id
        );
      } else {
        this.selectedImages = [];
      }
    },
    sortBy(column) {
      if (this.sortByColumn === column) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortByColumn = column;
        this.sortDirection = "asc";
      }
    },
    formatSize(size) {
      const sizeNumber = parseInt(size);
      if (isNaN(sizeNumber) || sizeNumber === 0) {
        return "0 kB";
      }
      const formattedSize = sizeNumber.toLocaleString();
      return formattedSize + " kB";
    },
    searchItems() {
      const searchTerm = this.searchTerm.toLowerCase().trim();

      if (searchTerm === "") {
        this.filteredOptions = this.sortedItems;
      } else {
        this.filteredOptions = this.sortedItems.filter((option) =>
          this.optionContainsTerm(option, searchTerm)
        );
      }
    },
    optionContainsTerm(option, term) {
      return option.name.toLowerCase().includes(term);
    },
    selectAllPhotosByChanged() {
      if (this.selectAllPhotosBy) {
        this.selectedPhotoBy = this.uniquePhotoBy;
      } else {
        this.selectedPhotoBy = [];
      }
      this.filterOptions();
    },
    filterOptions() {
      // Filter options based on selected photo_by values
      this.filteredOptions = [];
      this.options.forEach((option) => {
        const filteredChildren = option.children.reduce((acc, child) => {
          const filteredItems = child.children.filter((item) =>
            this.selectedPhotoBy.includes(item.photo_by)
          );
          if (filteredItems.length > 0) {
            acc.push({ ...child, children: filteredItems });
          }
          return acc;
        }, []);
        if (filteredChildren.length > 0) {
          this.filteredOptions.push({ ...option, children: filteredChildren });
        }
      });
    },
  },
};
</script>
