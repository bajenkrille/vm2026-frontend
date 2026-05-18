<script setup>
  import { reactive } from 'vue';
  import { useLoginStore } from '@/stores/loginStore'
  
  const credentials = reactive({
    email: "",
    password: ""
  })

  const loginStore = useLoginStore()

  const onSubmit = () => {
    loginStore.loginUser(credentials)
    // console.log("Heja Bajen " + credentials.email + " " + credentials.password);
  }
</script>

<template>
  <form @submit.prevent="onSubmit" action="">
    <div class="mb-3">
      <label for="exampleFormControlInput1" class="form-label">Email address</label>
      <input v-model="credentials.email" type="email" class="form-control" id="exampleFormControlInput1" placeholder="name@example.com">
    </div>
    <div class="b-3">
      <label for="inputPassword5" class="form-label">Password</label>
      <input v-model="credentials.password" type="password" id="inputPassword5" class="form-control" aria-describedby="passwordHelpBlock">
      <div id="passwordHelpBlock" class="form-text">
        Your password must be 8-20 characters long, contain letters and numbers, and must not contain spaces, special characters, or emoji.
      </div>
    </div>
    <input type="submit" value="Login" class="btn btn-primary">
  </form>
</template>
