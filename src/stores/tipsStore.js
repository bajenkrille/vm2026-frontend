import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = "tips-draft";

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
        //   homeGoals: 0,
        //   away: 'Nederländerna',
        //   awayGoals: 0,
        //   place: 'Mdonna di Campiglio',
        //   played: false,
        // }
      ],
      tips: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]")
    }
  },
  actions: {
    setTip(matchId, index, value) {
      const id = String(matchId);
    
      if (!this.tips.find(game => game.matchId === id)) {
        this.tips.push({matchId: id, tips: ['','']})
      }

      const match = this.tips.find(game => game.matchId === id)
      match.tips[index] = value
    
      // this.tips[id][tipIndex] = value;
      console.log("Sparat tips: ",match.tips[index]);
    
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tips));
    },
    clearDraft() {
      this.tips = {};
      localStorage.removeItem(STORAGE_KEY);
    },
    async sendTips(){
      console.log("Sendtips!!!!!!");
      const filteredTips = this.tips.filter((item) => {
        return item.tips[0] !== '' && item.tips[1] !== ''
      })
      filteredTips.sort((a ,b) => a.matchId - b.matchId)
      console.log(
        filteredTips.map(item => item.matchId)
      )
      const response = await fetch("http://localhost:3000/api/tippa", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(filteredTips)
      });
    
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to save tips");
      }

      console.log(data);
      this.clearDraft();

    },
    async getTips(){
      const response = await fetch("http://localhost:3000/api/tippa", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json"        }
      });
      const data = await response.json();
      this.tips = data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tips));
      console.log("getTips: ",data);
    }
  }
})
