<script setup>
import { ref } from 'vue';
import '../css/blockAdmin.css';

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

