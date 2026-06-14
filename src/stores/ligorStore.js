import { defineStore } from 'pinia'

export const useLigorStore = defineStore('ligor', {
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
      ],
      ligor: []
    }
  },
  actions: {
    async getLigaDeltagare(liga){
      try {
        const response = await fetch(`/api/ligor/deltagare?ligaId=${liga}`)
        const data = await response.json();
        this.deltagare = data
        console.log("I deltagareStore: ",this.deltagare);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    },
    async getLigor(){
      try {
        const response = await fetch("/api/ligor");
        const data = await response.json();
        console.log(data);
        this.ligor = data
      } catch (error) {
        console.error("Request failed:", error);
      }    
    },
    async skapaLiga(ligaData){
      try {
        console.log("ligaData i store: ", ligaData);
        const response = await fetch("/api/ligor", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(ligaData)
        });
        const data = await response.json();
        console.log("Liga registrerad: ",data);
        console.log("Status: ",response.status);
        return {
          status: response.status,
          ok: response.ok,
          data
        }
      } catch (error) {
        console.error("Request failed:", error);
      }
    }    
  }
})
