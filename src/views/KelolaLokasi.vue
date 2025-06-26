<template>
    <main class="report-manager">
        <h1>Kelola Lokasi dan Rute</h1>
    </main>
    <div class="card">
        <ReportManagerCard/>
    </div>

</template>

<script setup>
import ReportManagerCard from '../components/KelolaLokasiTable.vue';
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
    padding: 1.2rem;
 }
</style>