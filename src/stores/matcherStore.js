import { ref, computed } from 'vue'
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
      ]
    }
  },
  actions: {
    async getMatchSchedule(){
      try {
        const response = await fetch("http://localhost:3000/api/matcher");
        const data = await response.json();
        this.games = data
        console.log(data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    }
  }
})
