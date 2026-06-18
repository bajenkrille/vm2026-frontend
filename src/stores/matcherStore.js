import { defineStore } from 'pinia'

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
      dagens: []
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
    
    }  }
})
