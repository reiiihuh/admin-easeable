<template>
    <main class="home-page">
        <h1>Dashboard</h1>
        <!-- <p>Ini Halaman Dashboard Utama</p> -->
    </main>
    <div class="cards-container">
			<!-- <SaldoCard /> -->
			<ExpenseCard />
			<ChartCard/>
		 </div>
    <div class="history">
        <RiwayatCard/>
    </div>

</template>

<script setup>
import SaldoCard from '../components/SaldoCard.vue';
import ExpenseCard from '../components/ExpenseCard.vue';
import ChartCard from '../components/ChartCard.vue';
import RiwayatCard from '../components/RiwayatCard.vue';
</script>

<style lang="scss" scoped>
 .home-page{
    padding: 1.4rem;

    h1{
        font-weight: 700;
        color: var(--green-kkc);
    }
 }

 .history{
    padding: 1rem;
    position: relative;
 }
</style>