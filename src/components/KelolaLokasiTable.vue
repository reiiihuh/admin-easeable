<template>
  <div class="kelola-lokasi">
    <div class="lokasi-container">
      <table class="lokasi-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama Lokasi</th>
            <th>Deskripsi</th>
            <th>Info Tambahan</th>
            <th>Placeholder</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(lokasi, index) in lokasiList" :key="index">
            <td>{{ lokasi.id_lokasi }}</td>
            <td>{{ lokasi.nama_lokasi }}</td>
            <td>{{ lokasi.deskripsi }}</td>
            <td>{{ lokasi.info }}</td>
            <td>
              <img
                :src="lokasi.url_placeholder"
                alt="placeholder"
                class="img-placeholder"
              />
            </td>
            <td>
              <button class="edit-btn" @click="editLokasi(lokasi)">Edit</button>
              <button class="delete-btn" @click="deleteLokasi(lokasi.id_lokasi)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- MODAL + BACKDROP dipindah ke luar lokasi-container -->
    <div v-if="showEditModal">
      <div class="modal-backdrop"></div>
      <div class="modal">
        <FormLokasiRute
          :initialForm="formData"
          @success="handleEditSuccess"
          @cancel="closeEdit"
        />

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import FormLokasiRute from './FormLokasiRute.vue';

const lokasiList = ref([]);
const showEditModal = ref(false);
const formData = ref({});

const handleEditSuccess = () => {
  showEditModal.value = false;
  fetchLokasi(); // ⬅️ refresh list
};


const fetchLokasi = async () => {
  try {
    const res = await axios.get('http://localhost:3000/api/locations');
    lokasiList.value = res.data;
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

<style scoped>
.kelola-lokasi {
  padding: 1.4rem;
}

.lokasi-container {
  border: 2px solid var(--outline);
  border-radius: 8px;
  padding: 1rem;
  background-color: #fff;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.03);
  overflow-x: auto;
}

.lokasi-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  table-layout: fixed;
}

.lokasi-table th,
.lokasi-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 2px solid #eee;
  vertical-align: middle;
}

.lokasi-table th {
  background-color: var(--outline);
  color: #444;
  font-weight: 700;
  text-transform: uppercase;
}

.img-placeholder {
  width: 80px;
  height: auto;
  border-radius: 6px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  margin-right: 5px;
  font-size: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-btn {
  background-color: #2196f3;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1039;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  z-index: 1040;
  padding: 1.5rem;
  border-radius: 10px;
  width: 80%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
}



.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}
</style>