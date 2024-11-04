<template>
    <div class="detail-pengeluaran">
      <!-- <h1>Detail Pengeluaran</h1> -->
      <div class="detail-container">
        <div class="image-section">
          <img :src="detailData.foto" alt="Foto Pengeluaran" />
        </div>
        <div class="info-section">
          <div class="form-group">
            <label>Judul</label>
            <input v-model="formData.title" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Tanggal</label>
            <input type="date" v-model="formData.date" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Jenis</label>
            <input v-model="formData.type" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Kategori</label>
            <input v-model="formData.category" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Biaya</label>
            <input v-model="formData.cost" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Nama Pelapor</label>
            <input v-model="formData.reporter" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Role</label>
            <input v-model="formData.role" :disabled="!isEditing" />
          </div>
          <div class="form-group">
            <label>Deskripsi</label>
            <textarea v-model="formData.description" :disabled="!isEditing"></textarea>
          </div>
        </div>
      </div>
      <div class="button-group">
      <button @click="toggleEditMode" v-if="!isEditing" class="edit">Edit</button>
      <button @click="saveDetails" v-if="isEditing" class="save">Save</button>
      <button @click="cancelEdit" v-if="isEditing" class="cancel">Cancel</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isEditing = ref(false);
  const detailData = ref({
    foto: 'https://via.placeholder.com/200',
    title: 'Makan Siang',
    date: '2024-08-29',
    type: 'Non-Operational',
    category: 'Pribadi',
    cost: 'Rp. 100.000',
    reporter: 'John Doe',
    role: 'Staff',
    description: 'Pengeluaran untuk makan siang bersama tim.'
  });
  
  const formData = ref({ ...detailData.value });
  
  const toggleEditMode = () => {
    isEditing.value = true;
  };
  
  const saveDetails = () => {
    isEditing.value = false;
    detailData.value = { ...formData.value };
  };
  
  const cancelEdit = () => {
    isEditing.value = false;
    formData.value = { ...detailData.value };
  };
  </script>
  
  <style scoped lang="scss">
  .detail-pengeluaran {
    padding: 1.5rem;
    h1 {
      color: var(--green-kkc);
      font-weight: 700;
    }
    .detail-container {
      display: flex;
      gap: 2rem;
    }
    .image-section {
      flex: 1;
      img {
        width: 100%;
        max-width: 200px;
        border-radius: 8px;
      }
    }
    .info-section {
      flex: 4;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      .form-group {
        display: flex;
        flex-direction: column;
        label {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        input,
        textarea {
          padding: 0.5rem;
          border: 2px solid var(--outline);
          border-radius: 8px;
          resize: none;
          &:disabled {
            background-color: #f5f5f5;
          }
        }
      }
      textarea {
        resize: vertical;
      }
    }
    .button-group {
      margin-top: 1.5rem;
      button {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        &.edit {
          background-color: var(--green-kkc);
          color: white;
          margin-right: 1rem;
        }
        &.save {
          background-color: var(--green-kkc);
          color: white;
          margin-right: 1rem;
        }
        &.cancel {
          background-color: red;
          color: white;
        }
      }
    }
  }
  </style>
  