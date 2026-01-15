<template>
  <div class="ba-body">
    <div class="ba-root">
      <div class="ba-main-container">
        <div class="ba-card">
          <header class="ba-header">
            <div class="ba-header-left">
              <h1 class="ba-title">🛡️ 系統管理員控制台</h1>
              <p class="ba-warning-text">⚠️ 高權限存取：此介面操作將直接影響系統狀態，請謹慎。</p>
            </div>
            <div class="ba-header-right" style="display: flex; flex-direction: column; align-items: flex-end; gap: 10px;">
              <NuxtLink to="/public_main" class="ba-back-nav">[返回公共介面]</NuxtLink>
              <div class="ba-dynamic-actions" style="display: flex; gap: 8px; flex-wrap: wrap; justify-content: flex-end;">
                <button v-for="(btn, index) in actionButtons" :key="index" class="ba-btn-mini" @click="handleAction(btn.label)">
                  {{ btn.label }}
                </button>
                <button class="ba-btn-mini-add" @click="addNewAction">+ 新增功能</button>
              </div>
            </div>
          </header>

          <section class="ba-content-section">
            <h3 class="ba-sub-title">👥 待審核帳號 (第 {{ currentPage }} 頁 / 共 {{ totalPages }} 頁)</h3>
            
            <div class="ba-toolbar">
              <div class="ba-filter-unit">
                <label class="ba-label">按申請日期篩選:</label>
                <input type="date" v-model="filterDate" class="ba-input-native">
              </div>
              <div class="ba-toolbar-actions" style="display: flex; gap: 10px;">
                <button class="ba-btn ba-btn-warn" @click="applyFilter">套用篩選</button>
                <button class="ba-btn ba-btn-secondary" @click="fetchAllApplications">帶出全部申請</button>
              </div>
            </div>
            
            <div class="ba-list-wrapper">
              <div v-for="user in userList" :key="user.id" class="ba-list-item" @click="openDetails(user)">
                <div class="ba-item-info">
                  <code class="ba-code">{{ user.address }}</code>
                  <span class="ba-timestamp">{{ user.date }}</span>
                </div>
                <button class="ba-btn ba-btn-outline" @click.stop="openDetails(user)">🔍 審核</button>
              </div>
            </div>
            
            <div class="ba-action-footer">
              <div class="ba-pager">
                <button class="ba-pager-btn" @click.stop="prevPage" :disabled="currentPage === 1">上一頁</button>
                <span class="ba-pager-info">{{ currentPage }} / {{ totalPages }}</span>
                <button class="ba-pager-btn" @click.stop="nextPage" :disabled="currentPage === totalPages">下一頁</button>
              </div>
              <div class="ba-batch-btns" style="display: flex; gap: 12px;">
                <button class="ba-btn ba-btn-danger" @click.stop="batchAction('reject')">全部拒絕</button>
                <button class="ba-btn ba-btn-success" @click.stop="batchAction('approve')">全部通過</button>
              </div>
            </div>
          </section>

          <section class="ba-content-section log-space" style="margin-top: 40px;">
            <h3 class="ba-sub-title">📜 Emit Log 事件調閱</h3>
            <div class="ba-log-header" style="display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; margin-bottom: 15px;">
              <div class="ba-filter-unit" style="flex: 1; min-width: 160px;">
                <label class="ba-label">起始日期:</label>
                <input type="date" v-model="logStartDate" class="ba-input-native">
              </div>
              <div class="ba-filter-unit" style="flex: 1; min-width: 160px;">
                <label class="ba-label">結束日期:</label>
                <input type="date" v-model="logEndDate" class="ba-input-native">
              </div>
              <div class="ba-filter-unit" style="flex: 1; min-width: 160px;">
                <label class="ba-label">事件類型:</label>
                <select v-model="selectedLogType" class="ba-select-native">
                  <option value="transfer">Transfer(交易紀錄)</option>
                  <option value="admin_action">AdminAction(管理員操作)</option>
                </select>
              </div>
              <button class="ba-btn ba-btn-secondary" @click="fetchLogs" style="height: 46px;">FETCH LOG</button>
            </div>
            <div class="ba-console">
              <pre class="ba-pre">{{ logContent }}</pre>
            </div>
          </section>
        </div>
      </div>
      
      <Teleport to="body">
        <div v-if="isModalOpen" class="ba-modal-mask" @click.self="closeModal">
          <div class="ba-modal-window">
            <div class="ba-modal-head">
              <h2 class="ba-modal-title">📑 審核細節</h2>
              <button class="ba-modal-close" @click="closeModal">&times;</button>
            </div>
            <div class="ba-modal-body">
              <div class="ba-data-row">
                <span class="ba-data-label">帳號:</span>
                <span class="ba-data-value">{{ activeUser.address }}</span>
              </div>
              <div class="ba-data-row">
                <span class="ba-data-label">日期:</span>
                <span class="ba-data-value">{{ activeUser.date }}</span>
              </div>
              <div class="ba-data-row">
                <span class="ba-data-label">信箱:</span>
                <span class="ba-data-value">{{ activeUser.email }}</span>
              </div>
              <div class="ba-data-row vertical">
                <span class="ba-data-label">註冊理由:</span>
                <div class="ba-reason-box">{{ activeUser.reason }}</div>
              </div>
            </div>
            <div class="ba-modal-foot">
              <button class="ba-btn ba-btn-danger" @click="processReview('reject')">❌ 拒絕</button>
              <button class="ba-btn ba-btn-success" @click="processReview('approve')">✅ 通過</button>
            </div>
          </div>
        </div>
      </Teleport>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isModalOpen = ref(false);
