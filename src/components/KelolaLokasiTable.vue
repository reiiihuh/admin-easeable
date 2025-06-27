<template>
  <!-- Tombol Tambah Lokasi -->
  <div class="add-location-header">
    <button class="add-location-btn" @click="openAddModal">
      <span class="add-icon">+</span>
      Tambah Lokasi
    </button>
  </div>

  <!-- Tabel Daftar Lokasi -->
  <div class="location-management">
    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Lokasi</th>
              <th>Deskripsi</th>
              <th>Info Tambahan</th>
              <th>Preview</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(lokasi, index) in paginatedLokasi" :key="index" class="table-row">
              <td class="id-cell">{{ lokasi.id_lokasi }}</td>
              <td class="name-cell">{{ lokasi.nama_lokasi }}</td>
              <td class="desc-cell">{{ lokasi.deskripsi }}</td>
              <td class="info-cell">{{ lokasi.info }}</td>
              <td class="image-cell">
                <div class="image-wrapper">
                  <img :src="lokasi.url_placeholder" alt="placeholder" class="preview-image" />
                </div>
              </td>
              <td class="action-cell">
                <div class="action-buttons">
                  <button class="action-btn edit-action" @click="editLokasi(lokasi)">
                    <span class="material-icons">edit</span>
                    <!-- <span class="btn-icon">✏️</span> -->
                    Edit
                  </button>
                  <button class="action-btn delete-action" @click="deleteLokasi(lokasi.id_lokasi)">
                    <span class="material-icons">delete</span>
                    <!-- <span class="btn-icon">🗑️</span> -->
                    Hapus
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination-wrapper" v-if="totalPages > 1">
        <div class="pagination-info">
          Menampilkan {{ startIndex + 1 }}-{{ endIndex }} dari {{ lokasiList.length }} lokasi
        </div>
        <div class="pagination-controls">
          <button 
            class="page-btn" 
            :class="{ disabled: currentPage === 1 }"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            ‹ Sebelumnya
          </button>
          <span class="page-info">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            class="page-btn" 
            :class="{ disabled: currentPage === totalPages }"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Tambah Lokasi -->
  <div v-if="showAddModal">
    <div class="modal-overlay"></div>
    <div class="modal-container">
      <FormLokasiRute
        :initialForm="emptyForm"
        mode="add"
        @success="handleAddSuccess"
        @cancel="closeModal"
      />
    </div>
  </div>

  <!-- Modal Edit Lokasi -->
  <div v-if="showEditModal">
    <div class="modal-overlay"></div>
    <div class="modal-container">
      <FormLokasiRute
        :initialForm="formData"
        mode="edit"
        @success="handleEditSuccess"
        @cancel="closeModal"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormLokasiRute from './FormLokasiRute.vue';

const lokasiList = ref([]);
const showAddModal = ref(false)
const showEditModal = ref(false);
const formData = ref({});
const currentPage = ref(1);
const itemsPerPage = 4;

// Kosong untuk tambah lokasi
const emptyForm = {
  nama_lokasi: '',
  deskripsi: '',
  info: '',
  placeholder: null,
  url_placeholder: '',
  langkahs: []
}

// Pagination computed properties
const totalPages = computed(() => Math.ceil(lokasiList.value.length / itemsPerPage));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, lokasiList.value.length));
const paginatedLokasi = computed(() => 
  lokasiList.value.slice(startIndex.value, endIndex.value)
);

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Saat selesai tambah lokasi
const handleAddSuccess = async () => {
  await fetchLokasi()
  showAddModal.value = false
}

// Saat batal tambah
const closeAdd = () => {
  showAddModal.value = false
}

const handleEditSuccess = () => {
  showEditModal.value = false;
  fetchLokasi(); // ⬅️ refresh list
};

const fetchLokasi = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/locations');
    lokasiList.value = res.data;
    // Reset to first page when data changes
    currentPage.value = 1;
  } catch (error) {
    console.error('Gagal mengambil data lokasi:', error);
  }
};

