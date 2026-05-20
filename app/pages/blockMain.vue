<script setup lang="ts">
import { ref } from 'vue'
import { useWalletStore } from '~/stores/wallet'
import QueryTransfer from './queryTransfer.vue'

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
                    <button class="query-btn" @click="showModal = true">📋 查詢交易紀錄</button>
                    <QueryTransfer :isOpen="showModal" @close="showModal = false" />

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

<style>
:root {
  --primary-color: #00f2fe; /* 亮青色，增添科技感 */
  --secondary-color: #4facfe; /* 科技藍 */
  --background-color: #0b1120; /* 深邃背景 */
  --card-background: rgba(17, 24, 39, 0.7); /* 玻璃擬態背景 */
  --input-bg: rgba(3, 7, 18, 0.6);
  --text-color: #f8fafc;
  --border-radius: 12px;
  --spacing-unit: 24px;
  --card-border: 1px solid rgba(255, 255, 255, 0.08);
  --glow-shadow: 0 0 20px rgba(0, 242, 254, 0.15);
}

.blockmain_body {
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
  margin: 0; padding: 0; 
  background: var(--background-color); 
  background-image: radial-gradient(circle at 15% 50%, rgba(79, 172, 254, 0.08), transparent 25%),
                    radial-gradient(circle at 85% 30%, rgba(0, 242, 254, 0.08), transparent 25%);
  color: var(--text-color);
  min-height: 100vh;
  line-height: 1.6;
}

/* --- Layout --- */
.blockmain_container {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-unit);
  gap: var(--spacing-unit);
  max-width: 1400px;
  margin: 0 auto;
}

@media (min-width: 992px) {
  .blockmain_container { flex-direction: row; flex-wrap: wrap; }
  .blockmain-content { flex: 2; min-width: 55%; }
  .blockmain-side-content { flex: 1; min-width: 35%; }
  .full-width { flex: 0 0 100%; }
}

/* --- Header Layout --- */
.blockmain_header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 15px;
}

.header-left h1 { 
  margin: 0; 
  font-size: 1.8rem;
  background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 30px rgba(0, 242, 254, 0.3);
}

.header-subtitle-text {
  margin: 8px 0 0 0;
  font-size: 0.95rem;
  color: #94a3b8;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
}

.header-buttons { 
    display: flex; 
    gap: 12px; 
    align-items: center; 
    flex-wrap: wrap;
}

.admin-link-btn {
    color: #94a3b8;
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.admin-link-btn:hover {
    color: var(--primary-color);
    background: rgba(0, 242, 254, 0.05);
}

.status-text {
  font-size: 0.85rem;
  color: var(--secondary-color);
  background: rgba(79, 172, 254, 0.1);
  padding: 4px 12px;
  border-radius: 20px;
  border: 1px solid rgba(79, 172, 254, 0.2);
  box-shadow: var(--glow-shadow);
}

/* --- Components --- */
.blockmain_card, .blockmain-card {
  background: var(--card-background);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-radius: var(--border-radius);
  padding: var(--spacing-unit);
  border: var(--card-border);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.blockmain_card:hover, .blockmain-card:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5), var(--glow-shadow);
}

h2 { 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
  padding-bottom: 12px; 
  margin-top: 0;
  margin-bottom: 20px; 
  color: var(--text-color); 
  font-size: 1.3rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
}

label { 
  display: block; 
  margin-bottom: 8px; 
  font-weight: 500; 
  font-size: 0.9rem; 
  color: #cbd5e1;
}

