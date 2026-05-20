import { defineStore } from "pinia";

// stores/wallet.ts
export const useWalletStore = defineStore('wallet', {
  // state 就像是 Vue 的 data
  state: () => ({
    walletAddress: '4564',
    balance: 0,
    isConnected: false
  }),
  
  // getters 就像是 Vue 的 computed
  getters: {
    shortAddress: (state) => {
      if (!state.walletAddress) return ''
      return `${state.walletAddress.slice(0, 6)}...${state.walletAddress.slice(-4)}`
    }
  },
  
  // actions 就像是 Vue 的 methods (支援非同步 async/await)
  actions: {
    async connectWallet() {
      // 模擬連線錢包的動作
      this.isConnected = true;
      this.walletAddress = '0x71C7656EC7ab88b098defB751B7401B5f6d8976F';
      this.balance = 100.5;
    },
    disconnect() {
      this.isConnected = false;
      this.walletAddress = '';
      this.balance = 0;
    }
  }
})
