import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useTipsStore = defineStore('tips', {
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
        //   away: 'Nederländerna',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 1,
        //   tipsAwayId: 2,
        // },
        // {
        //   id: 2,
        //   weekday: 'Mon ',
        //   date: '24/6',
        //   time: '14.00',
        //   group: 'A',
        //   home: 'Argentina',
        //   away: 'Brasilien',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 3,
        //   tipsAwayId: 4,
        // },
        // {
        //   id: 3,
        //   weekday: 'Tue ',
        //   date: '25/6',
        //   time: '14.00',
        //   group: 'B',
        //   home: 'Sverige',
        //   away: 'Turkmenistan',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 5,
        //   tipsAwayId: 6,
        // },
        // {
        //   id: 4,
        //   weekday: 'Tue ',
        //   date: '25/6',
        //   time: '14.00',
        //   group: 'B',
        //   home: 'Kanada',
        //   away: 'Senegal',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 7,
        //   tipsAwayId: 8,
        // },
        // {
        //   id: 5,
        //   weekday: 'Wed ',
        //   date: '26/6',
        //   time: '14.00',
        //   group: 'C',
        //   home: 'Franska Guyana',
        //   away: 'Tyskland',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 9,
        //   tipsAwayId: 10,
        // },
        // {
        //   id: 6,
        //   weekday: 'Wed ',
        //   date: '26/6',
        //   time: '14.00',
        //   group: 'C',
        //   home: 'Frankrike',
        //   away: 'Spanien',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 11,
        //   tipsAwayId: 12,
        // },
        // {
        //   id: 7,
        //   weekday: 'Thu ',
        //   date: '27/6',
        //   time: '14.00',
        //   group: 'D',
        //   home: 'Danmark',
        //   away: 'USA',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 13,
        //   tipsAwayId: 14,
        // },
        // {
        //   id: 8,
        //   weekday: 'Thu ',
        //   date: '27/6',
        //   time: '14.00',
        //   group: 'D',
        //   home: 'Iran',
        //   away: 'Israel',
        //   place: 'Mdonna di Campiglio',
        //   tipsHomeId: 15,
        //   tipsAwayId: 16,
        // },
      ]
    }
  },
  actions: {
    async getMatchSchedule(){
      try {
        const response = await fetch("http://localhost:3000/matcher");
        const data = await response.json();
        this.games = 
        console.log(data.message);
      } catch (error) {
        console.error("Request failed:", error);
      }
    
    },
    async sendTips(resultJson){
      console.log("Sendtips!!!!!!");
      const response = await fetch("http://localhost:3000/api/tippa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(resultJson)
      });
    
      const data = await response.json();
      console.log(data);

    }
  }
})
