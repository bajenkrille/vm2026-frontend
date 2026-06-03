import { defineStore } from 'pinia'

export const useLoginStore = defineStore('login', {
  state: () => {
    return {}
  },
  actions: {
    async loginUser(credentials){
      console.log("Har reggat: ",credentials)
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      console.log(data);
      console.log(data.token);
      if (data.token){
        localStorage.setItem('token', data.token)
      }
      
      console.log("localStore ",localStorage.getItem("token"));  
      console.log("status: ",response.status);
      return {
        status: response.status,
        ok: response.ok,
        data
      }
    },
    async registerUser(credentials){
      console.log("Har reggat: ",credentials)
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      localStorage.setItem('token', data.token)
      console.log("localStore ",localStorage.getItem("token"));    
      console.log(data);
     
      return {
        status: response.status,
        ok: response.ok,
        data
      }
    },
    async resetPsw(credentials){
      console.log("Har reggat: ",credentials)
      const response = await fetch("/api/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      // localStorage.setItem('token', data.token)
      // console.log("localStore ",localStorage.getItem("token"));    
      console.log(data);
      console.log("response status: ",response.status);
     
      return {
        status: response.status,
        ok: response.ok,
        data
      }
    },
    async generateResetEmail(credentials){
      console.log("Har reggat: ",credentials)
      const response = await fetch("/api/resetEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(credentials)
      });
    
      const data = await response.json();
      // localStorage.setItem('token', data.token)
      // console.log("localStore ",localStorage.getItem("token"));    
      console.log(data);
     
      return {
        status: response.status,
        ok: response.ok,
        data
      }
    }
  }
})
 