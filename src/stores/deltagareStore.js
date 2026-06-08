import { defineStore } from 'pinia'

export const useDeltagareStore = defineStore('deltagare', {
  state: () => {
    return {
      deltagare: [],
      deltagareStatus: [
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
    async getDeltagare(){
      try {
        const response = await fetch("/api/deltagare");
        const data = await response.json();
        this.deltagare = data
        console.log("I deltagareStore: ",this.deltagare);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    },
    async getDeltagareAndCompleteness(){
      try {
        const response = await fetch("/api/deltagare/tippat");
        const data = await response.json();
        this.deltagareStatus = data
        console.log(data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    },
    async setBetalning(deltagareId){
      try {
        console.log("deltagareId", deltagareId);
        const response = await fetch("/api/deltagare/betalning", {
          method: "POST",
          headers: {
           "Content-Type": "application/json"
          },
          body: JSON.stringify(deltagareId)
        });
        const data = await response.json();
        console.log("Betalning set: ",data);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    }    
  }
})
