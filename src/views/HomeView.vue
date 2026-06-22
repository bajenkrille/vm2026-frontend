<script setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import router from "@/router"
  import TwoOptionModal from "@/components/TwoOptionModal.vue"
  import { useMatcherStore } from '@/stores/matcherStore'
  import { useTipsStore } from '@/stores/tipsStore'
  import { useDeltagareStore } from "@/stores/deltagareStore"
  import { useLigorStore } from "@/stores/ligorStore"

  const matcherStore = useMatcherStore()
  const tipsStore = useTipsStore()
  const deltagareStore = useDeltagareStore()
  const ligorStore = useLigorStore()

  const hovered = ref(null)
  const showPersonal = ref(false)

  const loggedIn = () => {
    showPersonal.value = localStorage.getItem("userName") !== null ? true : false
  }

  const showRules1 = ref(false)
  const showRules2 = ref(false)
  const showRules3 = ref(false)
  const rulesMsg = ref("");

  const rulesPage1 = `
  Resultat i alla matcher ska tippas!
  Det finns möjlighet att spara ofullständigt tips (för att fortsätta senare), men ofullständigt tips ger 0 poäng efter D-Day.
  Möjligheten att tippa eller ändra sitt tips upphör vid utsatt avsparkstid i första matchen, vilket är 11/6 kl. 21.00.

  Rätt resultat ger 2 eller 3 poäng (se senare förklaring).
  Rätt tecken, dvs hemma- eller bortavinst eller oavgjort, ger 1 poäng.
  Flest poäng efter 72 matcher vinner.
  Vid lika poäng räknas först flest 3-poängare, därefter flest rätt resultat (2- och 3-poängare) 
  och om det fortfarande är lika, flest poänggivande matcher (1-, 2- och 3-poängare).

  Hela insatspotten (minst) går tillbaka som vinst.

  75% av vinstpotten går till 1:an.
  20% av vinstpotten går till 2:an.
  5% av vinstpotten går till 3:an.
  `

  const rulesPage2 = `
  Rätt resultat med fler än 3 gjorda mål premieras och ger totalt 3 poäng.
  Rätt resultat med 3 eller färre gjorda mål ger totalt 2 poäng.
  Rätt tecken, oavsett antal gjorda mål, ger 1 poäng.

  Exempel:
  Bajen - Barcelona slutar 7-0
  Kenta har tippat 7-0 och får 3 poäng.
  Stina har tippat 5-0 och får 1 poäng.
  Gustav von Platen har tippat 0-6 och får 0 poäng.

  Djurgården - Sveg slutar 2-2
  Stina har tippat 2-2 och får 3 poäng.
  Kenta har tippat 7-7 och får 1 poäng.
  Gustav von Platen har tippat 7-0 och får 0 poäng.

  Gnaget - Änglarna slutar 0-0
  Stina har tippat 0-0 och får 2 poäng.
  Gustav von Platen har tippat 0-0 och får också 2 poäng fast han är Djurgårdare.
  Kenta har tippat 7-7 och får 1 poäng.

  Bajen - PSG slutar 2-1
  Stina har tippat 2-1 och får 2 poäng.
  Kenta har tippat 7-0 och får 1 poäng.
  Gustav von Platen har tippat 0-7 och får 0 poäng.
  `

  const rulesPage3 = `
  Insatsen är 100 kr.

  Hela insatspotten (minst) går tillbaka som vinst.

  75% av vinstpotten går till 1:an.
  20% av vinstpotten går till 2:an.
  5% av vinstpotten går till 3:an.

  Avgiften swishas till det nummer som följer med bekräftelsemail efter första inlämnade/sparade tips.
  I princip ska avgiften betalas innan VM:s första match börjar. 
  Det är inte 100% strikt, men vid underlåtelse att betala, trots påminnelser utesluts deltagaren (har aldrig hänt).

  Det är inte bara tillåtet, utan det uppmuntras, att bjuda in kompisar, familj, husdjur, ovänner mfl!

  PS. Det är inte gratis att anordna detta spektakel. Vill någon lägga på 5-10 kr som bidrag så är det välkommet.
  Om "bidragssumman" överstiger den bedömda kostnaden går den överstigande delen till prispotten.
  `

  const openRules = () => {
    rulesMsg.value = rulesPage1
    showRules1.value = true
  }

  const openRules2 = () => {
    rulesMsg.value = rulesPage2
    showRules1.value = false
    showRules2.value = true
  }

  const openRules3 = () => {
    rulesMsg.value = rulesPage3
    showRules2.value = false
    showRules3.value = true
  }

  const continueToRegister = () => {
    showRules1.value = false
    showRules2.value = false
    showRules3.value = false
    router.replace("/register");
  }

  const valdLiga = ref('')
  const valdaDeltagare = ref([])

  const getMyUserId = () => {
    const myUserName = localStorage.getItem("userName")
    return deltagareStore.deltagare.find(d => d.nick_name === myUserName).id
  }
  
  watch(valdLiga, async (newLigaId) => {
    if (!newLigaId) return
    console.log("JAG ÄR HÄÄÄÄÄR!! ", valdLiga.value);
    if (valdLiga.value === "Mitt tips"){
      const myUserId = getMyUserId()
      console.log("myUserId: ", myUserId);
      valdaDeltagare.value = []
      valdaDeltagare.value.push(deltagareStore.deltagare.find(d => d.id === myUserId))
      console.log("valdaDeltagare: ",valdaDeltagare.value);
    } else if (valdLiga.value === "Närmaste 10 konkurrenter")
    {
      const stallning = tipsStore.stallning
      console.log("Stallning: ",stallning);
      const myUserId = getMyUserId()
      console.log("myUserId: ",myUserId);
      const placering = stallning.findIndex(item => item.userId === myUserId)
      console.log("Placering: ",placering);
      const startIndex = placering - 4 >= 0 ? placering - 4 : 0
      const addToEndIndex = placering - startIndex
      const endIndex = placering + 5 + addToEndIndex < stallning.length ? placering + 5 + addToEndIndex : stallning.length
      const narmaste = stallning.slice(startIndex, endIndex)
      console.log("Narmaste: ", startIndex, endIndex, narmaste);
      const deltagareIds = narmaste.map(d => d.userId)
      console.log("deltagareIds: ",deltagareIds);
      valdaDeltagare.value = deltagareIds.map(id => deltagareStore.deltagare.find(d => d.id === id)
)    } else {
      const ligaId = nameIdArray.find(l => l.name === valdLiga.value).id
      await ligorStore.getLigaDeltagare(ligaId)
      const deltagareIds = ligorStore.deltagare.filter(d => d.liga_id === ligaId).map(d => d.deltagare_id)
      valdaDeltagare.value = deltagareStore.deltagare.filter(d => deltagareIds.includes(d.id))
      console.log("valdaDeltagare: ",valdaDeltagare.value);
    }
  })

  const deltagarensTips = (x) => {
    const tipset = tipsStore.tips.find(t => t.matchId === x)
    console.log("tipset: ",tipsStore.tips);
    return `${tipset.tips[0]} - ${tipset.tips[1]}`
  }


  const alternativArray = ref([])
  const nameIdArray = []
  const skapaAlternativArray = () => {
    alternativArray.value = ["Mitt tips", "Närmaste 10 konkurrenter"]
    ligorStore.minaLigor.forEach((ml) => {
      // console.log("ml: ",ml);
      const liga = ligorStore.ligor.find(al => 
        // console.log("idn: ",ml.liga_id, al.id,
        // "equal?", ml.liga_id === al.id);
        al.id === ml.liga_id
      )
      alternativArray.value.push(liga.liga_name)
      nameIdArray.push({id: liga.id, name: liga.liga_name })
    })
    console.log("alternativArray: ",alternativArray);
    console.log("nameIdArray", nameIdArray);
  }
  const deltagarSida = ref(0)
  const deltagarePerSida = ref('15')

  onMounted(async () => {
    await matcherStore.getTodaysGames()
    await tipsStore.getAllTips()
    await deltagareStore.getDeltagare()
    await ligorStore.getLigor()
    await ligorStore.getMinaLigor()
    console.log("Home - mina ligor: ",ligorStore.minaLigor);
    matcherStore.calculateTotalPoints(ref([]))
    skapaAlternativArray()
    loggedIn()
  })