const editLokasi = async (lokasi) => {
  try {
    const langkahRes = await axios.get(`http://localhost:3000/api/slides/${lokasi.nama_lokasi}`);
    const langkahs = langkahRes.data.map(item => ({
      id_rute: item.id_rute || null,
      deskripsi_langkah: item.deskripsi_langkah || '',
      urutan_langkah: item.urutan_langkah || '',
      arah: item.arah || '',
      url_gambar: item.url_gambar || '',
      url_gif: item.url_gif || ''
    }));

    formData.value = {
      ...lokasi,
      langkahs
    };

    showEditModal.value = true;
  } catch (err) {
    console.error('Gagal mengambil data rute:', err);
  }
};

const openAddModal = () => {
  showAddModal.value = true
  showEditModal.value = false
}
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
}
const closeEdit = () => {
  showEditModal.value = false;
};

const deleteLokasi = (id) => {
  Swal.fire({
    title: 'Yakin hapus lokasi ini?',
    text: 'Semua langkah/rute juga akan ikut terhapus!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3000/api/locations/${id}`);
        Swal.fire('Dihapus!', 'Lokasi berhasil dihapus.', 'success');
        fetchLokasi();
      } catch (err) {
        console.error(err);
        Swal.fire('Gagal', 'Gagal menghapus lokasi', 'error');
      }
    }
  });
};

onMounted(fetchLokasi);
</script>

<style scoped lang="scss">
.location-management {
  padding: 1rem;
  // background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  // min-height: 100vh;
}

.add-location-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  padding: 0 2rem;
}

.add-location-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.875rem 1.75rem;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 14px 0 rgba(16, 185, 129, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px 0 rgba(16, 185, 129, 0.4);
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
  }

  &:active {
    transform: translateY(0);
  }
}

.add-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.925rem;
}

.modern-table th {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
  text-align: left;
  border: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modern-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
}

.table-row {
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
  }

  &:last-child td {
    border-bottom: none;
  }
}

.id-cell {
  font-weight: 600;
  color: #64748b;
  font-family: 'Monaco', monospace;
  font-size: 0.875rem;
}

.name-cell {
  font-weight: 600;
  color: #1e293b;
  max-width: 200px;
}

.desc-cell,
.info-cell {
  color: #64748b;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.image-cell {
  width: 100px;
}

.image-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
}

.action-cell {
  width: 180px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.625rem 1rem;
  font-size: 0.825rem;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 70px;
  justify-content: center;
}

.edit-action {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
}

.delete-action {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
  }
}

.btn-icon {
  font-size: 0.875rem;
}

.pagination-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-btn {
  background: white;
  color: #475569;
  border: 1px solid #d1d5db;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover:not(.disabled) {
    background: #f1f5f9;
    border-color: #94a3b8;
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.page-info {
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 60px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  z-index: 1039;
  animation: fadeIn 0.2s ease-out;
}

.modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1040;
  padding: 2rem;
  border-radius: 16px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: translate(-50%, -60%);
  }
  to { 
    opacity: 1;
    transform: translate(-50%, -50%);
  }
}

@media (max-width: 1024px) {
  .location-management {
    padding: 1rem;
  }
  
  .add-location-header {
    padding: 0 1rem;
  }
  
  .modern-table {
    font-size: 0.8rem;
  }
  
  .modern-table th,
  .modern-table td {
    padding: 0.75rem 0.5rem;
  }

  .action-buttons {
    flex-direction: column;
    gap: 0.25rem;
  }

  .action-btn {
    font-size: 0.75rem;
    padding: 0.5rem 0.75rem;
    min-width: 60px;
  }
}

@media (max-width: 768px) {
  .pagination-wrapper {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .modal-container {
    width: 95%;
    padding: 1.5rem;
  }
}
</style>