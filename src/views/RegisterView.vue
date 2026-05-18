<script setup>
  import { reactive } from 'vue';
  import { useLoginStore } from '@/stores/loginStore'
  
  const credentials = reactive({
    fornamn: "",
    efternamn: "",
    user: "",
    email: "",
    password: ""
  })

  const loginStore = useLoginStore()

  const onSubmit = () => {
    loginStore.registerUser(credentials)
    console.log("Heja Bajen " + credentials.email + " " + credentials.password);
  }
</script>

<template>
  <form @submit.prevent="onSubmit" action="">
    <div class="row mb-3">
      <div class="col">
      <label for="fornamn" class="form-label">Förnamn</label>
      <input v-model="credentials.fornamn"
             type="text"
             class="form-control"
             id="fornamn">
    </div>
    <div class="col">
      <label for="efternamn" class="form-label">Efternamn</label>
      <input v-model="credentials.efternamn"
             type="text"
             class="form-control"
             id="efternamn">
    </div>
    </div>
    <div class="mb-3">
      <label for="userName" class="form-label">Artistnamn/användarnamn</label>
      <input v-model="credentials.user" type="text" class="form-control" id="userName" placeholder="Pelé">
    </div>
    <div class="mb-3">
      <label for="email" class="form-label">Email address</label>
      <input v-model="credentials.email" type="email" class="form-control" id="email" placeholder="name@example.com">
    </div>
    <div class="b-3">
      <label for="inputPassword5" class="form-label">Password</label>
      <input v-model="credentials.password" type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
      <div id="passwordHelpBlock" class="form-text">
        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
      </div>
    </div>
    <input type="submit" value="Register" class="btn btn-primary">
  </form>
</template>
