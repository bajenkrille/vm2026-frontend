<script setup>
  import {ref} from 'vue'
  import { useTipsStore } from '@/stores/tipsStore'
  import { useMatcherStore } from '@/stores/matcherStore'

  const tipsStore = useTipsStore()
  const matcherStore = useMatcherStore()
  const formreference = ref(null)

  const onSubmit = () => {
    console.log("SUBMITTED");
    const tipsJson = buildJson()
    tipsStore.sendTips(tipsJson)
    console.log("Heja Bajen ");
  }


  const buildJson = () => {
    const fd = new FormData(formreference.value);
    console.log("fd" + formreference.value)

    // We'll build: { bets: [ { matchId: "123", tips: ["..",".."] } ] }
    const result = { bets: [] };

    for (const [key, value] of fd.entries()) {
      // matchId:  bets[0][matchId]
      let m = key.match(/^bets\[(\d+)\]\[(\d+)\]$/);
      if (m) {
        const idx = Number(m[1]);
        result.bets[idx] ??= {};
        result.bets[idx].matchId = m[2];
        continue;
      }

      // tips: bets[0][tips][]
      m = key.match(/^bets\[(\d+)\]\[(tips)\]\[\]$/);
      if (m) {
        const idx = Number(m[1]);
        result.bets[idx] ??= {};
        result.bets[idx].tips ??= [];
        if (value !== "") result.bets[idx].tips.push(value);
        continue;
      }
    }

    // Remove any gaps if indices are missing
    result.bets = result.bets.filter(Boolean);

    console.log("JSON object:", result);
    console.log("JSON string:", JSON.stringify(result, null, 2));
    return result
  }

</script>

<template>
  <div>
    <h1>Gabbagabbahey</h1>
    <form ref="formreference" action="">
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th class="col_match" scope="col">#</th>
            <th class="col_date" scope="col">Date</th>
            <th class="col_group" scope="col">Group</th>
            <th class="col_team" scope="col">Home</th>
            <th class="col_dash" scope="col">-</th>
            <th class="col_team" scope="col">Away</th>
            <th class="col_tips" scope="col">Tips</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="game in matcherStore.games">
            <th scope="row">{{ game.id }}</th>
            <td><span class="d-none d-xl-inline">{{ game.weekday }}&nbsp</span><span>{{ game.date }}</span></td>
            <td class="col_group">{{ game.group }}</td>
            <td class="col_team"><span class="team d-inline-block text-truncate">{{ game.home }}</span></td>
            <td>-</td>
            <td class="col_team"><span class="team d-inline-block text-truncate">{{game.away}}</span></td>
            <td>
              <div class="d-flex">
                <span>
                <input type="hidden" :name="`bets[${game.id - 1}][${ game.id }]`">
                <input class="form-control tipsruta me-1" :name="`bets[${ game.id - 1}][tips][]`" maxlength="2" placeholder="H">    
              </span>
              <span>
                <input class="form-control tipsruta" :name="`bets[${ game.id - 1}][tips][]`" maxlength="2" placeholder="A">    
              </span>
              </div>
            </td>
          </tr>
        </tbody>
      </table> 
      <button @click.prevent="onSubmit" class="btn btn-success" type="submit">Skicka</button>
    </form>
  </div>
</template>

<style scoped>
  .tipsruta {
    width: 2.5rem;
    height: 2rem;
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
      width: 34%;
      text-align: center;
  }
  
  .col_tips {
      width: 9%;
  }
  
  .tipsruta {
    width: 2.5rem;
    height: 2rem;
  }
  
  .team {
    max-width: 170px;
  }
  
  @media (max-width: 768px) {
    .team {
      max-width: 100px;
    }
  }
  
  </style>