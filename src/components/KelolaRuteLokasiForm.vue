<template>
    <div class="form-tambah-rute">
      <!-- Informasi Lokasi -->
      <div class="form-inputs">
        <input type="text" placeholder="Nama Lokasi" v-model="formData.nama_lokasi" />
        <textarea placeholder="Deskripsi Lokasi" v-model="formData.deskripsi"></textarea>
        <input type="text" placeholder="Info Tambahan" v-model="formData.info" />
        
        <!-- Upload Placeholder -->
        <label class="upload-label">Upload Gambar Placeholder</label>
        <input type="file" @change="handlePlaceholderUpload" />
        <img v-if="previewPlaceholder" :src="previewPlaceholder" class="preview-img" />
      </div>
  
      <!-- Langkah-Langkah -->
      <div class="langkah-container">
        <h3>Langkah-Langkah</h3>
        <div v-for="(langkah, index) in formData.langkahs" :key="index" class="langkah-box">
          <input type="text" placeholder="Deskripsi Langkah" v-model="langkah.deskripsi_langkah" />
          <select v-model="langkah.arah">
            <option value="" disabled>Pilih Arah</option>
            <option value="kiri">Kiri</option>
            <option value="kanan">Kanan</option>
            <option value="lurus">Lurus</option>
            <option value="spot">Spot</option>
            <option value="naik">Naik</option>
            <option value="turun">Turun</option>
            <option value="ramp">Ramp Kursi Roda</option>
          </select>
          <label>Upload Gambar Langkah</label>
          <input type="file" @change="e => handleLangkahImageUpload(e, index)" />
          <img v-if="langkah.previewImage" :src="langkah.previewImage" class="preview-img" />
  
          <label>Upload GIF (Opsional)</label>
          <input type="file" @change="e => handleLangkahGifUpload(e, index)" />
          <video v-if="langkah.previewGif" class="preview-img" autoplay loop muted :src="langkah.previewGif"></video>
        </div>
  
        <button @click="addLangkah" class="btn-add">+ Tambah Langkah</button>
      </div>
  
      <!-- Tombol Aksi -->
      <div class="form-actions">
        <button class="btn-cancel" @click="cancel">Cancel</button>
        <button class="btn-save" @click="save">Simpan Rute</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import Swal from 'sweetalert2';

  const formData = ref({
    nama_lokasi: '',
    deskripsi: '',
    info: '',
    placeholder: null,
    langkahs: []
  });
  
  const previewPlaceholder = ref(null);
  
  const handlePlaceholderUpload = (e) => {
    const file = e.target.files[0];
    formData.value.placeholder = file;
    previewPlaceholder.value = URL.createObjectURL(file);
  };
  
  const handleLangkahImageUpload = (e, index) => {
    const file = e.target.files[0];
    formData.value.langkahs[index].gambar = file;
    formData.value.langkahs[index].previewImage = URL.createObjectURL(file);
  };
  
  const handleLangkahGifUpload = (e, index) => {
    const file = e.target.files[0];
    formData.value.langkahs[index].gif = file;
    formData.value.langkahs[index].previewGif = URL.createObjectURL(file);
  };
  
  const addLangkah = () => {
    formData.value.langkahs.push({
      deskripsi_langkah: '',
      arah: '',
      gambar: null,
      gif: null,
      previewImage: null,
      previewGif: null
    });
  };
  
  const cancel = () => {
    // Reset
    formData.value = {
      nama_lokasi: '',
      deskripsi: '',
      info: '',
      placeholder: null,
      langkahs: []
    };
    previewPlaceholder.value = null;
  };
  

const save = async () => {
  try {
    const formDataPayload = new FormData();

    // Tambahkan field JSON
    const langkahs = formData.value.langkahs.map(({ previewImage, previewGif, gambar, gif, ...rest }) => rest);
    const data = {
      nama_lokasi: formData.value.nama_lokasi,
      deskripsi: formData.value.deskripsi,
      info: formData.value.info,
      langkahs,
    };
    formDataPayload.append('data', JSON.stringify(data));

    // Placeholder
    formDataPayload.append('placeholder', formData.value.placeholder);

    // Langkah gambar & gif
    formData.value.langkahs.forEach((langkah) => {
  if (langkah.gambar instanceof File) {
    formDataPayload.append('langkah_gambar', langkah.gambar);
  }
  if (langkah.gif instanceof File) {
    formDataPayload.append('langkah_gif', langkah.gif);
  }
});


    await axios.post('http://localhost:3000/api/upload/rute', formDataPayload);

    Swal.fire({
      icon: 'success',
      title: 'Rute berhasil ditambahkan!',
      timer: 1500,
      showConfirmButton: false
    });

    cancel();
  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: 'error',
      title: 'Gagal menambahkan rute!',
      text: err.message
    });
  }
};

  </script>
  
  <style scoped lang="scss">
  .form-tambah-rute {
    padding: 1.4rem;
  
    .form-inputs {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      input, textarea, select {
        padding: 0.8rem;
        border: 2px solid #ccc;
        border-radius: 8px;
        font-weight: 500;
      }
      .upload-label {
        font-weight: bold;
      }
    }
  
    .preview-img {
      margin-top: 0.5rem;
      width: 150px;
      height: auto;
      border-radius: 8px;
      border: 1px solid #999;
    }
  
    .langkah-container {
      margin-top: 2rem;
      .langkah-box {
        border: 1px solid #ccc;
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  
    .btn-add {
      padding: 0.5rem 1rem;
      background: #4472C4;
      color: white;
      font-weight: bold;
      border-radius: 6px;
      margin-top: 1rem;
      border: none;
      cursor: pointer;
    }
  
    .form-actions {
      margin-top: 1.5rem;
      display: flex;
      gap: 1rem;
      
      .btn-cancel {
        background-color: red;
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
  
      .btn-save {
        background-color: #4472C4;
        color: white;
        padding: 0.8rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
  </style>
  