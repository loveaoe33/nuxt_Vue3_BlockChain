<script setup lang="ts">
import { ref } from 'vue'
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

// === 定義 Modal 彈窗的開關狀態 ===
const showModal = ref<boolean>(false)
const showAccountEditModal = ref<boolean>(false)
const showSpecialStoreModal = ref<boolean>(false)

// === 呼叫各種行為 (Actions) ===
// 標註一般函式的回傳值為 void (代表不回傳任何東西)
// 改為接收一個 accountToVerify 字串參數
const verifyAccount = (accountToVerify: string): void => {
  alert(`正在驗證帳號: ${accountToVerify || walletStore.walletAddress || '未輸入'}`)
}

const executeTransfer = (): void => {
  if (!walletStore.isConnected) {
    alert("❌ 請先點擊右上角連線錢包！")
    return
  }
  if (!receiverAccount.value || !transferAmount.value) {
    alert("⚠️ 請輸入接收帳號與正確的轉帳金額！")
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
                <select id="company-select" class="vip-select" v-model="partnerCompany">
                    <option value="">-- 選擇合作夥伴 --</option>
                    <option value="tech_vision">TechVision 科技集團</option>
                    <option value="global_link">GlobalLink 跨境物流</option>
                </select>

                <label>可選擇的特約帳號 (VIP Accounts):</label>
                <select id="friend-select" class="vip-select" v-model="receiverAccount">
                    <option value="">-- 請選擇特約帳號 --</option>
                    <option value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F">主要結算帳戶 (Primary)</option>
                    <option value="0x123f681646d4a755815f9cb19e1acc8565a0c2ac">應急儲備帳戶 (Reserve)</option>
                </select>

                <hr class="divider">d

                <label for="sender-account">發送帳號 (From):</label>
                <div class="input-with-btn">
                    <input type="text" id="sender-account" placeholder="請先登入或輸入地址" v-model="senderAccount">
                    <button class="verify-btn" @click="verifyAccount(senderAccount)">帳號確認</button>
                </div>

                <label for="receiver-account">接收帳號 (To):</label>
                <input type="text" id="receiver-account" placeholder="輸入地址或從上方特約清單選取" v-model="receiverAccount">

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
