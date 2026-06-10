import { defineStore } from 'pinia'

const STORAGE_KEY = "tips-draft";
const ANTAL_MATCHER = 72

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
      tips: JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"),
      tipsMap: {},
      points: {}
    }
  },
  actions: {
    setTip(matchId, index, value) {
      console.log(typeof matchId, typeof value);
      const id = matchId;
    
      if (!this.tips.find(game => game.matchId === id)) {
        this.tips.push({matchId: id, tips: ['','']})
      }

      const match = this.tips.find(game => game.matchId === id)
      match.tips[index] = value
    
      // this.tips[id][tipIndex] = value;
      console.log("Sparat tips: ",match.tips[index]);
      console.log("VALUE:", value);
console.log("TYPE:", typeof value);
    
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tips));
    },
    clearDraft() {
      this.tips = {};
      localStorage.removeItem(STORAGE_KEY);
    },
    checkTipsComplete(){
      const incompleteMatches = []
      for (let i = 1; i <= ANTAL_MATCHER; i++) {
        const match = this.tips.find(
          item => Number(item.matchId) === i
        )
        if (
          !match ||
          match.tips[0] === '' ||
          match.tips[1] === '' ||
          match.tips[0] == null ||
          match.tips[1] == null
        ) {
          incompleteMatches.push(i)
        }
      }
      console.log("INCOMPLETE: ",incompleteMatches);
      return incompleteMatches
    },
    generateTipsMap(tips){
      const map = {}
      for (const tip of tips) {
        if (!map[tip.deltagareId]) {
          map[tip.deltagareId] = {}
        }
        map[tip.deltagareId][tip.matchId] = tip.tips
      }
      return map
    },
    generatePointsMap(pointsArray){
      const map = {}
      for (const p of pointsArray) {
        if (!map[p.deltagareId]) {
          map[p.deltagareId] = {}
        }
        map[p.deltagareId][p.matchId] = p.points
      }
      return map
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
      const response = await fetch("/api/tippa", {
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
      const response = await fetch("/api/tippa", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json"        }
      });
      const data = await response.json();
      const dataStr = data.map(item => ({
        matchId: item.matchId,
        tips: [
          String(item.tips[0]),
          String(item.tips[1])
        ]
      }));
      this.tips = dataStr
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.tips));
      console.log("getTips: ",data);
    },
    async getAllTips(){
      const response = await fetch("/api/tippa/allatips", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          Accept: "application/json"        }
      });
      const data = await response.json();
      console.log("tipsStore: ",data);

      const dataStr = data.map(item => ({
        deltagareId: item.deltagareId,
        matchId: item.matchId,
        tips: [
          String(item.tips[0]),
          String(item.tips[1])
        ]
      }));
      this.tipsMap = this.generateTipsMap(dataStr)
    },
    async getAndStorePoints(){
      
      const response = await fetch("/api/tippa/points");
      const data = await response.json();
      console.log("getAndStorePoints: ",data);
      this.points = this.generatePointsMap(data)
    }
  }
})
