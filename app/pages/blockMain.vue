<template>

<div class="blockmain_body">
 <header class="blockmain_card">
        <div class="blockmain_header-content">
            <h1>🌐 CORE V3.1 - 區塊鏈控制台</h1>
            <div id="auth-status">
                <span>未偵測到使用者連線</span>
                <button onclick="showLoginModal()">登入/連線錢包</button>
            </div>
        </div>
        <p style="color: var(--primary-color); border-top: 1px solid rgba(56, 193, 161, 0.4); padding-top: 10px;">
            請連線您的帳戶以進行交易，或瀏覽公共網絡數據。
            <a href="admin_super.html" style="color: var(--secondary-color); margin-left: 20px;">[管理員登入]</a>
        </p>
    </header>

    <div class="blockmain_container">
        
        <div class="blockmain-content">
            <div class="card">
                <h2>💸 節點交易介面</h2>
                <label for="sender-account">發送帳號 (From):</label>
                <input type="text" id="sender-account" placeholder="請先登入以取得您的地址">

                <label for="receiver-account">接收帳號 (To):</label>
                <input type="text" id="receiver-account" placeholder="輸入收款人地址">

                <label for="amount">轉帳金額 (AMOUNT):</label>
                <input type="number" id="amount" placeholder="輸入 CORE 單位數量" min="0" step="0.0001">

                <button id="transfer-btn">發起加密交易 (EXECUTE)</button>
            </div>
        </div>

        <div class="blockmain-side-content">
            <div class="blockmain_card">
                <h2>⛏️ 現行區塊串流 <span id="current-block-number">#12345</span></h2>
                <div class="block-display" id="current-block-data">
                    <pre>
[INIT] 連線至主網...
區塊數據將在此處持續刷新...
                    </pre>
                </div>
                <small style="display: block; margin-top: 10px; color: var(--text-color);">狀態: 線上 / 延遲: 0.5s</small>
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
</div>

</template>

<script setup>



</script>

  <style>
/* --- 調整後的明亮科技感 CSS 設定 --- */
:root {
  /* 顏色調整：更明亮、更柔和 */
  --primary-color: #38c1a1;    /* 較溫和的青綠色 */
  --secondary-color: #6a8dff;  /* 穩重的電光藍 */
  --background-color: #0c1c3a; /* 深藍色背景 */
  --card-background: #1e365e;  /* 稍淺的卡片背景 */
  --text-color: #e0eafb;       /* 明亮的文字顏色 */
  --success-color: #38c1a1; 
  --danger-color: #ff6b6b; 
  --border-radius: 6px;
  --spacing-unit: 20px;
}

/* 將原本的 body 樣式應用到最外層容器 */
.blockmain_body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  margin: 0;
  padding: 0;
  background-color: var(--background-color);
  line-height: 1.6;
  color: var(--text-color);
  overflow-x: hidden;
  min-height: 100vh;
}

/* 標題和重要文字的柔和發光 */
h1, h2 {
  color: var(--primary-color);
  text-shadow: 0 0 4px rgba(56, 193, 161, 0.5); 
}

h2 {
  border-bottom: 2px solid rgba(56, 193, 161, 0.3);
  padding-bottom: 8px;
  margin-top: 0;
}

/* --- 佈局容器 --- */
.blockmain_container {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-unit);
  gap: var(--spacing-unit);
  max-width: 1300px;
  margin: 0 auto;
}

/* RWD 斷點: 適用於平板及桌機 */
@media (min-width: 768px) {
  .blockmain_container {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .blockmain-content {
    flex: 2;
    min-width: 50%;
  }

  .blockmain-side-content {
    flex: 1;
    min-width: 30%;
  }

  .full-width {
    flex: 0 0 100%;
  }
}

/* --- 核心元件樣式 (對應 .blockmain_card & .blockmain-card) --- */
.blockmain_card, .blockmain-card {
  background-color: var(--card-background);
  border-radius: var(--border-radius);
  padding: var(--spacing-unit);
  border: 1px solid rgba(56, 193, 161, 0.4);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.blockmain_card:hover, .blockmain-card:hover {
  border-color: var(--primary-color);
  box-shadow: 0 4px 20px rgba(56, 193, 161, 0.2);
}

/* --- 表單元件 --- */
input[type="text"], 
input[type="number"], 
input[type="password"], 
textarea {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  background-color: #15294a; /* 比卡片更深的背景 */
  border: 1px solid var(--secondary-color);
  border-radius: var(--border-radius);
  color: var(--text-color);
  box-sizing: border-box; /* 確保寬度包含 padding */
}

input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 5px var(--primary-color);
}

button {
  background-color: var(--primary-color);
  color: var(--background-color); 
  padding: 12px 20px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.1s ease;
  font-weight: bold;
}

button:hover {
  background-color: #4cd4b5;
  transform: translateY(-1px);
}

/* 交易按鈕特殊樣式 */
#transfer-btn {
  background-color: var(--secondary-color);
  color: white;
  width: 100%;
}

#transfer-btn:hover {
  background-color: #8faaff;
}

/* --- 區塊顯示樣式 (終端機風格) --- */
.block-display {
  background-color: #000000;
  color: #ff9900; 
  padding: 15px;
  border-radius: var(--border-radius);
  font-family: 'Consolas', 'Courier New', monospace;
  font-size: 0.9em;
  overflow-x: auto;
  white-space: pre-wrap;
  min-height: 150px;
  border: 1px solid rgba(255, 153, 0, 0.5);
  box-shadow: inset 0 0 8px rgba(255, 153, 0, 0.3);
}

.block-display pre {
  margin: 0;
}

/* --- Header 內部樣式 --- */
.blockmain_header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

/* 登入/歡迎區塊 */
#auth-status {
  padding: 10px 15px;
  background-color: rgba(12, 28, 58, 0.5);
  border-radius: var(--border-radius);
  border: 1px dashed var(--secondary-color);
  text-align: right;
  color: var(--secondary-color);
}

#auth-status button {
  background-color: var(--secondary-color);
  color: white;
  padding: 8px 15px;
  margin-left: 10px;
  font-size: 0.9em;
}

#auth-status button:hover {
  background-color: #5579e0;
}
</style>