<script setup>
  import {ref} from 'vue'
  import { onMounted } from 'vue';
  import { useTipsStore } from '@/stores/tipsStore'
  import { useMatcherStore } from '@/stores/matcherStore'
  import ConfirmModal from '@/components/ConfirmModal.vue'

  const formreference = ref(null)
  const showIncompleteModal = ref(false)
  const tipsStore = useTipsStore()
  const matcherStore = useMatcherStore()
  const readTips = (match, index) => {
    if (!Array.isArray(tipsStore.tips)) {
      return ''
    }

    const savedMatch = tipsStore.tips.find(
      (item) => Number(item.matchId) === Number(match)
    )
    if (savedMatch){
      // console.log("Den finns",match,"Sparad: ",savedMatch.tips[index], typeof savedMatch.tips[index]);
      return savedMatch.tips[index]
    }
    console.log("Match: ",match,"Sparad: ",savedMatch);
    return ''  
  }

  onMounted(() => {
    matcherStore.getMatchSchedule()
    tipsStore.getTips()
  })

  const onSubmit = () => {
    console.log("SUBMITTED");
    const numberOfIncompleteGames = tipsStore.checkTipsComplete().length
    console.log("Tips: ", tipsStore.tips);
    console.log("numberOfIncompleteGames: ",numberOfIncompleteGames);
    const hasIncompleteTips = numberOfIncompleteGames !== 0 ? true : false// replace with your real check
    console.log("hasIncompleteTips:", hasIncompleteTips);
    if (hasIncompleteTips) {
      showIncompleteModal.value = true
      return
    }
    tipsStore.sendTips()
    console.log("Heja Bajen ");
  }

  const saveDraft = async () => {
    // save partial tips here
    await tipsStore.sendTips()     
    showIncompleteModal.value = false
  }

</script>

<template>
  <div>
    <h1>Gabbagabbahey</h1>
    <ConfirmModal
            v-if="showIncompleteModal"
            title="Incomplete tips"
            message="Some matches are not fully tipped."
            confirmText="Save and continue later"
            cancelText="Continue editing"
            @confirm="saveDraft"
            @cancel="showIncompleteModal = false"
          />
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
                  <input class="form-control tipsruta me-1" 
                    :value="readTips(game.id, 0)"
                    @input="tipsStore.setTip(game.id, 0, $event.target.value)"
                  >
                  <!-- <input type="hidden" :name="`bets[${game.id - 1}][${ game.id }]`"> -->
                  <!-- <input class="form-control tipsruta me-1" :name="`bets[${ game.id - 1}][tips][]`" maxlength="2" placeholder="H">     -->
                </span>
                <span>
                  <!-- <input class="form-control tipsruta" :name="`bets[${ game.id - 1}][tips][]`" maxlength="2" placeholder="A">     -->
                  <input class="form-control tipsruta" 
                    :value="readTips(game.id, 1)"
                    @input="tipsStore.setTip(game.id, 1, $event.target.value)"
                  >
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