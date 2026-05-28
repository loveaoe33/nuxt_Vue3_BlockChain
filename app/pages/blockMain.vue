<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useWalletStore } from '~/stores/wallet'
import QueryTransfer from './queryTransfer.vue'
import '../css/blockMain.css'

const walletStore = useWalletStore()

// 標註非同步函式的回傳型別為 Promise<void>
const handleLogin = async (): Promise<void> => {
  await walletStore.connectWallet()
}

// === 定義表單變數 (與畫面上的 input 雙向綁定) ===
// 明確標註基本型別。雖然 Vue 會自動推斷 ref('') 是 string，但寫明 <string> 能讓程式碼意圖更清晰
const partnerCompany = ref<string>('') 
const senderAccount = ref<string>('')
const receiverAccount = ref<string>('')
// 當初始值為 null 或空陣列 [] 時，務必加上聯合型別 <number | null>，否則 TS 會將其推斷為 any 型別
const transferAmount = ref<number | null>(null)
const searchHash = ref<string>('')

// 自動帶入登入者的錢包地址作為發送帳號
watch(() => walletStore.walletAddress, (newAddress) => {
  senderAccount.value = newAddress || ''
}, { immediate: true })

// 當錢包斷線時，自動清空表單已選擇的資料
watch(() => walletStore.isConnected, (connected) => {
  if (!connected) {
    partnerCompany.value = ''
    receiverAccount.value = ''
  }
})

// === 動態計算連動的特約帳號清單 ===
const availableVipAccounts = computed(() => {
  if (!partnerCompany.value) return []
  return walletStore.vipAccounts
    // 1. 強制轉字串比對，避免型別不一致導致過濾失敗
    .filter(g => String(g.companyId) === String(partnerCompany.value))
    .flatMap(g => {
      // 2. 確保 accounts 存在，並帶入外層特約帳號的名稱 (vipName) 供選單顯示
      return (g.accounts || []).map(acc => ({
        ...acc,
        vipName: g.name
      }))
    })
})

// === 定義 Modal 彈窗的開關狀態 ===
const showModal = ref<boolean>(false)
const showAccountEditModal = ref<boolean>(false)
const showSpecialStoreModal = ref<boolean>(false)

// 接收帳號驗證狀態
const receiverValidationMsg = ref<string>('')
const isReceiverValid = ref<boolean>(false)

// 監聽接收帳號變動，自動清除驗證訊息
watch(receiverAccount, () => {
  receiverValidationMsg.value = ''
  isReceiverValid.value = false
})

// === 呼叫各種行為 (Actions) ===
// 驗證接收帳號
const verifyAccount = (): void => {
  if (!receiverAccount.value) {
    isReceiverValid.value = false
    receiverValidationMsg.value = '⚠️ 請先輸入或選擇接收帳號'
    return
  }
  
  const addressToVerify = receiverAccount.value.trim().toLowerCase()
  
  // 在約定帳戶與特約帳戶中尋找該地址
  let foundAccount = walletStore.agreedAccounts.find(a => a.address.toLowerCase() === addressToVerify)
  if (!foundAccount) {
    const allVipAccounts = walletStore.vipAccounts.flatMap(v => v.accounts)
    foundAccount = allVipAccounts.find(a => a.address.toLowerCase() === addressToVerify)
  }

  if (foundAccount) {
    isReceiverValid.value = true
    receiverValidationMsg.value = `✅ 帳號正確 - 名稱: ${foundAccount.name} | Account: ${foundAccount.account || '未設定'}`
  } else {
    isReceiverValid.value = false
    receiverValidationMsg.value = '❌ 找不到此接收帳號或非約定/特約帳戶'
  }
}

const executeTransfer = (): void => {
  if (!walletStore.isConnected) {
    alert("❌ 請先點擊右上角連線錢包！")
    return
  }
  if (!isReceiverValid.value) {
    alert("⚠️ 接收帳號尚未確認或格式錯誤，請先點擊「帳號確認」！")
    return
  }
  if (!transferAmount.value || transferAmount.value <= 0) {
    alert("⚠️ 請輸入大於 0 的正確轉帳金額！")
    return
  }
  
  // 成功發起的模擬通知
  alert(`✅ 準備發起交易！\n發送方: ${walletStore.shortAddress}\n接收方: ${receiverAccount.value}\n金額: ${transferAmount.value} CORE`)
  // 實際應用時，這裡會呼叫： walletStore.sendTransaction(receiverAccount.value, transferAmount.value)
}
</script>