const currentPage = ref(1);
const totalPages = ref(5);
const filterDate = ref('2026-01-15');

// Log 查詢相關
const logStartDate = ref('2026-01-01');
const logEndDate = ref('2026-01-15');
const selectedLogType = ref('transfer');
const logContent = ref('// System initialized...\n// Waiting for fetch command...');

// 右上角功能按鈕
const actionButtons = ref([{ label: '導出 CSV' }, { label: '清空快取' }]);
const handleAction = (label) => alert('觸發功能: ' + label);
const addNewAction = () => {
  const name = prompt('請輸入新功能名稱:');
  if (name) actionButtons.value.push({ label: name });
};

// 列表數據
const userList = ref([
  { id: 1, address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F', date: '2026-01-15', email: 'admin@system.io', reason: '申請高權限合約操作。' },
  { id: 2, address: '0x388C818CA8B9251b393131C08a736A67ccB19297', date: '2026-01-14', email: 'dev_test@chain.com', reason: '參與測試網壓力測試。' }
]);

const activeUser = ref({});
const openDetails = (u) => { 
  activeUser.value = u; 
  isModalOpen.value = true; 
};
const closeModal = () => { 
  isModalOpen.value = false; 
};
const processReview = (a) => { 
  alert('已執行: ' + a); 
  closeModal(); 
};

const applyFilter = () => alert('已套用日期篩選: ' + filterDate.value);
const fetchAllApplications = () => { filterDate.value = ''; alert('正在獲取所有待審核申請...'); };

const fetchLogs = () => { 
  logContent.value = `// Fetching: ${selectedLogType.value}\n// Period: ${logStartDate.value} ~ ${logEndDate.value}\n// Success at ` + new Date().toLocaleTimeString(); 
};

const prevPage = () => { if(currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if(currentPage.value < totalPages.value) currentPage.value++; };
const batchAction = (a) => alert('批次操作: ' + a);
</script>

<style scoped>
/* 核心變數與基礎樣式 */
.ba-body {
  --primary-color: #38c1a1;
  --secondary-color: #6a8dff;
  --background-color: #0c1c3a;
  --card-background: #1e365e;
  --text-color: #e0eafb;
  --success-color: #38c1a1;
  --danger-color: #ff6b6b;
  --border-radius: 8px;
  min-height: 100vh;
  background-color: var(--background-color);
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: var(--text-color);
  padding: 40px 15px;
}

.ba-root *, .ba-root *::before, .ba-root *::after { box-sizing: border-box !important; }
.ba-main-container { max-width: 1000px; margin: 0 auto; }
.ba-card { background-color: var(--card-background); border-radius: var(--border-radius); padding: clamp(15px, 5%, 30px); border: 1px solid rgba(56, 193, 161, 0.4); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); }

/* Header */
.ba-header { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; border-bottom: 2px solid rgba(56, 193, 161, 0.2); padding-bottom: 20px; margin-bottom: 30px; }
.ba-title { font-size: 1.8rem; margin: 0; color: var(--primary-color); }
.ba-btn-mini { background: transparent; border: 1px solid var(--secondary-color); color: var(--secondary-color); font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; cursor: pointer; transition: 0.2s; }
.ba-btn-mini:hover { background: var(--secondary-color); color: #fff; }
.ba-btn-mini-add { background: rgba(56, 193, 161, 0.1); border: 1px dashed var(--primary-color); color: var(--primary-color); font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; cursor: pointer; }

/* 工具列 */
.ba-toolbar { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; margin-bottom: 25px; }
.ba-filter-unit { flex: 1; min-width: 200px; }
.ba-label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: var(--secondary-color); }
.ba-input-native, .ba-select-native { width: 100%; padding: 12px; background-color: #15294a; border: 1px solid var(--secondary-color); border-radius: var(--border-radius); color: var(--text-color); outline: none; }

/* 列表與按鈕 */
.ba-list-item { display: grid; grid-template-columns: 1fr auto; align-items: center; padding: 15px 20px; background: rgba(0, 0, 0, 0.15); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: var(--border-radius); margin-bottom: 12px; cursor: pointer; }
.ba-list-item:hover { border-color: var(--primary-color); background: rgba(56, 193, 161, 0.1); }
.ba-code { font-family: monospace; }
.ba-btn { padding: 10px 20px; border-radius: var(--border-radius); font-weight: bold; cursor: pointer; transition: 0.3s; border: none; }
.ba-btn-warn { background-color: var(--primary-color); color: var(--background-color); }
.ba-btn-secondary { background-color: var(--secondary-color); color: #fff; }
.ba-btn-danger { background-color: var(--danger-color); color: #fff; }
.ba-btn-success { background-color: var(--success-color); color: #fff; }
.ba-btn-outline { background: transparent; border: 1px solid var(--primary-color); color: var(--primary-color); }

/* Modal 核心樣式（補回這部分） */
.ba-modal-mask {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
  padding: 20px;
}
.ba-modal-window {
  background-color: var(--card-background);
  border: 1px solid var(--primary-color);
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  padding: 25px;
  box-shadow: 0 0 30px rgba(56, 193, 161, 0.3);
}
.ba-modal-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.ba-modal-title { margin: 0; color: var(--primary-color); font-size: 1.5rem; }
.ba-modal-close { background: none; border: none; color: #fff; font-size: 1.8rem; cursor: pointer; }
.ba-data-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.ba-data-row.vertical { flex-direction: column; gap: 8px; }
.ba-data-label { color: var(--secondary-color); font-size: 0.9rem; }
.ba-reason-box { background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 6px; color: #ff9900; line-height: 1.5; }
.ba-modal-foot { display: flex; justify-content: flex-end; gap: 12px; margin-top: 25px; }

/* Pager & Console */
.ba-action-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px; margin-top: 30px; }
.ba-pager { display: flex; align-items: center; gap: 15px; background: rgba(0,0,0,0.2); padding: 5px 15px; border-radius: 30px; }
.ba-pager-btn { background: none; border: 1px solid #444; color: #fff; padding: 2px 8px; border-radius: 4px; cursor: pointer; }
.ba-console { background-color: #000; border-radius: var(--border-radius); border: 1px solid rgba(255, 153, 0, 0.4); margin-top: 15px; }
.ba-pre { margin: 0; padding: 15px; color: #ff9900; font-family: 'Consolas', monospace; font-size: 0.9rem; white-space: pre-wrap; }

/* RWD */
@media (max-width: 600px) {
  .ba-header-right { align-items: stretch !important; width: 100%; }
  .ba-action-footer { flex-direction: column; align-items: stretch; }
  .ba-batch-btns { justify-content: space-between; gap: 8px !important; }
  .ba-batch-btns button { flex: 1; }
}
</style>