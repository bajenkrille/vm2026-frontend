<script setup>
  import { useMatcherStore } from '@/stores/matcherStore'
  import { onMounted } from 'vue';

  const matcherStore = useMatcherStore()
  onMounted(() => {
    matcherStore.getMatchSchedule()
    matcherStore.getLastUpdate()
  })

  const getHomeGoalColor = (game) => {
    if (game.played === false) return 'text-bg-light'
    if (game.homeGoals > game.awayGoals) return 'text-bg-success'
    if (game.homeGoals < game.awayGoals) return 'text-bg-danger'
    if (game.homeGoals === game.awayGoals) return 'text-bg-warning'
  }

  const getAwayGoalColor = (game) => {
    if (game.played === false) return 'text-bg-light'
    if (game.homeGoals > game.awayGoals) return 'text-bg-danger'
    if (game.homeGoals < game.awayGoals) return 'text-bg-success'
    if (game.homeGoals === game.awayGoals) return 'text-bg-warning'
  }

</script>

<template>
  <div>
    <h1 class="mt-3">Matchschema</h1>
    <p class="mb-5"><p style="font-size: 12px;">Senast uppdaterad {{ matcherStore.lastUpdate }}</p></p>
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th class="col_match" scope="col">#</th>
            <th class="col_date" scope="col">Date</th>
            <th class="col_date d-none d-md-table-cell" scope="col">Time</th>
            <th class="col_group" scope="col">Group</th>
            <th class="col_team" scope="col">Home</th>
            <th class="col_dash" scope="col">-</th>
            <th class="col_team" scope="col">Away</th>
            <th class="col_place d-none d-lg-table-cell" scope="col">Place</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in matcherStore.games">
            <th scope="row">{{ game.id }}</th>
            <td><span class="d-none d-xl-inline">{{ game.weekday }}&nbsp;</span><span>{{ game.date }}</span></td>
            <td class="d-none d-md-table-cell">{{ game.time }}</td>
            <td>{{ game.group }}</td>
            <td>
              <div class="d-flex align-items-center">
                <span class="flex-grow-1 text-center d-inline-block text-truncate team">{{ game.home }}</span>
                <span class="d-inline-flex align-items-center justify-content-center
           rounded-circle results_ball" :class="getHomeGoalColor(game)" >{{ game.homeGoals }}</span>
              </div>
            </td>
            <td>-</td>
            <td>
              <div class="d-flex align-items-center">
                <span class="flex-grow-1 text-center d-inline-block text-truncate team">{{game.away}}</span>
                <span class="d-inline-flex align-items-center justify-content-center
           rounded-circle results_ball" :class="getAwayGoalColor(game)">{{ game.awayGoals }}</span>
              </div>
            </td>
            <td class="d-none d-lg-table-cell">{{ game.place }}</td>
          </tr>
        </tbody>
      </table> 
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