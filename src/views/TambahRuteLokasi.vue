<template>
    <main class="input-transac-page">
        <h1>Tambah Lokasi dan Rute</h1>
        <!-- <p>Halaman Catat Pengeluaran</p> -->
    </main>
    <div class="form">
        <FormData/>
    </div>

</template>

<script setup>
import FormData from '../components/KelolaRuteLokasiForm.vue';
</script>

<style lang="scss" scoped>
 main{
    padding: 1.4rem;
    h1{
        color: var(--green-kkc);
        font-weight: 700;
    }
 }
</style>