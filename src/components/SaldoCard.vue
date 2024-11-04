<template>
    <div class="card saldo-card">
      <div class="card-header">
        <span class="material-icons">paid</span><span class="text">Saldo</span>
        <select v-model="selectedFilter" @change="updateData">
          <option value="today">Hari ini</option>
          <option value="lastWeek">Minggu lalu</option>
          <option value="lastMonth">Bulan lalu</option>
        </select>
      </div>
      <div class="card-body">
        <p>Rp. {{ saldo }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        saldo: 0,
        selectedFilter: "today",
      };
    },
    methods: {
      updateData() {
        // Logic untuk memperbarui saldo berdasarkan selectedFilter
      },
    },
  };
  </script>
  
  <style scoped lang="scss">
  .saldo-card {
    border: 2px solid var(--outline);
    border-radius: 8px;
    padding: 10px;
    margin: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    display: inline-block; /* Pastikan card menyesuaikan ukuran konten */
    width: max-content; /* Ukuran card akan mengikuti panjang konten */
    height: 10rem;
    
    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
  
      .material-icons {
        color: var(--inactive);
      }
  
      .text {
        font-size: 1.3rem;
        font-weight: 700;
        color: var(--inactive);
        margin-left: 8px;
        padding-right: 2rem;
      }
  
      select {
        border: 2px solid var(--outline);
        background-color: var(--white);
        padding: 8px;
        border-radius: 10px;
        cursor: pointer;
        font-weight: bold;
      }
    }
  
    .card-body {
      p {
        font-size: 2rem;
        font-weight: bold;
        margin-top: 1.8rem;
      }
    }
  }
  </style>
  