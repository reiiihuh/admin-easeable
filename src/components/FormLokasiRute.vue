<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const props = defineProps({
  initialForm: Object
})
const emit = defineEmits(['success', 'cancel'])

const localForm = ref({})

watch(() => props.initialForm, (val) => {
  localForm.value = JSON.parse(JSON.stringify(val))
}, { immediate: true, deep: true })

const handlePlaceholderUpload = (e) => {
  const file = e.target.files[0]
  localForm.value.placeholder = file
  localForm.value.previewPlaceholder = URL.createObjectURL(file)
}

const handleLangkahImageUpload = (e, index) => {
  const file = e.target.files[0]
  localForm.value.langkahs[index].gambar = file
  localForm.value.langkahs[index].previewImage = URL.createObjectURL(file)
}

const handleLangkahGifUpload = (e, index) => {
  const file = e.target.files[0]
  localForm.value.langkahs[index].gif = file
  localForm.value.langkahs[index].previewGif = URL.createObjectURL(file)
}

const addLangkah = () => {
  const nextUrutan = localForm.value.langkahs.length + 1
  localForm.value.langkahs.push({
    deskripsi_langkah: '',
    arah: '',
    gambar: null,
    gif: null,
    previewImage: null,
    previewGif: null,
    urutan_langkah: nextUrutan,
    id_rute: null // awalnya null, nanti diisi backend
  })
}

const hapusLangkah = async (index) => {
  const langkah = localForm.value.langkahs[index]
  const confirm = await Swal.fire({
    title: 'Yakin?',
    text: langkah.id_rute ? 'Langkah akan dihapus dari database.' : 'Langkah ini belum tersimpan.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus!',
    cancelButtonText: 'Batal'
  })
  if (confirm.isConfirmed) {
    if (langkah.id_rute) {
      try {
        await axios.delete(`http://localhost:3000/api/slides/${langkah.id_rute}`)
      } catch (err) {
        Swal.fire('Gagal!', 'Gagal menghapus dari server.', 'error')
        return
      }
    }
    localForm.value.langkahs.splice(index, 1)
  }
}

const submitEdit = async () => {
  try {
    Swal.fire({
      title: 'Menyimpan...',
      text: 'Mohon tunggu',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    })

    const langkahs = localForm.value.langkahs || []

    // === 1. Update lokasi
    const lokasiForm = new FormData()
    lokasiForm.append('id_lokasi', localForm.value.id_lokasi)
    lokasiForm.append('nama_lokasi', localForm.value.nama_lokasi)
    lokasiForm.append('deskripsi', localForm.value.deskripsi || '')
    lokasiForm.append('info', localForm.value.info || '')
    if (localForm.value.placeholder instanceof File) {
      lokasiForm.append('placeholder', localForm.value.placeholder)
    } else {
      lokasiForm.append('url_placeholder', localForm.value.url_placeholder)
    }
    lokasiForm.append('langkahs', JSON.stringify(
      langkahs.map((l, i) => ({
        id_rute: l.id_rute,
        deskripsi_langkah: l.deskripsi_langkah,
        arah: l.arah,
        urutan_langkah: i + 1
      }))
    ))

    await axios.put(`http://localhost:3000/api/locations/${localForm.value.id_lokasi}`, lokasiForm)

    // === 2. Update langkah lama
    const updatePromises = langkahs
      .filter(l => l.id_rute)
      .map((l, i) => {
        const form = new FormData()
        form.append('deskripsi_langkah', l.deskripsi_langkah)
        form.append('arah', l.arah)
        form.append('urutan_langkah', i + 1)
        form.append('nama_lokasi', localForm.value.nama_lokasi)

        if (l.gambar instanceof File) {
          form.append('langkah_gambar', l.gambar)
        } else {
          form.append('url_gambar', l.url_gambar || '')
        }

        if (l.gif instanceof File) {
          form.append('langkah_gif', l.gif)
        } else {
          form.append('url_gif', l.url_gif || '')
        }

        return axios.put(`http://localhost:3000/api/slides/${l.id_rute}`, form)
      })

    await Promise.all(updatePromises)

    // === 3. Tambah langkah baru
    const langkahBaru = langkahs.filter(l => !l.id_rute)
    if (langkahBaru.length > 0) {
      const formBaru = new FormData()
      formBaru.append('data', JSON.stringify({
        id_lokasi: localForm.value.id_lokasi,
        nama_lokasi: localForm.value.nama_lokasi,
        langkahs: langkahBaru.map((l, i) => ({
          deskripsi_langkah: l.deskripsi_langkah,
          arah: l.arah,
          urutan_langkah: i + 1 + updatePromises.length
        }))
      }))
      langkahBaru.forEach((l) => {
        if (l.gambar instanceof File) formBaru.append('langkah_gambar', l.gambar)
        if (l.gif instanceof File) formBaru.append('langkah_gif', l.gif)
      })
      const res = await axios.post('http://localhost:3000/api/upload/rute', formBaru)
      // ❗ UPDATE ID RUTE dari response
      if (res.data && res.data.langkahs) {
        res.data.langkahs.forEach((newL, i) => {
          langkahBaru[i].id_rute = newL.id_rute
        })
      }
    }

    Swal.close()
    Swal.fire('Berhasil!', 'Data berhasil diperbarui.', 'success')
    emit('success')

  } catch (err) {
    Swal.close()
    console.error(err)
    Swal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan.', 'error')
  }
}
</script>

