<script setup>
  import { ref } from 'vue'
  import { onMounted, onUnmounted } from 'vue';
  import router from '@/router'
  import { useTipsStore } from '@/stores/tipsStore'
  import { useLoginStore } from '@/stores/loginStore'
  import { useDeltagareStore } from './stores/deltagareStore';
  import OneOptionModal from '@/components/OneOptionModal.vue'

  const loginStore = useLoginStore()
  const tipsStore = useTipsStore()
  const deltagareStore = useDeltagareStore()
  const menuOpen = ref(false)

  const logoutModal = ref(false);
  const logoutMessage = ref("");

  const logout = (msg) => {
    localStorage.removeItem('token')
    localStorage.removeItem('tips-draft')
    tipsStore.$reset()
    loginStore.$reset()
    menuOpen.value = false
    logoutMessage.value = msg
    logoutModal.value = true
    router.replace('/login')
  }

  let inactivityTimer

  const INACTIVITY_LIMIT = 30 * 60 * 1000 // 30 minutes

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer)

    inactivityTimer = setTimeout(() => {
      logout("Du har loggats ut pga inaktivitet. Logga in igen.")
    }, INACTIVITY_LIMIT)
  }

  onMounted(() => {
    window.addEventListener('mousemove', resetInactivityTimer)
    window.addEventListener('keydown', resetInactivityTimer)
    window.addEventListener('click', resetInactivityTimer)
    window.addEventListener('touchstart', resetInactivityTimer)

    resetInactivityTimer()

    deltagareStore.getDeltagareAndCompleteness()
  })

  onUnmounted(() => {
    clearTimeout(inactivityTimer)

    window.removeEventListener('mousemove', resetInactivityTimer)
    window.removeEventListener('keydown', resetInactivityTimer)
    window.removeEventListener('click', resetInactivityTimer)
    window.removeEventListener('touchstart', resetInactivityTimer)
  })
  // onMounted(() => {
  //   fetch('http://localhost:3000/api/bajen')
  //     .then(res => res.text())
  //     // .then(data => console.log(data))
  //     .catch(err => console.error(err))
  // })
</script>
<template>
 	<OneOptionModal
		v-if="logoutModal"
		title="Du har loggats ut."
		:message="logoutMessage"
		confirmText="Ok"
		@confirm="logoutModal = false"
	/>

  <nav class="navbar navbar-expand-md navbar-dark bg-dark">
    <div class="container-fluid">
      <RouterLink class="navbar-brand" to="/">
        The one and only...2026
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        @click="menuOpen = !menuOpen"
        aria-controls="mainNavbar"
        :aria-expanded="menuOpen"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <span
        class="navbar-text ms-auto me-4"
        :class="loginStore.isLoggedIn ? 'text-success' : 'text-danger'"
      >
        {{ loginStore.isLoggedIn
            ? `Inloggad som ${loginStore.userName}`
            : 'Ej inloggad'
        }}
      </span>

      <span
        class="navbar-text ms-auto me-2 text-warning"
      >
        {{ `Antal registrerade deltagare: ${deltagareStore.deltagare.length}`
        }}
      </span>

      <div
        id="mainNavbar"
        class="collapse navbar-collapse"
        :class="{ show: menuOpen }"
      >
        <ul class="navbar-nav ms-auto">
          <li class="nav-item">
            <RouterLink class="nav-link" to="/" @click="menuOpen = false">
              Home
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/login" @click="menuOpen = false">
              Login
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/register" @click="menuOpen = false">
              Register
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/matcher" @click="menuOpen = false">
              Matcher
            </RouterLink>
          </li>

          <li class="nav-item">
            <RouterLink class="nav-link" to="/tippa" @click="menuOpen = false">
              Tippa
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" to="/guide" @click="menuOpen = false">
              Tipsguide
            </RouterLink>
          </li>
          <li class="nav-item">
            <button
              class="btn btn-outline-danger ms-md-3"
              @click="logout('Vi ses!')"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <div class="container">
    <RouterView />
  </div>
</template>
<!-- <template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/login">Login</RouterLink>
    <RouterLink to="/register">Register</RouterLink>
    <RouterLink to="/tippa">Tippa</RouterLink>
    <RouterLink to="/matcher">Matcher</RouterLink>
  </nav>

</template> -->

