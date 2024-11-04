<template>
    <main class="input-transac-page">
        <h1>Kelola Akun Keuangan</h1>
        <p>Tambah/Hapus Kategori</p>
    </main>
    <div class="cards-wrapper">
        <div class="card-op">
            <AddCategoryOP/>
        </div>
        <div class="card-non-op">
            <AddCategoryNonOP/>
        </div>
        <div class="card-prive">
            <AddCategoryPrive/>
        </div>
    </div>
</template>

<script setup>
import AddCategoryOP from '../components/AddCategoryOP.vue';
import AddCategoryNonOP from '../components/AddCategoryNonOP.vue';
import AddCategoryPrive from '../components/AddCategoryPrive.vue';
</script>

<style lang="scss" scoped>
main {
    padding: 1.4rem;
    h1 {
        color: var(--green-kkc);
        font-weight: 700;
    }
}

.cards-wrapper {
    display: flex;
    gap: 0.9rem; /* Memberikan jarak antar card */
    padding: 1.4rem;
}

.card-op, .card-non-op, .card-prive {
    display: flex;
    flex-direction: column; /* Menjaga konten card tetap vertikal */
    padding: 1.4rem;
}
</style>
