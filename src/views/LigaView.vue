<script setup>
  import { useDeltagareStore } from '@/stores/deltagareStore'
  import { useLigorStore } from '@/stores/ligorStore'
  import { useTipsStore } from '@/stores/tipsStore'
  import { useLoginStore } from '@/stores/loginStore'
  import { onMounted, ref, reactive, watch, computed } from 'vue';
  import OneOptionModal from "@/components/OneOptionModal.vue";

  const deltagareStore = useDeltagareStore()
  const ligorStore = useLigorStore()
  const tipsStore = useTipsStore()
  const loginStore = useLoginStore()
  const selected = ref([]);
  const activeTab = ref('home')
  let pointsPerUser = ref([])

  const valdLigaObj = computed(() =>
    ligorStore.ligor.find(l => l.id === valdLiga.value)
  )
  
  const valdLiga = ref('')
  // let ligaDeltagare = []
  watch(valdLiga, async (newLigaId) => {
    if (!newLigaId) return
    await ligorStore.getLigaDeltagare(newLigaId)
    pointsPerUser.value = []
    calculateTotalPoints(ligorStore.deltagare)
  })

  const validationErrors = ref(false);
  const validationMessage = ref("");

  const ligaAccessErrors = ref(false);
  const ligaAccessMessage = ref("");

  const ligaData = reactive({
    liganamn: "",
    beskrivning: "",
    valda: [],
    private: false,
    admin: false,
  });

  const calculateTotalPoints = (ligaDeltagare) => {

    const pointsAll = tipsStore.pointsArray
    const deltagareAll = deltagareStore.deltagare
    const inloggadUser = loginStore.userName
    const inloggadDeltagare = deltagareAll.find(d => d.nick_name === inloggadUser)
    console.log("Aktuell liga: ",valdLigaObj.value);
    if (valdLigaObj.value.private && !ligaDeltagare.find(n => n.deltagare_id === inloggadDeltagare.id)){
      console.log("deltagare_iddddd: ",inloggadDeltagare.id);
      ligaAccessMessage.value = "Du är inte medlem av ligan och har inte behörighet att se den.";
      ligaAccessErrors.value = true;
      return
    }
    console.log("Pointsssss: ",pointsAll);
    console.log("Deltagare: ",deltagareAll);
    console.log("ligaDeltagare: ",ligaDeltagare);
    const deltagare = deltagareAll.filter(d =>
      ligaDeltagare.some(m => m.deltagare_id === d.id)
    )
    const points = pointsAll.filter(p => 
      ligaDeltagare.some(m => m.deltagare_id === p.deltagareId)
    )
    console.log("deltagareeee: ",deltagare);
    points.forEach(obj => {
      if (!pointsPerUser.value.some(i => i.userId === obj.deltagareId)){
        const deltagaren = deltagare.find(d => d.id === obj.deltagareId)
        console.log("deltagaren: ",deltagaren);
        pointsPerUser.value.push({
          userId: obj.deltagareId,
          userName: deltagaren.nick_name,
          points: 0
        })
      }
      const item = pointsPerUser.value.find(i => i.userId === obj.deltagareId)
      item.points += obj.points
    })
    pointsPerUser.value.sort((a,b) => b.points - a.points)
    console.log("pointsPerUser: ",pointsPerUser.value); 
  }


  const onSubmit = async () => {
    ligaData.valda = selected.value
    console.log("selected: ",selected.value);
    console.log("vald: ",ligaData.valda);
    console.log("ligaData: ",ligaData);
    const result = await ligorStore.skapaLiga(ligaData)
    if (result.status === 200){
      selected.value = []
    }
    if (result.status === 409) {
      validationMessage.value = "Liganamnet är upptaget. Försök igen!";
      validationErrors.value = true;
    }
    if (result.status === 200) {
      validationMessage.value = "Din liga är skapad!";
      validationErrors.value = true;
      selected.value = []
    }
    if (result.status === 500) {
      validationMessage.value = "Något gick fel. Försök igen!";
      validationErrors.value = true;
    }

    // ligaData.private = ""
  }

  onMounted(async () => {
    await deltagareStore.getDeltagare()
    await tipsStore.getAndStorePoints()
    await ligorStore.getLigor()
  })
</script>

<template>
	<OneOptionModal
		v-if="validationErrors"
		title="Skapande av liga"
		:message="validationMessage"
		confirmText="Ok"
		@confirm="validationErrors = false"
	/>
	<OneOptionModal
		v-if="ligaAccessErrors"
		title="Ligatillhörighet"
		:message="ligaAccessMessage"
		confirmText="Ok"
		@confirm="ligaAccessErrors = false"
	/>
