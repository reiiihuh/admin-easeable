<template>
  <div class="kelola-feedback">
    <table>
      <thead>
        <tr>
          <th>Id Feedback</th>
          <th>Nama Mahasiswa</th>
          <th>Jenis</th>
          <th>Deskripsi</th>
          <th>Tanggal Masuk Feedback</th>
          <th>Respon Admin</th>
          <th>Tanggal Respon</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in feedbackList" :key="item.id_feedback">
          <td>{{ item.id_feedback || '-' }}</td>
          <td>{{ item.nama_mahasiswa || '-' }}</td>
          <td>{{ item.jenis_laporan }}</td>
          <td>{{ item.deskripsi_feedback }}</td>
          <td>{{ formatDate(item.tanggal_feedback) }}</td>
          <td>{{ item.respon_admin || '-' }}</td>
          <td>{{ formatDate(item.tanggal_respon) }}</td>
          <td>
            <button 
              v-if="!item.respon_admin"
              class="btn-reply"
              @click="balas(item)"
            >
              Balas
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Modal Balasan -->
    <div v-if="selectedFeedback" class="modal-overlay">
      <div class="modal-content">
        <h3>Balas Feedback</h3>
        <p><strong>Feedback:</strong> {{ selectedFeedback.deskripsi_feedback }}</p>
        <textarea v-model="respon" placeholder="Tulis balasan di sini..."></textarea>
        <div class="modal-actions">
          <button class="btn-kirim" @click="kirimRespon">Kirim</button>
          <button class="btn-batal" @click="selectedFeedback = null">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const feedbackList = ref([])
const selectedFeedback = ref(null)
const respon = ref('')

const formatDate = (dateStr) => {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
}

const getFeedback = async () => {
  try {
    const admin = JSON.parse(localStorage.getItem('user'))
    if (!admin || !admin.id_admin) {
      Swal.fire('Error', 'Admin belum login!', 'error')
      return
    }

    const res = await axios.get(`http://localhost:3000/api/notifikasi/admin/${admin.id_admin}`)
    feedbackList.value = res.data
  } catch (err) {
    Swal.fire('Gagal', 'Gagal mengambil data', 'error')
    console.error('ERROR AMBIL FEEDBACK:', err)
  }
}

const balas = (item) => {
  selectedFeedback.value = item
  respon.value = ''
}

const kirimRespon = async () => {
  try {
    const admin = JSON.parse(localStorage.getItem('user'))
    if (!admin || !admin.id_admin) {
      Swal.fire('Gagal', 'Admin belum login', 'error')
      return
    }

    await axios.post('http://localhost:3000/api/notifikasi/submit', {
      id_feedback: selectedFeedback.value.id_feedback,
      id_admin: admin.id_admin,
      deskripsi: respon.value
    })

    Swal.fire({
      icon: 'success',
      title: 'Balasan berhasil dikirim!',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal-custom'
      }
    })

    selectedFeedback.value = null
    getFeedback()
  } catch (err) {
    Swal.fire('Gagal', 'Gagal mengirim balasan', 'error')
    console.error('ERROR KIRIM BALASAN:', err)
  }
}

onMounted(getFeedback)
</script>

<style scoped>
.kelola-feedback {
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.kelola-feedback table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  /* border-radius: 8px; */
  overflow: hidden;
  /* box-shadow: 0 2px 10px rgba(0,0,0,0.1); */
}

.kelola-feedback th, 
.kelola-feedback td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
  font-size: 14px;
  vertical-align: top;
}

.kelola-feedback th {
  background-color: #f5f5f5;
  font-weight: 600;
}

.kelola-feedback .btn-reply {
  background-color: #0c7b53;
  color: #fff;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s ease;
}

.kelola-feedback .btn-reply:hover {
  background-color: #096445;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
  position: relative;
}

.modal-content h3 {
  margin-bottom: 0.5rem;
  color: #0c7b53;
}

.modal-content p {
  font-size: 14px;
  margin-bottom: 1rem;
  color: #333;
}

.modal-content textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.8rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
}

.modal-actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-actions .btn-kirim {
  background: #0c7b53;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.modal-actions .btn-batal {
  background: #d33;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
</style>