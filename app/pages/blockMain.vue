<template>
<div class="blockmain_body">
    <header class="blockmain_card header-nav">
        <div class="blockmain_header-content">
            <div class="header-left">
                <h1>🌐 CORE V3.1 - 區塊鏈控制台</h1>
                <p class="header-subtitle-text">請連線您的帳戶以進行交易，或瀏覽公共網絡數據。</p>
            </div>
            
            <div id="auth-status" class="header-right">
                <span class="status-text">未偵測到使用者連線</span>
                <div class="header-buttons">
                    <a href="admin_super.html" class="admin-link-btn">[管理員登入]</a>
                    <button class="query-btn" onclick="openHistoryModal()">📋 查詢交易紀錄</button>
                    <button class="login-btn" onclick="showLoginModal()">登入/連線錢包</button>
                </div>
            </div>
        </div>
    </header>

    <div class="blockmain_container">
        <div class="blockmain-content">
            <div class="blockmain_card card-fixed-height">
                <h2>💸 節點交易介面</h2>
                
                <label>特約合作公司 (Partner Company):</label>
                <select id="company-select" class="vip-select">
                    <option value="">-- 選擇合作夥伴 --</option>
                    <option value="tech_vision">TechVision 科技集團</option>
                    <option value="global_link">GlobalLink 跨境物流</option>
                </select>

                <label>可選擇的特約帳號 (VIP Accounts):</label>
                <select id="friend-select" class="vip-select" onchange="document.getElementById('receiver-account').value=this.value">
                    <option value="">-- 請選擇特約帳號 --</option>
                    <option value="0x71C7656EC7ab88b098defB751B7401B5f6d8976F">主要結算帳戶 (Primary)</option>
                    <option value="0x123f681646d4a755815f9cb19e1acc8565a0c2ac">應急儲備帳戶 (Reserve)</option>
                </select>

                <hr class="divider">

                <label for="sender-account">發送帳號 (From):</label>
                <div class="input-with-btn">
                    <input type="text" id="sender-account" placeholder="請先登入或輸入地址">
                    <button class="verify-btn" onclick="verifyAccount()">帳號確認</button>
                </div>

                <label for="receiver-account">接收帳號 (To):</label>
                <input type="text" id="receiver-account" placeholder="輸入地址或從上方特約清單選取">

                <label for="amount">轉帳金額 (AMOUNT):</label>
                <input type="number" id="amount" placeholder="輸入 CORE 單位數量" min="0" step="0.0001">

                <button id="transfer-btn">發起加密交易 (EXECUTE)</button>
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
                    <input type="text" id="query-input" placeholder="例如: Block# 12345 或 0x5aef...f89b" style="margin-bottom: 0;">
                    <button style="background-color: var(--primary-color); flex-shrink: 0;">執行查詢</button>
                </div>
                <div class="block-display" style="margin-top: 10px; color: #6a8dff;">
                    <pre id="query-result">// 查詢結果: DATA_OUTPUT_FEED</pre>
                </div>
            </div>
        </div>
    </div>

    <div id="history-modal" class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h2>🔍 交易紀錄與資料查詢</h2>
                <span class="close-btn" onclick="closeHistoryModal()">&times;</span>
            </div>
            <div class="modal-body">
                <div class="search-box">
                    <input type="text" id="modal-search" placeholder="搜尋交易 Hash...">
                    <button class="verify-btn" onclick="searchHistory()" style="background: var(--primary-color) !important; color: var(--background-color) !important;">搜尋</button>
                </div>
                <div class="history-list-container">
                    <table class="history-table">
                        <thead>
                            <tr><th>時間</th><th>類型</th><th>Hash</th><th>狀態</th></tr>
                        </thead>
                        <tbody id="history-data">
                            <tr><td>2024-05-20</td><td>轉帳</td><td class="hash-text">0x5aef...f89b</td><td style="color: var(--primary-color);">已完成</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<style>
:root {
  --primary-color: #38c1a1;
  --secondary-color: #6a8dff;
  --background-color: #0c1c3a;
  --card-background: #1e365e;
  --input-bg: #15294a;
  --text-color: #e0eafb;
  --border-radius: 6px;
  --spacing-unit: 20px;
}

