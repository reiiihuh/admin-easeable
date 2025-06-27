<template>
    <nav class="navbar">
      <div class="user-profile" @click="toggleDropdown">
        <img :src="profilePicture" alt="User Profile" class="profile-pic">
        <div class="user-info">
          <span class="user-name">{{ userName }}</span>
          <!-- <span class="user-role">{{ userRole }}</span> -->
        </div>
        <!-- <i class="dropdown-icon"></i> -->
      </div>
      <!-- <div v-if="isDropdownOpen" class="dropdown-menu">
        <a href="#" class="dropdown-item">Profile</a>
        <a href="#" class="dropdown-item">Settings</a>
        <a href="#" class="dropdown-item">Logout</a>
      </div> -->
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        userName: "User",  // Nilai default sebelum data diambil
        userRole: "Role",  // Nilai default sebelum data diambil
        profilePicture: "/src/assets/Logo icon.png",
        isDropdownOpen: false
      };
    },
    created() {
      // Ambil data user dari localStorage
      this.userName = localStorage.getItem('name') || 'User';  // Jika tidak ada, tampilkan "User"
      // this.userRole = localStorage.getItem('email') || 'Role';      // Jika tidak ada, tampilkan "Role"
    },
    methods: {
      toggleDropdown() {
        this.isDropdownOpen = !this.isDropdownOpen;
      }
    }
  }
  </script>  
  
  <style lang="scss" scoped>
  .navbar {
    display: flex;
    justify-content: flex-end;
    padding: 4px 20px;
    background-color: #fff;
    border-bottom: 2px solid var(--outline);
  
    .user-profile {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
      padding-right: 2rem;
    //   kotak user
      background-color: var(--white);
      border-radius: 20px;
      padding: 5px 20px 5px 20px;
      border: 2px solid var(--outline);
  
      .profile-pic {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        margin-right: 10px;
      }
  
      .user-info {
        display: flex;
        flex-direction: column;
        margin-right: 10px;
  
        .user-name {
          font-size: 0.9em;
          font-weight: bold;
        }
  
        .user-role {
          font-size: 0.8em;
          color: #777;
        }
      }
  
      .dropdown-icon {
        border: solid black;
        border-width: 0 1.5px 1.5px 0;
        display: inline-block;
        padding: 3px;
        transform: rotate(45deg);
        margin-left: 5px;
        align-self: center;
      }
    }
  
    .dropdown-menu {
      position: absolute;
      right: 2rem;
      top: 3.8rem;
      background-color: #fff;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      border: 2px solid var(--outline);
      border-radius: 5px;
      overflow: hidden;
  
      .dropdown-item {
        display: block;
        padding: 10px 20px;
        color: #333;
        text-decoration: none;
        transition: background 0.3s ease;
  
        &:hover {
          background-color: #f0f0f0;
        }
      }
    }
  }
  </style>
  