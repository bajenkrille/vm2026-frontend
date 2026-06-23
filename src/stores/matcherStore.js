import { defineStore } from 'pinia'
import { ref } from "vue";
import { useDeltagareStore } from './deltagareStore';
import { useTipsStore } from './tipsStore';

export const useMatcherStore = defineStore('matcher', {
  state: () => {
    return {
      games: [
        // {
        //   id: 1,
        //   weekday: 'Mon ',
        //   date: '24/6',
        //   time: '14.00',
        //   group: 'A',
        //   home: 'Bosnien-Hercegovina',
        //   homeGoals: 0,
        //   away: 'Nederländerna',
        //   awayGoals: 0,
        //   place: 'Mdonna di Campiglio',
        //   played: false,
        // }
      ],
      dagens: [],
      lastUpdate: null
    }
  },
  actions: {
    async getMatchSchedule(){
      try {
        const response = await fetch("/api/matcher");
        const data = await response.json();
        this.games = data
        console.log(data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    },
    async getTodaysGames(){
      try {
        const response = await fetch("/api/matcher/today");
        const data = await response.json();
        this.dagens = data
        console.log(data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    },
    async getLastUpdate(){
      try {
        const response = await fetch("/api/matcher/update");
        const data = await response.json();
        this.lastUpdate = data
          .replace('T', ' ')
          .replace('.000Z', '')
        console.log("Last update: ",this.lastUpdate);
      } catch (error) {
        console.error("Request failed:", error);
      }
    },
    async setResults(results){
      try {
        const response = await fetch("/api/matcher", {
          method: "POST",
          headers: {
           "Content-Type": "application/json"
          },
          body: JSON.stringify(results)
        });
        const data = await response.json();
        console.log("Lagrade resultat: ",data);
      } catch (error) {
        console.error("Request failed:", error);
      }  
    },
    async calculateTotalPoints(pointsPerUser){
      const tipsStore = useTipsStore()
      const deltagareStore = useDeltagareStore()
      // const pointsPerUser = ref([])
      await tipsStore.getAndStorePoints()

      const points = tipsStore.pointsArray
      console.log("Pointsssss: ",points);
      const deltagare = deltagareStore.deltagare
      console.log("Deltagare: ",deltagare);
      points.forEach(obj => {
        // console.log("obj: ",obj);
        if (!pointsPerUser.value.some(i => i.userId === obj.deltagareId)){
          const deltagaren = deltagare.find(d => d.id === obj.deltagareId)
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
      tipsStore.stallning = pointsPerUser.value
      console.log("matcherStore - tipsStore.stallning: ",tipsStore.stallning);
    }
  }
})
