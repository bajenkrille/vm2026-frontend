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
      ligor: [],
      minaLigor: []
    }
  },
  actions: {
    async getLigaDeltagare(liga){
      try {
        const response = await fetch(`/api/ligor/deltagare?ligaId=${liga}`)
        const data = await response.json();
        this.deltagare = data
        console.log("Ligadeltagare: ",this.deltagare);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    },
    async getLigor(){
      try {
        const response = await fetch("/api/ligor");
        const data = await response.json();
        console.log("Ligor: ",data);
        this.ligor = data
      } catch (error) {
        console.error("Request failed:", error);
      }    
    },
    async getMinaLigor(){
      try {
        const response = await fetch("/api/ligor/minaLigor", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            Accept: "application/json"        }
        });
        const data = await response.json();
        console.log("Mina ligor: ",data);
        this.minaLigor = data
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
