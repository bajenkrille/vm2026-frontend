<script setup>
  import { useDeltagareStore } from '@/stores/deltagareStore'
  import { useTipsStore } from '@/stores/tipsStore'
  import { useMatcherStore } from '@/stores/matcherStore'
  import { onMounted, ref } from 'vue';

  const deltagareStore = useDeltagareStore()
  const tipsStore = useTipsStore()
  const matcherStore = useMatcherStore()
  let pointsPerUser = ref([])

  // const calculateTotalPoints = () => {
  //   const points = tipsStore.pointsArray
  //   console.log("Pointsssss: ",points);
  //   const deltagare = deltagareStore.deltagare
  //   console.log("Deltagare: ",deltagare);
  //   points.forEach(obj => {
  //     if (!pointsPerUser.value.some(i => i.userId === obj.deltagareId)){
  //       const deltagaren = deltagare.find(d => d.id === obj.deltagareId)
  //       pointsPerUser.value.push({
  //         userId: obj.deltagareId,
  //         userName: deltagaren.nick_name,
  //         points: 0
  //       })
  //     }
  //     const item = pointsPerUser.value.find(i => i.userId === obj.deltagareId)
  //     item.points += obj.points
  //   })
  //   pointsPerUser.value.sort((a,b) => b.points - a.points)
  //   console.log("pointsPerUser: ",pointsPerUser.value); 
  //   tipsStore.stallning = pointsPerUser.value
  //   console.log("tipsStore.stallning: ",tipsStore.stallning);
  // }

  onMounted(async () => {
    await deltagareStore.getDeltagare()
    await tipsStore.getAndStorePoints()
    await matcherStore.getLastUpdate()
    await matcherStore.calculateTotalPoints(pointsPerUser)
    await tipsStore.getPointDetails()

  })
</script>

<template>
<div class="container">
  <h1 class="mt-3 mb-3">Ställning</h1>
  <p style="font-size: 14px;">Flest poäng efter 72 matcher vinner. <br>
    Vid lika poäng räknas först flest 3-poängare.<br> Därefter avgör flest rätt resultat (2- och 3-poängare).<br> 
    Om det fortfarande är lika, flest poänggivande matcher (1-, 2- och 3-poängare).</p>
  <p class="text-success">Ställningen ska nu sorteras enligt reglerna för 1-, 2- och 3-poängare.</p>
  <p style="font-size: 12px;">Senast uppdaterad {{ matcherStore.lastUpdate }}</p>
  <!-- <h3 class="text-warning">Poängen har räknats om efter ett tidigare mindre fel. De flesta har nu färre poäng.</h3> -->

  <div class="row">
    <div class="col-1 bg-light border"><b>Plats</b></div>
    <div class="col-3 bg-light border"><b>Användarnamn</b></div>
    <div class="col-1 bg-light border"><b>Poäng</b></div>
    <div class="col-1 bg-light border"><b class="badge bg-danger text-dark">3p</b></div>
    <div class="col-1 bg-light border"><b class="badge bg-success text-dark">2p</b></div>
    <div class="col-1 bg-light border"><b class="badge bg-warning text-dark">1p</b></div>
  </div>
  <div class="row" v-for="(user, index) in tipsStore.stallning" :key="user.userId">
    <div class="col-1 bg-light border">{{ index === 0 || user.points !== pointsPerUser[index - 1].points ? index + 1 : ''}}</div>
    <div class="col-3 bg-light border" :class="{gold: index === 0,silver: index === 1,bronze: index === 2}">{{ user.userName }}</div>
    <div class="col-1 bg-light border">{{ user.points }}</div>
    <div class="col-1 bg-light border">{{ user.threePointers }}</div>
    <div class="col-1 bg-light border">{{ user.twoPointers }}</div>
    <div class="col-1 bg-light border">{{ user.onePointers }}</div>
    <!-- <div class="col-1 border" :class="deltagaren.antal_tips === 72 ? 'bg-success' : 'bg-light'">{{deltagaren.antal_tips}}</div> -->
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

  .gold {
    background-color: #D4AF37 !important;
  }

  .silver {
    background-color: #BCC6CC !important;
  }

  .bronze {
    background-color: #D7A86E !important;
  }  
  @media (max-width: 768px) {
    .team {
      max-width: 100px;
    }
  }
  
  </style>