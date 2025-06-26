<template>
	<div class="app">
	  <!-- Sidebar -->
	  <Sidebar v-if="showSidebarAndNavbar" />
  
	  <!-- Main Content -->
	  <div class="main-content">
		<!-- Navbar -->
		<Navbar v-if="showSidebarAndNavbar" />
  
		<!-- Content Wrapper for Scroll -->
		<div class="content-wrapper">
		  <router-view />
		</div>
	  </div>
	</div>
  </template>
  
  
  <script setup>
  import { useRoute } from 'vue-router';
  import { computed } from 'vue';
  import Sidebar from './components/Sidebar.vue';
  import Navbar from './components/Navbar.vue';
  
  // Menggunakan useRoute untuk mendapatkan rute saat ini
  const route = useRoute();
  
  // Menggunakan computed property untuk memantau perubahan rute
  const showSidebarAndNavbar = computed(() => {
	return route.path !== '/Login' && route.path !== '/Register';
  });
  </script>
  
  <style lang="scss">
  :root {
	--primary: #4ade80;
	--grey: #64748b;
	--dark: #1e293b;
	--dark-alt: #334155;
	--light: #f1f5f9;
	--sidebar-width: 300px;
	--outline: #d9d9d9;
	--green-kkc: #4472C4;
	--inactive: #9a9a9a;
	--golden-kkc: #9a9a9a;
	--white: #ffff;
	--black: #000000;
	--blue-coe: #4472C4;
  }
  
  * {
	margin: 0;
	padding: 0;
	box-sizing: border-box;
	font-family: 'Lato', sans-serif;
  }
  
  body {
	background: var(--white);
  }
  
  button {
	cursor: pointer;
	appearance: none;
	border: none;
	outline: none;
	background: none;
  }
  
  .app {
	display: flex;
	height: 100vh;
  }
  
  .main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 0;
  background-color: var(--white);
  overflow-y: auto; /*scrollbar*/
  max-height: 100vh; /*max height viewport*/
}

  
  .cards-container {
	display: flex;
	gap: 1rem; /* Menambah jarak antar card */
	padding: 0.3rem;
  }
  
  @media (max-width: 768px) {
	.main-content {
	  padding-left: 6rem;
	}
	.cards-container {
	  flex-direction: column; /* Menumpuk card ke bawah pada layar kecil */
	  padding: 1rem;
	}
  }
  </style>
  