<template>
  <div class="form-wrapper">
    <h2>Edit Lokasi & Rute</h2>

    <div class="form-section">
      <input type="text" placeholder="Nama Lokasi" v-model="localForm.nama_lokasi" />
      <textarea placeholder="Deskripsi Lokasi" v-model="localForm.deskripsi" />
      <input type="text" placeholder="Info Tambahan" v-model="localForm.info" />

      <label>Gambar Placeholder:</label>
      <input type="file" @change="handlePlaceholderUpload" />
      <img v-if="localForm.previewPlaceholder" :src="localForm.previewPlaceholder" class="preview-img" />
      <img v-else-if="localForm.url_placeholder" :src="localForm.url_placeholder" class="preview-img" />
    </div>

    <div class="langkah-section">
      <h3>Langkah Navigasi</h3>

      <div v-for="(langkah, i) in localForm.langkahs" :key="i" class="langkah-box">
        <input type="text" placeholder="Deskripsi Langkah" v-model="langkah.deskripsi_langkah" />
        <select v-model="langkah.arah">
          <option disabled value="">Pilih Arah</option>
          <option value="kiri">Kiri</option>
          <option value="kanan">Kanan</option>
          <option value="lurus">Lurus</option>
          <option value="spot">Spot</option>
          <option value="naik">Naik</option>
          <option value="turun">Turun</option>
          <option value="ramp">Ramp Kursi Roda</option>
        </select>

        <label>Gambar Langkah:</label>
        <input type="file" @change="e => handleLangkahImageUpload(e, i)" />
        <img v-if="langkah.previewImage" :src="langkah.previewImage" class="preview-img" />
        <img v-else-if="langkah.url_gambar" :src="langkah.url_gambar" class="preview-img" />

        <label>GIF (Opsional):</label>
        <input type="file" @change="e => handleLangkahGifUpload(e, i)" />
        <video v-if="langkah.previewGif" :src="langkah.previewGif" class="preview-img" autoplay loop muted />
        <video v-else-if="langkah.url_gif" :src="langkah.url_gif" class="preview-img" autoplay loop muted />

        <button class="btn-delete" @click="hapusLangkah(i)">Hapus Langkah</button>
      </div>

      <button @click="addLangkah" class="btn-add">+ Tambah Langkah</button>
    </div>

    <div class="form-actions">
      <button @click="submitEdit" class="btn-save">Simpan</button>
      <button @click="$emit('cancel')" class="btn-cancel">Batal</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.form-wrapper {
  padding: 1rem;
  max-width: 900px;
  margin: auto;

  h2, h3 {
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .form-section,
  .langkah-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  input, textarea, select {
    padding: 0.8rem;
    border: 1.5px solid #ccc;
    border-radius: 8px;
    font-size: 1rem;
    width: 100%;
  }

  .langkah-box {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 10px;
    background: #f9f9f9;
  }

  .preview-img {
    margin-top: 0.5rem;
    width: 150px;
    border-radius: 8px;
    border: 1px solid #999;
  }

  .btn-add {
    background: #0c7b53;
    color: white;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: bold;
    border: none;
    margin-top: 1rem;
    cursor: pointer;
  }

  .btn-save, .btn-cancel {
    padding: 0.8rem 1.4rem;
    border: none;
    border-radius: 6px;
    font-weight: bold;
    font-size: 1rem;
    cursor: pointer;
  }

  .btn-save {
    background-color: #1976d2;
    color: white;
  }

  .btn-cancel {
    background-color: #e0e0e0;
    color: #333;
  }

  .btn-delete {
    background-color: #d9534f;
    color: white;
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    margin-top: 10px;
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
  }
}
</style>
