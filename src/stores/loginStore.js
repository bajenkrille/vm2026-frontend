import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => {
    return {}
  },
  actions: {
    async loginUser(credentials){
      console.log("Har reggat: ",credentials)
      // fetch('http://localhost:3000/login')
      // .then(res => res.text())
      // .then(data => console.log(data))
      // .catch(err => console.error(err))
      const response = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      console.log(data);
      console.log(data.token);
      localStorage.setItem('token', data.token)
      console.log("localStore ",localStorage.getItem("token"));    
    },
    async registerUser(credentials){
      console.log("Har reggat: ",credentials)
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      // console.log(data);
    }
  }
})