<div class="container">
  <h1 class="mt-3 mb-5">Ligor</h1>
  <ul class="nav nav-tabs">
    <li class="nav-item">
      <button
        class="nav-link"
        :class="{ active: activeTab === 'stallning' }"
        @click="activeTab = 'stallning'"
      >
        Ställning
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="{ active: activeTab === 'skapa' }"
        @click="activeTab = 'skapa'"
      >
        Skapa
      </button>
    </li>
    <li class="nav-item">
      <button
        class="nav-link"
        :class="{ active: activeTab === 'andra' }"
        @click="activeTab = 'andra'"
      >
        Ändra
      </button>
    </li>
  </ul>

  <div v-if="activeTab === 'stallning'">
    <div class="container mb-5">
      <!-- <h1 class="mt-3 mb-5">Ställning</h1> -->
      <div class="">
        <p class="mb-5"></p>
        <select class="form-select form-select-sm" style="width: 200px;" v-model="valdLiga">
          <option disabled value="">Välj liga</option>
          <option
            v-for="liga in ligorStore.ligor"
            :key="liga.id"
            :value="liga.id"
          >
          {{ liga.liga_name }}
          </option>
        </select>
        <p class="mb-5"></p>
      </div>

      <div v-if="valdLiga">
        <h3>{{ valdLigaObj?.liga_name }}</h3>
        <p>{{ valdLigaObj?.description }}</p>
        <div class="row">
          <div class="col-1 bg-light border"><b>Plats</b></div>
          <div class="col-4 bg-light border"><b>Användarnamn</b></div>
          <div class="col-1 bg-light border"><b>Poäng</b></div>
        </div>
        <div class="row" v-for="(user, index) in pointsPerUser" :key="user.userId">
          <div class="col-1 bg-light border">{{ index === 0 || user.points !== pointsPerUser[index - 1].points ? index + 1 : ''}}</div>
          <div class="col-4 bg-light border">{{ user.userName }}</div>
          <div class="col-1 bg-light border">{{ user.points }}</div>
          <!-- <div class="col-1 border" :class="deltagaren.antal_tips === 72 ? 'bg-success' : 'bg-light'">{{deltagaren.antal_tips}}</div> -->
        </div>
      </div>
    </div>
  </div>

  <div v-if="activeTab === 'skapa'">

    <div class="card mt-5" style="width: 36rem;">
  <!-- <img src="..." class="card-img-top" alt="..."> -->
      <div class="card-body">
        <h5 class="card-title">Skapa en liga</h5>
        <p class="card-text">Här kan du skapa en liga med vilken gruppering du önskar. Danslaget, growl-kören, Väring-fans, stora tjocka släkten, din swingersklubb etc etc.</p>
        <p class="card-text">Om det är din swingersklubb vill du kanske inte att alla ska se vilka som är med och då kan du välja att den ska vara privat. 
          Om den är privat så kan bara de som är med i ligan se den (förutom allas eran superuser, men jag skvallrar inte).
          Jag tycker dock att det kanske blir roligare om vi försöker hålla ligorna publika (inte minst swingersklubben), men ni avgör själva.</p>
          <p class="card-text">Om du inte redan förstått det så är ligorna tänkta för att ni ska kunna ha er egna interna tävlingar. 
          Så, välj ett namn, beskriv ligan kort, välj deltagare genom att klicka i rutorna och tryck på Skapa.
        </p>
        <p class="card-text">Du kan också välja om du som skapar ligan vill vara administratör med ensamrätt att ändra ligan, tex lägga till fler deltagare. 
          Utan admin så kan alla som är med i ligan ändra, men inga andra.
        </p>
        <!-- <a href="#" class="btn btn-primary">Go somewhere</a> -->
      </div>
    </div>

    <form @submit.prevent="onSubmit" class="g-3 mt-5">
      <div class="mb-3">
        <label for="exampleFormControlInput1" class="form-label">Ligans namn</label>
        <input type="text" class="form-control" id="liganamn" v-model="ligaData.liganamn" placeholder="">
      </div>
      <div class="mb-3">
        <label for="exampleFormControlTextarea1" class="form-label">Kort beskrivning av ligan</label>
        <textarea class="form-control" id="ligabeskrivning" v-model="ligaData.beskrivning" rows="3" placeholder="Ex: Vi som växte upp i en kartong..."></textarea>
      </div>
      <div class="">
        <input type="checkbox" class="form-check-input" v-model="ligaData.private" :value="true">
        <label class="form-check-label ms-2 mb-2">
            Ligan ska vara privat
        </label>
      </div>
      <div class="">
        <input type="checkbox" class="form-check-input" v-model="ligaData.admin" :value="true">
        <label class="form-check-label ms-2 mb-2">
            Jag vill vara administratör
        </label>
      </div>

      <button type="submit" class="btn btn-primary mb-2 mt-3">
        Skapa
      </button>
                  
      <div class="row">
        <div class="col-3 bg-light border"><b>Användarnamn</b></div>
        <div class="col-6 bg-light border"><b>För- och efternamn</b></div>
        <div class="col-1 bg-light border"><b>Välj</b></div>
      </div>
      <div class="row" v-for="deltagaren in deltagareStore.deltagare" :key="deltagaren.user">
        <div class="col-3 bg-light border">{{ deltagaren.nick_name }}</div>
        <div class="col-6 bg-light border">{{ deltagaren.first_name }}&nbsp;{{ deltagaren.last_name }}</div>
        <div class="col-1 bg-light border"><input type="checkbox" class="form-check-input" v-model="selected" :value="deltagaren.id"></div>
      </div>
      <button type="submit" class="btn btn-primary mt-2">
        Skapa
      </button>
    </form>
  </div>

  <div v-if="activeTab === 'andra'">
    Inget här än. Kommer snart.
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