<template>
  <div class="col-md-9">
    <table class="table">
      <thead>
        <tr>
          <th>
            <input type="checkbox" :checked="selectAll" @change="selectAllImages" />
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
            <input type="checkbox" v-model="selectedImages" :value="child.id" />
            <div
              class="image-container"
              @mouseover="handleMouseOver(child.id)"
              @click="showImage(child)"
              @mouseleave="handleMouseLeave"
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
</template>

<script>
export default {
  props: {
    selectedItem: Object,
    filteredOptions: Array,
    selectAll: Boolean,
    hoveredImageId: Number,
  },
  data() {
    return {
      selectedOption: null,
      selectedImages: [],
      sortByColumn: null,
      sortDirection: "asc",
      storageLimitGB: 2,
      searchTerm: "",
      selectedPhotoBy: [],
    };
  },
  methods: {
    showImage(item) {
      this.$emit("modalImageUrlChanged", item.url);
      this.$emit("modalOpenChanged", true);
    },
    selectAllImages() {
      if (this.selectedImages.length != this.filteredOptions.length) {
        this.selectedImages = this.selectedItem.children.map(
          (child) => child.id
        );
      } else {
        this.selectedImages = [];
      }
      this.$emit(
        "selectAllChanged",
        this.selectedImages.length === this.filteredOptions.length
      );
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
    handleMouseOver(imageId) {
      this.$emit("mouse-over-image", imageId);
    },
    handleMouseLeave() {
      this.$emit("mouse-leave-image");
    },
  },
};
</script>

<style scoped>
.table > :not(caption) > th {
  color: #6c757d;
}

i {
  color: #6c757d;
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

.enlarge-text i {
  color: white;
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
