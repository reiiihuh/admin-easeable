<template>
    <router-link to="/AddAccount" class="card">
      <div class="icon-container">
        <span class="material-icons">manage_accounts</span>
      </div>
      <div class="text-container">
        <p>Kelola Akun</p>
      </div>
    </router-link>
  </template>
  
  <script>
  export default {
    name: 'Card',
  };
  </script>
  
<style scoped lang="scss">
  .card {
    width: 9.4rem; /* Sesuaikan dengan kebutuhan */
    height: 150px;
    background-color: var(--golden-kkc); /* Warna latar belakang sesuai gambar */
    border: 2px solid var(--outline);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    text-decoration: none;
  }
  
  .card:hover {
    transform: scale(1.05); /* Efek saat hover */
  }
  
  .icon-container {
    color: var(--white); /* Warna icon */
    .material-icons{
    font-size: 4rem; /* Ukuran icon */
    }
  }
  
  .text-container {
    margin-top: 10px;
    text-align: center;
  }
  
  .text-container p {
    font-size: 16px;
    font-weight: bold;
    color: white; /* Warna teks */
    margin: 0;
  }
</style>
  