</script>

<template>
  <main class="modal-message">
    <TwoOptionModal
      v-if="showRules1"
      title="Regler"
      :message="rulesMsg"
      confirmText="Nästa"
      cancelText="Registrera"
      @confirm="openRules2"
      @cancel="continueToRegister"
    />

    <TwoOptionModal
      v-if="showRules2"
      title="Regler"
      :message="rulesMsg"
      confirmText="Nästa"
      cancelText="Registrera"
      @confirm="openRules3"
      @cancel="continueToRegister"
    />

    <TwoOptionModal
      v-if="showRules3"
      title="Regler"
      :message="rulesMsg"
      confirmText="Registrera"
      cancelText="Stäng"
      @confirm="continueToRegister"
      @cancel="showRules3 = false"
    />

    <h1 class="mt-3">Välkommen!</h1>
    <h3>The One and Only VM-tips 2026 är här!</h3>
    <p>Klicka nedan för att läsa reglerna. Notera gärna att det finns en Tipsguide i menyn.</p>
    <p>Om du loggar in kan du se dina pch andra valda tips för dagens och nattens matcher.</p>
    <div class="modal-message mb-5">
      <button @click="openRules" type="button" class="btn btn-dark">Regler</button>
    </div>
    <div v-if="showPersonal">
      <h5>Välj de tips du vill se för dagens och nattens matcher</h5>
      <div class="">
        <p class="mb-3"></p>
        <select class="form-select form-select-sm" style="width: 250px;" v-model="valdLiga">
          <option disabled value="">Välj alternativ</option>
          <option
            v-for="liga in alternativArray"
            :key="liga"
            :value="liga"
          >
          {{ liga }}
          </option>
        </select>
        <p class="mb-5"></p>
      </div>

      <!-- <div class="row">
        <div class="col-1 bg-light border"><b>Match#</b></div>
        <div class="col-4 bg-light border"><b>Lagen</b></div>
        <div class="col-2 bg-light border"><b>Ditt tips</b></div>
      </div>
      <div class="row" v-for="matchen in matcherStore.dagens" :key="matchen.id">
        <div class="col-1 bg-light border">{{ matchen.id }}</div>
        <div class="col-4 bg-light border">{{ matchen.home }}&nbsp;-&nbsp;{{ matchen.away }}</div>
        <div class="col-2 bg-light border">{{ deltagarensTips(matchen.id)}}</div>
      </div> -->
    </div>
    <table class="table table-success table-hover tips-table">
			<thead>
				<tr>
					<th class="col_match" scope="col">#</th>
					<th class="col_team" scope="col">Match</th>
 					<th v-for="deltagare in valdaDeltagare" :key="deltagare.id" class="col_tips" scope="col">
						<span class="username-wrapper" @mouseenter="hovered = deltagare.nick_name" @mouseleave="hovered = null">
							<span class="username-cell">{{ deltagare.nick_name }}</span>
							<span v-if="hovered === deltagare.nick_name" class="custom-tooltip">
								{{ deltagare.nick_name }}
							</span>
						</span>
					</th>
				</tr>
			</thead>
			<tbody>
				<tr v-for="game in matcherStore.dagens" :key="game.id">
					<th class="" scope="row">{{ game.id }}</th>
					<td>
						<div class=" d-flex align-items-left">
							<span class="flex-grow-1d-inline-block text-truncate team">{{ game.home }}</span>
              <span>&nbsp;-&nbsp;</span>
							<span class="flex-grow-1 d-inline-block text-truncate team">{{game.away}}</span>
						</div>
					</td>
 					<td v-for="usr in valdaDeltagare" :key="usr.id">
						<div class="d-flex">
							<!-- <span>{{ deltagarensTips(game.id)}}</span> -->
							<span>{{ tipsStore.tipsMap[usr.id]?.[game.id]?.join('-') ?? '' }}</span>
							<!-- <span class="rounded-circle points_ball">
							</span> -->
							<!-- <span class="rounded-circle points_ball"  :class="getPointsColor(tipsStore.pointsMap[usr.id]?.[game.id] ?? '')">
							</span> -->
						</div>
					</td>
				</tr>
			</tbody>
		</table>

  </main>
</template>

<style scoped>
  .modal-message {
    white-space: pre-line;
  }
  .results_ball {
    height: 25px;
    width: 25px;
    font-size: large;
  }
  .points_ball {
    height: 10px;
    width: 10px;
    font-size: large;
  }
    
  .tips-table {
    white-space: nowrap;
    table-layout: fixed;
    width: 100%;
  }

  .sticky-col {
    position: sticky;
    z-index: 2;
  }

  .tipsruta {
    width: 2.5rem;
    height: 2rem;
  }

  .col_match {
    width: 25px;
  }

  .col_date {
    width: 15px;
  }
  /* 
  .col_group {
    width: 8%;
    text-align: center;
  } */

  .col_dash {
    width: 2px;
  }

  .col_team {
    width: 150px;
    text-align: left;
  }

  .col_tips {
    width: 100px;
  }

  .username-wrapper {
    position: relative;
    display: inline-block;
  }

  .username-cell {
    max-width: 70px;      /* choose what fits */
    display: inline-block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: bottom;
  }

  .custom-tooltip {
    position: absolute;
    top: 100%;
    left: 0;
    padding: 6px 10px;
    background: #333;
    color: white;
    font-size: 1rem;
    white-space: nowrap;
    z-index: 1000;
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
