<template>


 <header class="card">
        <div class="header-content">
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

    <div class="container">
        
        <div class="main-content">
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

        <div class="side-content">
            <div class="card">
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
            <div class="card">
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


</template>

<script setup>



</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  text-align: center;
}

button {
  padding: 8px 16px;
  margin: 16px 0;
  cursor: pointer;
}
</style>
