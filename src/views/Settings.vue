<template>
    <main class="input-transac-page">
        <h1>Pengaturan</h1>
        <!-- <p>Halaman Catat Pengeluaran</p> -->
    </main>
<div class="container">
    <div class="card">
        <AccManagerCard/>
    </div>
    <div class="card">
        <AddAccount/>
    </div>
</div>

</template>

<script setup>
import AccManagerCard from '../components/AccManagerCard.vue';
import AddAccount from '../components/AddAcc.vue';
</script>

<style lang="scss" scoped>
 main{
    padding: 1.4rem;
    h1{
        color: var(--green-kkc);
        font-weight: 700;
    }
 }

 .card{
    padding: 1.4rem;
 }

 .container{
    display: flex;
    gap: 0.7rem;
 }
</style>