.blockmain_body {
  font-family: 'Segoe UI', sans-serif;
  margin: 0; padding: 0; background: var(--background-color); color: var(--text-color);
}

/* --- Layout --- */
.blockmain_container {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-unit);
  gap: var(--spacing-unit);
  max-width: 1300px;
  margin: 0 auto;
}

@media (min-width: 768px) {
  .blockmain_container { flex-direction: row; flex-wrap: wrap; }
  .blockmain-content { flex: 2; min-width: 50%; }
  .blockmain-side-content { flex: 1; min-width: 30%; }
  .full-width { flex: 0 0 100%; }
}

/* --- Header Layout 修正 --- */
.blockmain_header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 改為對齊頂部 */
}

.header-left h1 { margin: 0; }
.header-subtitle-text {
  margin: 5px 0 0 0;
  font-size: 0.9rem;
  color: var(--primary-color);
  opacity: 0.8;
}

.header-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 10px;
}

.header-buttons { 
    display: flex; 
    gap: 12px; 
    align-items: center; 
}

/* 管理員登入按鈕樣式 */
.admin-link-btn {
    color: var(--secondary-color);
    text-decoration: none;
    font-size: 0.85rem;
    font-weight: bold;
    padding: 8px 12px;
    border: 1px solid transparent;
    transition: 0.3s;
}

.admin-link-btn:hover {
    color: #fff;
    border-bottom: 1px solid var(--secondary-color);
}

.status-text {
  font-size: 0.8rem;
  color: var(--secondary-color);
  background: rgba(106, 141, 255, 0.1);
  padding: 2px 10px;
  border-radius: 4px;
  border-right: 3px solid var(--secondary-color);
}

/* --- Components --- */
.blockmain_card, .blockmain-card {
  background: var(--card-background);
  border-radius: var(--border-radius);
  padding: var(--spacing-unit);
  border: 1px solid rgba(56, 193, 161, 0.4);
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
}

h2 { border-bottom: 2px solid rgba(56, 193, 161, 0.3); padding-bottom: 8px; margin-bottom: 15px; color: var(--primary-color); }

label { display: block; margin-bottom: 8px; font-weight: bold; font-size: 0.9rem; }

input, select {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background: var(--input-bg);
  border: 1px solid var(--secondary-color);
  color: #fff;
  border-radius: var(--border-radius);
  box-sizing: border-box;
}

input:focus, select:focus { outline: none; border-color: var(--primary-color); box-shadow: 0 0 5px var(--primary-color); }

.vip-select { border-left: 4px solid var(--primary-color); }
.divider { border: 0; border-top: 1px dashed rgba(106, 141, 255, 0.2); margin: 5px 0 15px 0; }

.input-with-btn { display: flex; gap: 10px; margin-bottom: 15px; }
.input-with-btn input { margin-bottom: 0 !important; }

/* --- Buttons --- */
button { background: var(--primary-color); color: var(--background-color); padding: 10px 18px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.2s; }
.query-btn { background: transparent !important; border: 1px solid var(--secondary-color) !important; color: var(--secondary-color) !important; }
.verify-btn { background: transparent !important; border: 1px solid var(--secondary-color) !important; color: var(--secondary-color) !important; white-space: nowrap; }
#transfer-btn { background: var(--secondary-color); color: white; width: 100%; margin-top: 10px; }

/* --- Modal --- */
.modal-overlay {
  display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 2000;
  justify-content: center; align-items: center;
}
.modal-content { background: var(--card-background); width: 90%; max-width: 800px; border-radius: 12px; border: 1px solid var(--primary-color); padding: 25px; position: relative; }
.close-btn { position: absolute; right: 20px; top: 15px; font-size: 28px; cursor: pointer; }

/* --- Terminal Display --- */
.block-display {
  background: #000; color: #ff9900; padding: 15px; border-radius: 6px; font-family: monospace;
  font-size: 0.9rem; min-height: 180px; border: 1px solid rgba(255,153,0,0.3); overflow-x: auto;
}

.history-table { width: 100%; border-collapse: collapse; margin-top: 15px; }
.history-table th, .history-table td { padding: 12px; text-align: left; border-bottom: 1px solid rgba(255,255,255,0.1); }
.hash-text { font-family: monospace; color: var(--secondary-color); }
</style>

