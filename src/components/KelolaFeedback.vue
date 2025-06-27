<template>
  <div class="feedback-management">
    <div class="header-section">
      <!-- <h2 class="page-title">Kelola Feedback Mahasiswa</h2> -->
      <div class="stats-info">
        Total Feedback: <span class="stats-number">{{ feedbackList.length }}</span>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="modern-feedback-table">
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
            <tr v-for="item in paginatedFeedback" :key="item.id_feedback" class="table-row">
              <td class="id-column">{{ item.id_feedback || '-' }}</td>
              <td class="name-column">{{ item.nama_mahasiswa || '-' }}</td>
              <td class="type-column">
                <span class="type-badge">{{ item.jenis_laporan }}</span>
              </td>
              <td class="desc-column">{{ item.deskripsi_feedback }}</td>
              <td class="date-column">{{ formatDate(item.tanggal_feedback) }}</td>
              <td class="response-column">
                <span v-if="item.respon_admin" class="response-text">{{ item.respon_admin }}</span>
                <span v-else class="no-response">Belum ada respon</span>
              </td>
              <td class="date-column">{{ formatDate(item.tanggal_respon) }}</td>
              <td class="action-column">
                <button 
                  v-if="!item.respon_admin"
                  class="reply-button"
                  @click="balas(item)"
                >
                  <span class="reply-icon">💬</span>
                  Balas
                </button>
                <span v-else class="completed-badge">Selesai</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Pagination Controls -->
      <div class="pagination-section" v-if="totalPages > 1">
        <div class="pagination-info">
          Menampilkan {{ startIndex + 1 }}-{{ endIndex }} dari {{ feedbackList.length }} feedback
        </div>
        <div class="pagination-controls">
          <button 
            class="pagination-btn" 
            :class="{ disabled: currentPage === 1 }"
            @click="previousPage"
            :disabled="currentPage === 1"
          >
            ‹ Sebelumnya
          </button>
          <span class="page-indicator">
            {{ currentPage }} / {{ totalPages }}
          </span>
          <button 
            class="pagination-btn" 
            :class="{ disabled: currentPage === totalPages }"
            @click="nextPage"
            :disabled="currentPage === totalPages"
          >
            Selanjutnya ›
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Balasan -->
    <div v-if="selectedFeedback" class="modal-backdrop">
      <div class="modal-dialog">
        <div class="modal-header">
          <h3 class="modal-title">Balas Feedback</h3>
          <button class="close-button" @click="selectedFeedback = null">×</button>
        </div>
        <div class="modal-body">
          <div class="feedback-preview">
            <label class="preview-label">Feedback dari mahasiswa:</label>
            <p class="feedback-text">{{ selectedFeedback.deskripsi_feedback }}</p>
          </div>
          <div class="response-input">
            <label class="input-label">Balasan Anda:</label>
            <textarea 
              v-model="respon" 
              placeholder="Tulis balasan yang informatif dan membantu..."
              class="response-textarea"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="send-button" @click="kirimRespon">
            <span class="send-icon">📤</span>
            Kirim Balasan
          </button>
          <button class="cancel-button" @click="selectedFeedback = null">Batal</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const feedbackList = ref([])
const selectedFeedback = ref(null)
const respon = ref('')
const currentPage = ref(1)
const itemsPerPage = 4

// Pagination computed properties
const totalPages = computed(() => Math.ceil(feedbackList.value.length / itemsPerPage))
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage)
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage, feedbackList.value.length))
const paginatedFeedback = computed(() => 
  feedbackList.value.slice(startIndex.value, endIndex.value)
)

// Pagination methods
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

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
    // Reset to first page when data changes
    currentPage.value = 1
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

<style scoped lang="scss">
.feedback-management {
  padding: 1rem;
  // background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  // min-height: 100vh;
  font-family: 'Inter', 'Segoe UI', sans-serif;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 0 0.5rem;
}

.stats-info {
  background: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  font-weight: 500;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.stats-number {
  font-weight: 700;
  color: #0ea5e9;
  font-size: 1.1rem;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.table-wrapper {
  overflow-x: auto;
}

.modern-feedback-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.modern-feedback-table th {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  color: white;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 1.25rem 1rem;
  text-align: left;
  border: none;
  position: sticky;
  top: 0;
  z-index: 10;
}

.modern-feedback-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: top;
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

.id-column {
  font-weight: 600;
  color: #64748b;
  font-family: 'Monaco', monospace;
  font-size: 0.85rem;
  width: 100px;
}

.name-column {
  font-weight: 600;
  color: #1e293b;
  max-width: 150px;
}

.type-column {
  width: 120px;
}

.type-badge {
  display: inline-block;
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.desc-column {
  color: #475569;
  max-width: 180px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  white-space: normal;
  line-height: 1.5;
  word-wrap: break-word;
}

.date-column {
  color: #64748b;
  font-size: 0.85rem;
  width: 140px;
  font-family: 'Monaco', monospace;
}

.response-column {
  max-width: 180px;
}

.response-text {
  color: #475569;
  display: block;
  // overflow: hidden;
  // text-overflow: ellipsis;
  white-space: normal;
  background: #f1f5f9;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.85rem;
}

.no-response {
  color: #94a3b8;
  font-style: italic;
  font-size: 0.85rem;
}

.action-column {
  width: 120px;
}

.reply-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.625rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);

  &:hover {
    background: linear-gradient(135deg, #059669 0%, #047857 100%);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
  }
}

.reply-icon {
  font-size: 0.9rem;
}

.completed-badge {
  display: inline-block;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  padding: 0.375rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.pagination-section {
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

.pagination-btn {
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

.page-indicator {
  color: #475569;
  font-weight: 600;
  font-size: 0.875rem;
  min-width: 60px;
  text-align: center;
}

/* Modal Styles */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  animation: fadeIn 0.2s ease-out;
}

.modal-dialog {
  background: white;
  border-radius: 16px;
  width: 500px;
  max-width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modal-title {
  margin: 0;
  color: #0ea5e9;
  font-size: 1.25rem;
  font-weight: 700;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    background: #f1f5f9;
    color: #374151;
  }
}

.modal-body {
  padding: 2rem;
}

.feedback-preview {
  margin-bottom: 1.5rem;
}

.preview-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.feedback-text {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #0ea5e9;
  margin: 0;
  color: #475569;
  font-size: 0.9rem;
  line-height: 1.6;
}

.response-input {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.response-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 0.9rem;
  line-height: 1.6;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
  }

  &::placeholder {
    color: #94a3b8;
  }
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e2e8f0;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  background: #f8fafc;
}

.send-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(14, 165, 233, 0.3);

  &:hover {
    background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(14, 165, 233, 0.4);
  }
}

.send-icon {
  font-size: 0.9rem;
}

.cancel-button {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
    transform: translateY(-1px);
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideIn {
  from { 
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to { 
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@media (max-width: 1024px) {
  .feedback-management {
    padding: 1rem;
  }
  
  .header-section {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .modern-feedback-table {
    font-size: 0.8rem;
  }
  
  .modern-feedback-table th,
  .modern-feedback-table td {
    padding: 0.75rem 0.5rem;
  }
}

@media (max-width: 768px) {
  .pagination-section {
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  
  .modal-dialog {
    width: 95%;
  }
  
  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem 1.5rem;
  }
}
</style>