<template>
<div class="blockmain_body">
    <header class="blockmain_card header-nav">
        <div class="blockmain_header-content">
            <div class="header-left">
                <h1>🌐 CORE V3.1 - 區塊鏈控制台</h1>
                <p class="header-subtitle-text">請連線您的帳戶以進行交易，或瀏覽公共網絡數據。</p>
            </div>
            
            <div id="auth-status" class="header-right">
                <span v-if="!walletStore.isConnected" class="status-text">未偵測到使用者連線</span>
                <span v-else class="status-text">已連線: {{ walletStore.shortAddress }} | 餘額: {{ walletStore.balance }} CORE</span>
                <div class="header-buttons">
                    <a href="admin_super.html" class="admin-link-btn">[管理員登入]</a>
                    <button v-if="walletStore.isConnected" class="query-btn" @click="showAccountEditModal = true">📝 編輯帳號</button>
                    <button v-if="walletStore.isConnected" class="query-btn" @click="showSpecialStoreModal = true">⚙️ 編輯特約帳號</button>
                    <button v-if="walletStore.isConnected" class="query-btn" @click="showModal = true">📋 查詢交易紀錄</button>
                    <QueryTransfer :isOpen="showModal" @close="showModal = false" />
                    <AccountEditModal :isOpen="showAccountEditModal" @close="showAccountEditModal = false" />
                    <SpecialStoreModal :isOpen="showSpecialStoreModal" @close="showSpecialStoreModal = false" />

                    <button v-if="!walletStore.isConnected" class="login-btn" @click="handleLogin">登入/連線錢包</button>
                    <button v-else class="login-btn" @click="walletStore.disconnect()">中斷連線</button>
                </div>
            </div>
        </div>
    </header>

    <div class="blockmain_container">
        <div class="blockmain-content">
            <div class="blockmain_card card-fixed-height">
                <h2>💸 節點交易介面:{{ walletStore.shortAddress }} | 餘額: {{ walletStore.balance }}</h2>
                
                <label>特約合作公司 (Partner Company):</label>
                <!-- 切換公司時，同時將已選擇的特約帳號清空 -->
                <select id="company-select" class="vip-select" v-model="partnerCompany" @change="receiverAccount = ''" :disabled="!walletStore.isConnected" :style="{ opacity: walletStore.isConnected ? 1 : 0.7, cursor: walletStore.isConnected ? 'auto' : 'not-allowed' }">
                    <option value="">{{ walletStore.isConnected ? '-- 選擇合作夥伴 --' : '-- 請先連線錢包 --' }}</option>
                    <option v-for="comp in walletStore.companies" :key="comp.id" :value="comp.id">
                        {{ comp.name }}
                    </option>
                </select>

                <label>可選擇的特約帳號 (VIP Accounts):</label>
                <select id="friend-select" class="vip-select" v-model="receiverAccount" :disabled="!walletStore.isConnected" :style="{ opacity: walletStore.isConnected ? 1 : 0.7, cursor: walletStore.isConnected ? 'auto' : 'not-allowed' }">
                    <option value="">{{ walletStore.isConnected ? '-- 請選擇特約帳號 --' : '-- 請先連線錢包 --' }}</option>
                    <option v-for="(acc, index) in availableVipAccounts" :key="index" :value="acc.address">
                        [{{ acc.vipName }}] {{ acc.name }} ({{ acc.address.slice(0,10) }}...)
                    </option>
                </select>

                <hr class="divider">

                <label for="sender-account">發送帳號 (From):</label>
                <input type="text" id="sender-account" placeholder="請先登入" v-model="senderAccount" disabled style="opacity: 0.7; cursor: not-allowed;">

                <label for="receiver-account">接收帳號 (To):</label>
                <div class="input-with-btn" style="margin-bottom: 8px;">
                    <input type="text" id="receiver-account" placeholder="輸入地址或從上方特約清單選取" v-model="receiverAccount" style="margin-bottom: 0;">
                    <button class="verify-btn" @click="verifyAccount">帳號確認</button>
                </div>
                <div v-if="receiverValidationMsg" :style="{ color: isReceiverValid ? '#10b981' : '#ef4444', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '18px' }">
                    {{ receiverValidationMsg }}
                </div>

                <label for="amount">轉帳金額 (AMOUNT):</label>
                <input type="number" id="amount" placeholder="輸入 CORE 單位數量" min="0" step="0.0001" v-model="transferAmount">

                <button id="transfer-btn" @click="executeTransfer">發起加密交易 (EXECUTE)</button>
            </div>
        </div>

        <div class="blockmain-side-content">
            <div class="blockmain_card card-fixed-height">
                <h2>⛏️ 現行區塊串流 <span id="current-block-number">#12345</span></h2>
                <div class="block-display" id="current-block-data">
                    <pre>[INIT] 連線至主網...
區塊數據將在此處持續刷新...</pre>
                </div>
                <small style="display: block; margin-top: 10px; color: var(--text-color); opacity: 0.7;">狀態: 線上 / 延遲: 0.5s</small>
            </div>
        </div>
        
        <div class="full-width">
            <div class="blockmain-card">
                <h2>🔎 數據鏈條調閱</h2>
                <label for="query-input">區塊索引號或交易 Hash:</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="query-input" placeholder="例如: Block# 12345 或 0x5aef...f89b" style="margin-bottom: 0;" v-model="searchHash">
                    <button style="background-color: var(--primary-color); flex-shrink: 0;">執行查詢</button>
                </div>
                <div class="block-display" style="margin-top: 10px; color: #6a8dff;">
                    <pre id="query-result">// 查詢結果: 尚無資料輸入 {{ searchHash ? `(${searchHash})` : '' }}</pre>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
