import { defineStore } from 'pinia'

export const useDeltagareStore = defineStore('deltagare', {
  state: () => {
    return {
      deltagare: [
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
    async getDeltagareAndCompleteness(){
      try {
        const response = await fetch("/api/deltagare/tippat");
        const data = await response.json();
        this.deltagare = data
        console.log(data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    }
  }
})
