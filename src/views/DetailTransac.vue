<template>
    <main class="input-transac-page">
        <h1>Detail Transaksi</h1>
        <!-- <p>Halaman Detail Transaksi</p> -->
    </main>
    <div class="detail">
        <DetailTransacView/>
    </div>

</template>

<script setup>
import DetailTransacView from '../components/DetailTransacView.vue';
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