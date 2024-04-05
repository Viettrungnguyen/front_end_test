<template>
  <div class="container">
    <div class="row">
      <div class="col-md-3">
        <div class="sidebar">
          <div class="my-4">
            <div class="d-flex justify-content-between my-3">
              <span class="text-secondary">Storage</span>
              <a class="text-secondary" href="javascript:void(0)"
                >Change plan</a
              >
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
              <span class="text-primary fw-bold mx-1">{{
                Math.round(progressPercentage) + "%"
              }}</span>
              <span>used of 2GB</span>
            </p>
          </div>
          <hr />
          <div class="my-4">
            <p class="text-secondary">Search</p>
            <input
              type="text"
              v-model="searchTerm"
              class="form-control mb-4"
              placeholder="e.g. image.png"
            />
          </div>
          <hr />
          <div>
            <div class="d-flex justify-content-between my-3">
              <span class="text-secondary">Folder</span>
              <a class="text-secondary" href="javascript:void(0)">New folder</a>
            </div>
            <div v-for="option in options" :key="option.id">
              <div
                @click="selectOption(option)"
                class="option fw-bold mb-2"
                :class="{ 'active-div-option': option === selectedOption }"
              >
                <i
                  v-if="option === selectedOption"
                  class="bi bi-caret-up-fill me-2"
                ></i>
                <i v-else class="bi bi-caret-right-fill me-2"></i>
                <span
                  ><i class="bi bi-folder-fill"></i
                  ><span class="mx-2">{{ option.name }}</span></span
                >
                <span class="option-count">{{ option.children.length }}</span>
              </div>
              <div v-if="selectedOption && selectedOption.id === option.id">
                <ul class="list-group">
                  <li
                    v-for="child in option.children"
                    :key="child.id"
                    class="list-group-item"
                    :class="{ 'active-option': child === selectedItem }"
                    @click="showDetails(child)"
                  >
                    <button
                      @click="showDetails(child)"
                      class="btn btn-light btn-block d-flex w-100 justify-content-between"
                    >
                      <span
                        ><i class="bi bi-caret-right-fill me-2"></i>
                        <i class="bi bi-folder-fill"></i
                        ><span class="mx-2">{{ child.name }}</span></span
                      >
                      <span class="option-count">{{
                        child.children.length
                      }}</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <hr />
          <div class="d-flex justify-content-between my-3">
            <span class="text-secondary">Members</span>
            <div>
              <a
                class="text-secondary"
                href="javascript:void(0)"
                @click="selectAllPhotosByChanged"
                >Select all</a
              >
            </div>
          </div>
          <div>
            <div v-for="photoBy in uniquePhotoBy" :key="photoBy">
              <label>
                <input
                  type="checkbox"
                  v-model="selectedPhotoBy"
                  :value="photoBy"
                />
                {{ photoBy }}
              </label>
            </div>
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
                <span class="ms-3">Select all</span>
              </th>
              <th @click="sortBy('name')">
                Name<i class="bi bi-arrows-vertical"></i>
              </th>
              <th @click="sortBy('dimension')">
                Dimension<i class="bi bi-arrows-vertical"></i>
              </th>
              <th @click="sortBy('size')">
                Size<i class="bi bi-arrows-vertical"></i>
              </th>
            </tr>
          </thead>
          <tbody v-if="selectedItem != null">
            <tr tr v-for="child in filteredOptions" :key="child.id">
              <td class="d-flex gap-3">
                <input
                  type="checkbox"
                  v-model="selectedImages"
                  :value="child.id"
                />
                <div
                  class="image-container"
                  @mouseover="hoveredImageId = child.id"
                  @click="showImage(child)"
                  @mouseleave="hoveredImageId = null"
                >
                  <img :src="child.url" alt="Image" class="image" />
                  <div class="enlarge-text" v-if="hoveredImageId === child.id">
                    <div class="content-text">
                      Enlarge <i class="bi bi-arrows-angle-expand"></i>
                    </div>
                  </div>
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
      <div
        class="modal"
        :class="{ 'is-active': isModalOpen }"
        @click="isModalOpen = false"
      >
        <div class="modal-background"></div>
        <div class="modal-content">
          <button
            class="modal-close"
            aria-label="close"
            @click="isModalOpen = false"
          ></button>
          <img
            :src="modalImageUrl"
            alt="Full Image"
            style="max-width: 100%; max-height: 80vh; object-fit: scale-down"
          />
        </div>
      </div>
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
    };
  },
  computed: {
    sortedItems() {
      if (!this.sortByColumn) {
        return this.selectedItem.children;
      }
      console.log(this.selectedItem);

      if (this.selectedItem) {
        return this.selectedItem.children.slice().sort((a, b) => {
          let modifier = 1;
          if (this.sortDirection === "desc") modifier = -1;
          if (a[this.sortByColumn] < b[this.sortByColumn]) return -1 * modifier;
          if (a[this.sortByColumn] > b[this.sortByColumn]) return 1 * modifier;
          return 0;
        });
      }
      return [];
    },
    filteredOptions() {
      if (this.sortedItems) {
        let filteredItems = this.sortedItems;
        const searchTerm = this.searchTerm.toLowerCase().trim();

        if (
          this.selectedPhotoBy.includes("All") ||
          this.selectedPhotoBy.length === 0
        ) {
          filteredItems = filteredItems.filter((option) =>
            this.optionContainsTerm(option, searchTerm)
          );
        } else {
          filteredItems = filteredItems.filter(
            (option) =>
              this.optionContainsTerm(option, searchTerm) &&
              this.selectedPhotoBy.includes(option.photo_by)
          );
        }
        return filteredItems.filter((option) =>
          this.optionContainsTerm(option, searchTerm)
        );
      } else {
        return this.sortedItems;
      }
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
  mounted() {
    this.selectAllPhotosByChanged();
    if (this.options.length > 0) {
      this.selectOption(this.options[0]);
    }
  },
  methods: {
    selectOption(option) {
      this.selectAll = false;
      this.selectedOption = option;
      const mergedChildren = option.children.reduce((accumulator, child) => {
        return accumulator.concat(child.children);
      }, []);
      this.selectedItem = { children: mergedChildren };
      this.selectedImages = [];
    },
    showDetails(item) {
      this.selectAll = false;
      this.selectedImages = [];
      this.selectedItem = item;
    },
    showImage(item) {
      this.modalImageUrl = item.url;
      this.isModalOpen = true;
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
    optionContainsTerm(option, term) {
      return option.name.toLowerCase().includes(term);
    },
    selectAllPhotosByChanged() {
      if (this.selectedPhotoBy.length === this.uniquePhotoBy.length) {
        this.selectedPhotoBy = [];
      } else {
        this.selectedPhotoBy = [...this.uniquePhotoBy];
      }
    },
  },
};
</script>

<style scoped>
.option {
  width: 100%;
  background: white;
  border: none;
  color: black;
  text-align: left;
}

.option-count {
  padding: 0px 5px;
  border: 1px solid #bdbcbc;
  background: #bdbcbc;
  border-radius: 5px;
  font-size: 14px;
}

.list-group li {
  border: none;
  padding: 2px 0 2px 22px;
}

.table > :not(caption) > th {
  color: #6c757d;
}

.active-option button,
.active-option i,
.active-option button:hover {
  color: #5356ff;
  background: #dff5ff;
}

.active-option button .option-count {
  background: #5356ff;
  color: white;
  border-color: #5356ff;
}
i {
  color: #6c757d;
}

.active-div-option i {
  color: #000;
}

thead tr th {
  color: #6c757d;
  font-weight: 400;
}
th i {
  font-size: 12px;
}

td,
th {
  border: none;
}

.modal {
  display: none;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Background opacity */
  z-index: 9999;
}

.modal.is-active {
  display: flex;
}

.modal-content {
  max-width: 1000px;
  max-height: 80vh;
  position: relative;
}

.modal-close {
  position: absolute;
  top: -7px;
  right: -32px;
  width: 30px;
  height: 30px;
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.modal-close:before {
  content: "x";
  font-size: 20px;
  color: #fff;
}
.image-container {
  position: relative;
  display: inline-block;
}

.image {
  max-width: 200px;
  cursor: pointer;
  border-radius: 10px;
}

.enlarge-text {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  display: flex;
  gap: 10px;
  align-content: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background-color: rgba(14, 64, 87, 0.5);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.content-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 10px;
  background-color: rgba(36, 166, 226, 0.5);
  color: white;
  padding: 10px 15px;
  border-radius: 10px;
  font-size: 14px;
  transition: opacity 0.3s ease;
}

.image-container:hover .enlarge-text {
  opacity: 1;
}
</style>
