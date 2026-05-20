<script setup lang="ts">
import { ref } from 'vue'

// === 接收父元件傳入的 Props 與定義要發送的 Emits ===
defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const searchHash = ref<string>('')
const startDate = ref<string>('')
const endDate = ref<string>('')

// === 1. 定義 Structure (Interface) ===
interface TransactionHistory {
  date: string;
  type: string;
  hash: string;
  status: string;
}

// === 2. 建立假資料 (符合上述定義的型別) ===
const historyList = ref<TransactionHistory[]>([
  { date: '2024-05-20', type: '轉帳', hash: '0x5aef...f89b', status: '已完成' },
  { date: '2024-05-21', type: '收款', hash: '0x8b32...c12a', status: '處理中' },
  { date: '2024-05-22', type: '合約互動', hash: '0x1f9e...4a0c', status: '已完成' },
  { date: '2024-05-23', type: '授權', hash: '0x4d1a...9e3b', status: '失敗' }
])

// === 2.5 建立過濾後的列表 (Ref) 與手動篩選函式 ===
// 預設先放入所有假資料
const filteredList = ref<TransactionHistory[]>([...historyList.value])

const applyFilter = () => {
  filteredList.value = historyList.value.filter(item => {
    // 1. Hash 模糊比對
    const matchHash = item.hash.toLowerCase().includes(searchHash.value.toLowerCase())
    
    // 2. 日期區間比對 (字串直接比對 YYYY-MM-DD 即可)
    let matchDate = true
    if (startDate.value && endDate.value) {
      matchDate = item.date >= startDate.value && item.date <= endDate.value
    } else if (startDate.value) {
      matchDate = item.date >= startDate.value
    } else if (endDate.value) {
      matchDate = item.date <= endDate.value
    }

    return matchHash && matchDate
  })
}

// === 3. 交易明細 Modal 控制 ===
const selectedTransaction = ref<TransactionHistory | null>(null)
const openDetail = (item: TransactionHistory) => {
  selectedTransaction.value = item
}
const closeDetail = () => {
  selectedTransaction.value = null
}
</script>

<template>
  <Teleport to="body">
    <div id="history-modal" class="modal-overlay" v-if="isOpen">
      <div class="modal-content">
        <div class="modal-header">
          <h2>🔍 交易紀錄與資料查詢</h2>
          <span class="close-btn" @click="emit('close')">&times;</span>
        </div>
        <div class="modal-body">
          <div class="search-box" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
            <div style="display: flex; gap: 10px;">
              <input type="text" id="modal-search" placeholder="搜尋交易 Hash..." v-model="searchHash" style="margin-bottom: 0;">
              <button class="verify-btn" style="background: var(--primary-color) !important; color: var(--background-color) !important; white-space: nowrap;" @click="applyFilter">搜尋 Hash</button>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <input type="date" v-model="startDate" style="margin-bottom: 0; flex: 1;">
              <span style="color: #94a3b8;">~</span>
              <input type="date" v-model="endDate" style="margin-bottom: 0; flex: 1;">
              <button class="verify-btn" style="background: var(--secondary-color) !important; color: #fff !important; white-space: nowrap;" @click="applyFilter">篩選區間</button>
            </div>
          </div>
          <div class="history-list-container">
            <table class="history-table">
              <thead>
                <tr>
                  <th>時間</th>
                  <th>類型</th>
                  <th>Hash</th>
                  <th>狀態</th>
                </tr>
              </thead>
              <tbody id="history-data">
                <!-- 3. 使用 v-for 跑迴圈渲染假資料 -->
              <tr v-for="(item, index) in filteredList" :key="index" @click="openDetail(item)" style="cursor: pointer;" title="點擊查看明細">
                  <td>{{ item.date }}</td>
                  <td>{{ item.type }}</td>
                  <td class="hash-text">{{ item.hash }}</td>
                  <td :style="{ color: item.status === '已完成' ? 'var(--primary-color)' : '#94a3b8' }">
                    {{ item.status }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 交易明細 Modal (第二層視窗) -->
    <div id="detail-modal" class="modal-overlay" v-if="selectedTransaction" style="z-index: 2010;">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header">
          <h2>📄 交易明細</h2>
          <span class="close-btn" @click="closeDetail">&times;</span>
        </div>
        <div class="modal-body">
          <div style="display: flex; flex-direction: column; gap: 15px; font-size: 1.1rem; padding: 10px 0;">
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
              <span style="color: #94a3b8;">時間:</span> <span>{{ selectedTransaction.date }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
              <span style="color: #94a3b8;">類型:</span> <span>{{ selectedTransaction.type }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px;">
              <span style="color: #94a3b8;">Hash:</span> <span class="hash-text">{{ selectedTransaction.hash }}</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding-bottom: 10px;">
              <span style="color: #94a3b8;">狀態:</span>
              <span :style="{ color: selectedTransaction.status === '已完成' ? 'var(--primary-color)' : '#94a3b8', fontWeight: 'bold' }">{{ selectedTransaction.status }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>