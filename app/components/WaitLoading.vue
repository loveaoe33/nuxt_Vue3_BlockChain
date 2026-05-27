<template>
  <div class="wait-wrapper">
    <!-- 網頁內容區塊 -->
    <div style="padding: 50px; color: #94a3b8; text-align: center;">
      <h1>我的 Web3 網站</h1>
      <p>點擊下方按鈕測試 10 秒動態載入 (光條設計版)。</p>
      <button class="wait-test-btn" @click="startTx">送出交易 (10秒光條測試)</button>
    </div>

    <!-- 懸浮透明外層 -->
    <div v-if="isOverlayVisible" class="wait-tx-overlay-container">
      <div class="wait-tx-loading-card">
        
        <!-- 完整 10 個獨立的光條 (Segment) -->
        <div class="wait-progress-segments">
          <div 
            v-for="(n, index) in totalSeconds" 
            :key="index"
            class="wait-segment"
            :class="{
              'wait-active': secondsPassed > index || isCompleted,
              'wait-pending': secondsPassed === index + 1 && !isCompleted
            }"
          ></div>
        </div>
        
        <div class="wait-tx-info">
          <span class="wait-status-tag" :style="{ background: tagColor }">{{ tagText }}</span>
          <p>{{ statusText }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 狀態變數
const isOverlayVisible = ref(false)
const secondsPassed = ref(0)
const totalSeconds = 10
const isCompleted = ref(false)

// 計算屬性 (根據狀態動態改變文字與顏色)
const tagText = computed(() => isCompleted.value ? '已完成' : '處理中')
const tagColor = computed(() => isCompleted.value ? '#10b981' : '#38bdf8')
const statusText = computed(() => {
  if (isCompleted.value) return '交易已確認寫入區塊鏈！'
  return `交易發送至主網... (${secondsPassed.value}/${totalSeconds} 秒)`
})

// 執行交易模擬
const startTx = () => {
  // 顯示 Loading 畫面並重置狀態
  isOverlayVisible.value = true
  secondsPassed.value = 0
  isCompleted.value = false

  // 每 1 秒執行一次的計時器
  const timer = setInterval(() => {
    secondsPassed.value++

    // 判斷是否滿 10 秒
    if (secondsPassed.value >= totalSeconds) {
      clearInterval(timer) // 停止計時
      isCompleted.value = true

      // 延遲 0.8 秒讓使用者看清楚，然後關閉視窗
      setTimeout(() => {
        isOverlayVisible.value = false
        alert('交易已完成！')
      }, 800)
    }
  }, 1000)
}
</script>

<style scoped>
/* --- 模擬你的 Template 背景 --- */
.wait-wrapper {
  margin: 0;
  padding: 0;
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  min-height: 100vh;
  font-family: sans-serif;
}

.wait-test-btn {
  padding: 10px 20px; 
  cursor: pointer; 
  font-size: 16px;
}

/* --- 1. 透明懸浮外層 --- */
.wait-tx-overlay-container {
  position: fixed; 
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: transparent; 
  /* Vue 透過 v-if 控制顯示隱藏，這裡直接設定 flex 即可 */
  display: flex; 
  justify-content: center;
  align-items: center;
  z-index: 9999; 
  pointer-events: none; 
}

/* --- 2. 卡片本體 --- */
.wait-tx-loading-card {
  background: rgba(255, 255, 255, 0.05); 
  backdrop-filter: blur(10px); 
  -webkit-backdrop-filter: blur(10px); 
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 24px;
  border-radius: 16px;
  width: 340px; 
  pointer-events: auto; 
}

/* --- 3. 10段式光條設計 --- */
.wait-progress-segments {
  display: flex;
  gap: 6px; 
  margin-bottom: 20px;
  width: 100%;
}

.wait-segment {
  height: 6px; 
  flex-grow: 1; 
  background: #334155; 
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* 已完成的光條 (綠色) */
.wait-segment.wait-active {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
}

/* 正在處理中的光條 (科技藍閃爍) */
.wait-segment.wait-pending {
  background: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.8);
  animation: wait-segment-pulse 0.6s infinite alternate;
}

@keyframes wait-segment-pulse {
  from { opacity: 0.4; transform: scaleY(1); }
  to { opacity: 1; transform: scaleY(1.5); } 
}

/* --- 標籤與文字排版 --- */
.wait-status-tag {
  color: #000;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: bold;
  transition: background 0.3s, color 0.3s;
}

.wait-tx-info p {
  color: #e2e8f0;
  font-size: 14px;
  margin-top: 10px;
  margin-bottom: 0;
  font-variant-numeric: tabular-nums; 
}
</style>