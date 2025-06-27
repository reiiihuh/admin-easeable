<template>
    <main class="input-transac-page">
        <h1>Kelola Feedback</h1>
    </main>
    <div class="detail">
        <KelolaFeedback/>
    </div>

</template>

<script setup>
import KelolaFeedback from '../components/KelolaFeedback.vue';
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