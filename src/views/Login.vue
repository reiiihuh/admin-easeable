<template>
  <div class="split-screen">
    <div class="left">
      <section class="copy">
        <!-- <p>Selamat Datang Di Aplikasi Expense KKC </p> -->
      </section>
    </div>
    <div class="right">
      <form @submit.prevent="loginAdmin">
        <section class="copy">
          <h2>Login</h2>
        </section>
        <div class="input-container name">
          <input id="fname" v-model="username" name="fname" type="text" placeholder="Username" />
        </div>
        <div class="input-container password">
          <input id="password" v-model="password" name="password" type="password" placeholder="Password" />
          <i class="fa fa-eye-slash"></i>
        </div>
        <button class="signup-btn" type="submit">Login</button>
        <!-- <div class="login-container">
          <p>Belum punya akun? <router-link to="/Register"><strong> Daftar</strong></router-link></p>
        </div> -->
        <!-- Gambar di pojok kiri bawah -->
        <img src="/src/assets/fitxcoe.jpg" class="imgbottom" alt="Logo Bawah" />
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const showPassword = ref(false);

const loginAdmin = async () => {
  try {
    const response = await axios.post('http://localhost:3000/api/admin/login', {
      username: username.value,
      password: password.value
    });

    const token = response.data.token;
    const user = response.data.user;

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));

    Swal.fire({
      icon: 'success',
      title: 'Login Berhasil!',
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: 'swal-custom'
      }
    });

    setTimeout(() => {
      router.push('/Homepage');
    }, 1600);
  } catch (err) {
    Swal.fire({
      icon: 'error',
      title: 'Login Gagal',
      text: err.response?.data?.message || 'Username atau password salah.',
      confirmButtonText: 'Coba Lagi',
      customClass: {
        popup: 'swal-custom'
      }
    });
  }
};
</script>


  
  <style lang="scss" scoped>
//   :root {
//     font-size: 100%;
//     font-size: 16px;
//     line-height: 1.5;
//     --primary-blue: #233975;
//   }
  
  body {
    padding: 0;
    margin: 0;
    font-weight: 500;
  }
  
  h1 {
    font-size: 2.25rem;
    font-weight: 700;
  }
  
  h2 {
    text-align: left;
    padding-bottom: 1.4rem;
    font-size: 1.8rem;
    font-weight: 700;
  }
  
  a {
    text-decoration: none;
    color: var(--primary-blue);
  }
  
  a:hover {
    text-decoration: none;
  }
  
  .small {
    font-size: 80%;
    text-align: center;
  }
  
  .split-screen {
    display: flex;
    flex-direction: column;
  }
  
  .left {
    height: 200px;
  }
  
  .left,
  .right {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  /* BG IMAGE */
  .left {
    background: linear-gradient(rgba(255, 255, 255, 0.5), rgba(140, 140, 140, 0.9)),
      url('/src/assets/Logo black.png');
    background-size: cover;
  }
  
  /* LEFT TEXT */
  .left .copy {
    color: var(--white);
    text-align: center;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
  }
  
  .left p {
    font-weight: 400;
    font-size: 2rem;
  }
  
  .right .copy {
    color: black;
    text-align: center;
  }
  
  .right .copy p {
    margin: 1.5em 0;
    font-size: 0.875rem;
  }
  .right form {
    width: 328px;
  }
  
  /* BOX INPUT FORM */
  form input[type='text'],
  form input[type='email'],
  form input[type='password'] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
    border: 2px solid var(--outline);
    padding: 1em;
    margin-bottom: 1.25rem;
    font-size: 0.875rem;
  }
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.75rem;
  }
  
  .input-container.password {
    position: relative;
  }
  
  .input-container.password i {
    position: absolute;
    top: 42px;
    right: 16px;
  }
  
  /* CHECKBOX SETUJU */
  .checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
  
  .checkbox-container {
    display: block;
    position: relative;
    padding-left: 2rem;
    cursor: pointer;
    user-select: none;
    margin: 0 0 1.25rem 0;
  }
  
  .checkbox-container input:checked ~ .checkmark {
    background-color: var(--primary-blue);
    border: 1px solid var(--primary-blue);
  }
  
  .checkmark {
    position: absolute;
    width: 24px;
    height: 24px;
    background: white;
    border: 1px solid #c4c4c4;
    border-radius: 2px;
    top: -4px;
    left: 0;
    transition: 0.3s;
  }
  
  .checkmark:after {
    content: '';
    position: absolute;
    display: none;
  }
  
  .checkbox-container input:checked ~ .checkmark:after {
    display: block;
  }
  
  .checkbox-container .checkmark:after {
    border: solid white;
    border-width: 0 3px 3px 0;
    width: 5px;
    height: 10px;
    left: 8px;
    top: 4px;
    transform: rotate(45deg);
  }
  
  /* TOMBOL DAFTAR */
  .signup-btn {
    display: block;
    width: 100%;
    background: var(--black);
    color: var(--white);
    font-weight: 700;
    border: none;
    padding: 1rem;
    border-radius: 14px;
    font-size: 0.9rem;
    // text-transform: uppercase;
    letter-spacing: 0.1rem;
    transition: 0.3s;
  }
  
  .signup-btn:hover {
    background: var(--green-kkc);
    cursor: pointer;
  }

  .login-container{
    padding-top: 1.4rem;
    text-align: center;

    strong{
        color: var(--blue-coe);
    }
  }

  .right {
  .imgtop, .imgbottom {
  width: 250px;
  max-width: 100%;
  height: auto;
  margin-top: 3rem;
  margin-left: 2.4rem;
}
}
  
  /* RESPONSIVE PAGE SETT */
  @media screen and (min-width: 900px) {
    .split-screen {
      flex-direction: row;
      height: 100vh;
    }
    .left,
    .right {
      display: flex;
      width: 50%;
      height: auto;
    }
  }
  </style>
  