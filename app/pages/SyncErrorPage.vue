<template>
  <div class="syncError-wrapper">
    <!-- =========================================
         主要內容：錯誤狀態卡片
         ========================================= -->
    <div class="syncError-fatal-error-card">
      <div class="syncError-error-core-visual">
        <div class="syncError-dead-orbit"></div>
        <div class="syncError-neon-cross"></div>
      </div>
      
      <span class="syncError-error-code">ERR_NODE_DISCONNECTED</span>
      <h3 class="syncError-error-title">主網連線中斷</h3>
      <p class="syncError-error-desc">無法與區塊鏈節點建立穩定通訊。<br>請檢查網路環境或切換 RPC 伺服器。</p>
      
      <button class="syncError-sys-reboot-btn" @click="handleReboot">> INIT_REBOOT</button>
    </div>

    <!-- =========================================
         底部內容：系統版本與開發者資訊
         ========================================= -->
    <div class="syncError-system-credits">
      <span class="syncError-credit-item">開發者: <span class="syncError-highlight">LEO</span></span>
      <span class="syncError-divider">/</span>
      <span class="syncError-credit-item">聯絡資訊: <a href="mailto:loveaoe33@gmail.com" class="syncError-credit-link">loveaoe33@gmail.com</a></span>
      <span class="syncError-divider">/</span>
      <span class="syncError-credit-item syncError-version">系統版本: ETH 2.0-V1.0</span>
    </div>
  </div>
</template>

<script setup>
// 模擬點擊重啟按鈕的操作
const handleReboot = () => {
  alert('正在嘗試重新連接節點系統...')
  // 這裡可以加入 router 推送或重新呼叫 API 的邏輯
}
</script>

<style scoped>
/* =========================================
   基礎設定
   ========================================= */
.syncError-wrapper {
  margin: 0;
  padding: 0;
  background: #0f172a; 
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative; /* 讓底部的絕對定位有依據 */
}

/* =========================================
   1. 中間錯誤卡片設計 (科技故障版)
   ========================================= */
.syncError-fatal-error-card {
  background: linear-gradient(145deg, rgba(15, 23, 42, 0.9) 0%, rgba(5, 5, 10, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-top: 3px solid #f43f5e; 
  padding: 40px 30px;
  border-radius: 12px;
  width: 340px;
  text-align: center;
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.6),
    inset 0 0 80px rgba(244, 63, 94, 0.05); 
  position: relative;
  overflow: hidden;
  z-index: 10;
}

.syncError-fatal-error-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(244, 63, 94, 0.02) 10px,
    rgba(244, 63, 94, 0.02) 20px
  );
  pointer-events: none;
}

/* 斷開的能量核心圖示 */
.syncError-error-core-visual {
  position: relative;
  width: 80px;
  height: 80px;
  margin: 0 auto 24px auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

.syncError-dead-orbit {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid rgba(244, 63, 94, 0.2);
  border-top-color: #f43f5e;
  border-right-color: transparent;
  animation: syncError-slow-glitch-spin 4s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite;
}

.syncError-neon-cross {
  position: relative;
  width: 32px;
  height: 32px;
}
.syncError-neon-cross::before, .syncError-neon-cross::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 3px;
  background: #f43f5e;
  border-radius: 2px;
  box-shadow: 0 0 12px #f43f5e, 0 0 24px #f43f5e;
}
.syncError-neon-cross::before { transform: translateY(-50%) rotate(45deg); }
.syncError-neon-cross::after { transform: translateY(-50%) rotate(-45deg); }

/* 文字排版 */
.syncError-error-code {
  font-family: monospace;
  color: #fb7185;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 8px;
  display: block;
}

.syncError-error-title {
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 12px 0;
  letter-spacing: 1px;
}

.syncError-error-desc {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 32px 0;
}

/* 科技感系統按鈕 */
.syncError-sys-reboot-btn {
  background: rgba(244, 63, 94, 0.1);
  color: #f43f5e;
  border: 1px solid rgba(244, 63, 94, 0.4);
  padding: 12px 0;
  width: 100%;
  border-radius: 6px;
  font-size: 14px;
  font-family: monospace;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.syncError-sys-reboot-btn:hover {
  background: #f43f5e;
  color: #fff;
  box-shadow: 0 0 20px rgba(244, 63, 94, 0.4);
}

.syncError-sys-reboot-btn:active {
  transform: translateY(2px);
}

.syncError-sys-reboot-btn::after {
  content: '';
  position: absolute;
  top: 0; left: -100%;
  width: 50%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: skewX(-20deg);
  transition: 0.5s;
}
.syncError-sys-reboot-btn:hover::after {
  left: 150%;
}

@keyframes syncError-slow-glitch-spin {
  0% { transform: rotate(0deg); opacity: 1; }
  25% { transform: rotate(90deg); opacity: 0.5; }
  30% { transform: rotate(95deg); opacity: 1; }
  75% { transform: rotate(270deg); opacity: 0.5; }
  100% { transform: rotate(360deg); opacity: 1; }
}

/* =========================================
   2. 底部系統版本與開發者資訊 (OWN)
   ========================================= */
.syncError-system-credits {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 16px;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  padding: 8px 20px;
  border-radius: 30px; 
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  font-family: monospace; 
  font-size: 12px;
  color: #64748b; 
  white-space: nowrap;
  z-index: 100;
}

.syncError-credit-item {
  letter-spacing: 0.5px;
}

.syncError-highlight {
  color: #f8fafc;
  font-weight: bold;
}

.syncError-version {
  color: #10b981; 
}

.syncError-credit-link {
  color: #38bdf8;
  text-decoration: none;
  transition: color 0.2s ease;
}

.syncError-credit-link:hover {
  color: #bae6fd;
  text-decoration: underline;
}

.syncError-divider {
  color: #334155;
  font-size: 10px;
}

@media (max-width: 600px) {
  .syncError-system-credits {
    flex-direction: column;
    gap: 6px;
    bottom: 16px;
    background: transparent;
    border: none;
    backdrop-filter: none;
  }
  .syncError-divider {
    display: none; 
  }
}
</style>