<script setup>
  import { useDeltagareStore } from '@/stores/deltagareStore'
  import { onMounted, ref } from 'vue';

  const deltagareStore = useDeltagareStore()

  onMounted(() => {
    deltagareStore.getDeltagareAndCompleteness()
  })
</script>

<template>
<div class="container">
  <h1 class="mt-3 mb-5">Vem är vem?</h1>

  <div class="row">
    <div class="col-4 bg-light border"><b>Användarnamn</b></div>
    <div class="col-8 bg-light border"><b>För- och efternamn</b></div>
  </div>
  <div class="row" v-for="deltagaren in deltagareStore.deltagareStatus" :key="deltagaren.user">
    <div class="col-4 bg-light border">{{ deltagaren.user }}</div>
    <div class="col-8 bg-light border">{{ deltagaren.fornamn }}&nbsp;{{ deltagaren.efternamn }}</div>
  </div>

  <br /><br />
</div>
</template>

<style scoped>
  .results_ball {
    height: 25px;
    width: 25px;
    font-size: large;
  }
  
  .col_match {
      width: 5%;
  }
  
  .col_date {
      width: 8%;
  }
  
  .col_group {
      width: 8%;
      text-align: center;
  }
  
  .col_dash {
      width: 2%;
  }
  
  .col_team {
      width: 24%;
      text-align: center;
  }
  
  .col_place {
      width: 29%;
  }
  
  .team {
    max-width: 280px;
  }
  
  @media (max-width: 768px) {
    .team {
      max-width: 100px;
    }
  }
  
  </style>