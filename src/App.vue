<script setup>
  import TipsView from '@/views/TipsView.vue'
  import { onMounted } from 'vue';

  onMounted(() => {
    fetch('http://localhost:3000/api/bajen')
      .then(res => res.text())
      // .then(data => console.log(data))
      .catch(err => console.error(err))
  })
</script>

<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/tippa">Tippa</RouterLink>
    <RouterLink to="/matcher">Matcher</RouterLink>
  </nav>
  <div class="container">
    <RouterView />
  </div>
    <!-- <script src="./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"></script> -->

</template>