input, select {
  width: 100%;
  padding: 14px 16px;
  margin-bottom: 18px;
  background: var(--input-bg);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

input:focus, select:focus { 
  outline: none; 
  border-color: var(--primary-color); 
  box-shadow: 0 0 0 3px rgba(0, 242, 254, 0.15); 
  background: rgba(10, 16, 30, 0.9);
}

.vip-select { 
  border-left: 4px solid var(--primary-color); 
}

.divider { 
  border: 0; 
  border-top: 1px solid rgba(255, 255, 255, 0.08); 
  margin: 10px 0 20px 0; 
}

.input-with-btn { 
  display: flex; 
  gap: 12px; 
  margin-bottom: 18px; 
}
.input-with-btn input { 
  margin-bottom: 0 !important; 
}

/* --- Buttons --- */
button { 
  background: var(--primary-color); 
  color: #020617; 
  padding: 12px 20px; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  font-weight: 600; 
  font-size: 0.95rem;
  transition: all 0.3s ease; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

button:hover { 
  transform: translateY(-2px); 
  box-shadow: 0 4px 12px rgba(0, 242, 254, 0.3); 
}

button:active {
  transform: translateY(0);
}

.login-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  color: #fff;
}

.query-btn, .verify-btn { 
  background: transparent !important; 
  border: 1px solid rgba(255, 255, 255, 0.2) !important; 
  color: var(--text-color) !important; 
}

.query-btn:hover, .verify-btn:hover {
  border-color: var(--primary-color) !important;
  color: var(--primary-color) !important;
  background: rgba(0, 242, 254, 0.05) !important;
}

#transfer-btn { 
  background: linear-gradient(135deg, var(--secondary-color), #3b82f6); 
  color: white; 
  width: 100%; 
  margin-top: 15px; 
  padding: 16px;
  font-size: 1.1rem;
  letter-spacing: 1px;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
}

#transfer-btn:hover {
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.5);
}

/* --- Modal --- */
.modal-overlay {
  display: flex; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(2, 6, 23, 0.8); 
  backdrop-filter: blur(8px); 
  -webkit-backdrop-filter: blur(8px);
  z-index: 2000;
  justify-content: center; align-items: center;
}

.modal-content { 
  background: var(--card-background); 
  width: 90%; 
  max-width: 800px; 
  border-radius: 16px; 
  border: var(--card-border); 
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset;
  padding: 30px; 
  position: relative; 
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  border: none;
  padding: 0;
}

.close-btn { 
  font-size: 28px; 
  cursor: pointer; 
  color: #94a3b8;
  transition: color 0.3s;
  line-height: 1;
}

.close-btn:hover {
  color: #ef4444;
}

/* --- Terminal Display --- */
.block-display {
  background: #020617; 
  color: #34d399; /* 黑客綠 */
  padding: 16px; 
  border-radius: 8px; 
  font-family: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
  font-size: 0.9rem; 
  min-height: 180px; 
  border: 1px solid rgba(52, 211, 153, 0.2); 
  box-shadow: inset 0 0 20px rgba(0,0,0,0.8);
  overflow-x: auto;
  line-height: 1.5;
}

.block-display pre { margin: 0; }

/* Scrollbar Styling for Terminal */
.block-display::-webkit-scrollbar { height: 8px; }
.block-display::-webkit-scrollbar-track { background: #0f172a; border-radius: 4px; }
.block-display::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
.block-display::-webkit-scrollbar-thumb:hover { background: #475569; }

.history-table { 
  width: 100%; 
  border-collapse: separate; 
  border-spacing: 0;
  margin-top: 20px; 
}

.history-table th { 
  background: rgba(255, 255, 255, 0.03);
  color: #94a3b8;
  font-weight: 600;
  padding: 14px; 
  text-align: left; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
}

.history-table th:first-child { border-top-left-radius: 8px; }
.history-table th:last-child { border-top-right-radius: 8px; }

.history-table td { 
  padding: 14px; 
  text-align: left; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
  transition: background 0.2s;
}

.history-table tr:hover td {
  background: rgba(255, 255, 255, 0.02);
}

.hash-text { 
  font-family: 'JetBrains Mono', Consolas, monospace; 
  color: var(--secondary-color); 
  background: rgba(79, 172, 254, 0.1);
  padding: 4px 8px;
  border-radius: 4px;
}
</style>
