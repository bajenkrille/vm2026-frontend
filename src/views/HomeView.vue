<script setup>
  import { ref } from 'vue'
  import router from "@/router"
  import TwoOptionModal from "@/components/TwoOptionModal.vue"

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
  Vid lika poäng räknas först flest 3-poängare, därefter flest rätt resultat (2- och 3-poängare) 
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
    <p>Klicka nedan för att läsa reglerna och registrera dig för 2026 års kanske största evenemang.</p>
    <p>Notera gärna att det finns en Tipsguide i menyn som kan hjälpa (eller stjälpa) med att få reda i lagdjungeln.</p>
    <div class="modal-message">
      <button @click="openRules" type="button" class="btn btn-dark">Regler</button>
    </div>
  </main>
</template>

<style scoped>
  .modal-message {
    white-space: pre-line;
  }
</style>
