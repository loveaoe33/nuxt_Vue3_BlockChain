<script setup lang="ts">
import { ref } from 'vue'
import { useWalletStore } from '~/stores/wallet'
import '../css/specialStoreModal.css'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const walletStore = useWalletStore()

// 表單綁定狀態
const selectedCompanyId = ref('')
const inputGroup = ref('')
const selectedAgreedAccountAddress = ref('')

// 確認彈窗的開關
const showConfirmModal = ref(false)

// 按鈕1: 新增 (清空表單，準備輸入下一筆)
const resetForm = () => {
  selectedCompanyId.value = ''
  inputGroup.value = ''
  selectedAgreedAccountAddress.value = ''
}

// 按鈕2: 確認帳號 (檢查是否有漏填，若無則開啟確認彈窗)
const verifyAccount = () => {
  if (!selectedCompanyId.value || !inputGroup.value || !selectedAgreedAccountAddress.value) {
    alert('⚠️ 請選擇公司、輸入群組、並從約定帳戶中選擇一個帳號！')
    return
  }
  showConfirmModal.value = true
}

// 確認彈窗中的「確認新增」動作
const confirmAdd = () => {
  const companyId = selectedCompanyId.value
  const selectedAccount = walletStore.agreedAccounts.find(a => a.address === selectedAgreedAccountAddress.value)

  if (!selectedAccount) {
    alert('❌ 錯誤：找不到選擇的約定帳戶，請重新操作。')
    showConfirmModal.value = false
    return
  }

  // 確認該群組是否已存在於該公司下，若無則建立新群組
  let groupId = ''
  const existingGroup = walletStore.vipGroups.find(g => g.companyId === companyId && g.name === inputGroup.value)
  if (existingGroup) {
    groupId = existingGroup.id
    existingGroup.accounts.push({
      name: selectedAccount.name,
      address: selectedAccount.address
    })
  } else {
    groupId = 'group_' + Date.now()
    walletStore.vipGroups.push({
      id: groupId,
      companyId: companyId,
      name: inputGroup.value,
      accounts: [
        { name: selectedAccount.name, address: selectedAccount.address }
      ]
    })
  }

  alert('✅ 成功新增特約群組與帳號！')
  showConfirmModal.value = false
  resetForm()
}

const closeModal = () => {
  emit('close')
}

// 刪除單筆特約帳號
const removeAccount = (groupId: string, accountIndex: number) => {
  const group = walletStore.vipGroups.find(g => g.id === groupId)
  if (group) {
    group.accounts.splice(accountIndex, 1)
  }
}

// 刪除整個群組
const removeGroup = (groupId: string) => {
  const index = walletStore.vipGroups.findIndex(g => g.id === groupId)
  if (index !== -1) {
    walletStore.vipGroups.splice(index, 1)
  }
}

// 透過 CompanyId 查詢公司名稱來顯示
const getCompanyName = (companyId: string) => {
  const comp = walletStore.companies.find(c => c.id === companyId)
  return comp ? comp.name : '未知公司'
}

const getSelectedAgreedAccount = () => {
  if (!selectedAgreedAccountAddress.value) return null
  return walletStore.agreedAccounts.find(a => a.address === selectedAgreedAccountAddress.value)
}
</script>

<template>
  <ClientOnly>
  <Teleport to="body">
    <!-- 主設定彈窗 -->
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content special-store-modal">
        <div class="modal-header">
          <h2>⚙️ 特約群組設定</h2>
          <span class="close-btn" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group-row" style="align-items: flex-start;">
            <select v-model="selectedCompanyId" style="flex: 1;">
              <option value="" disabled>-- 選擇特約合作公司 --</option>
              <option v-for="comp in walletStore.companies" :key="comp.id" :value="comp.id">
                {{ comp.name }}
              </option>
            </select>
            <input type="text" v-model="inputGroup" placeholder="輸入或定義新的 Group 名稱" style="flex: 1;" />
          </div>
          <div class="form-group">
            <label style="margin-top: 10px;">選擇要加入群組的約定帳戶：</label>
            <select v-model="selectedAgreedAccountAddress">
              <option value="" disabled>-- 從約定帳戶清單選擇 --</option>
              <option v-for="acc in walletStore.agreedAccounts" :key="acc.address" :value="acc.address">
                {{ acc.name }} ({{ acc.address.slice(0,10) }}...)
              </option>
            </select>
          </div>
          <div class="modal-footer" style="justify-content: flex-start; margin-top: 10px;">
            <button class="action-btn add-btn" @click="resetForm">➕ 新增(清空)</button>
            <button class="action-btn verify-btn" @click="verifyAccount">✅ 確認帳號</button>
            <button class="action-btn close-btn-action" @click="closeModal">❌ 關閉</button>
          </div>

          <hr class="divider" style="margin: 20px 0;" />

          <div class="table-container">
            <h3 style="margin-top: 0; color: var(--primary-color);">目前 Group 群組清單</h3>
            <div v-for="group in walletStore.vipGroups" :key="group.id" class="group-section">
              <div class="group-header">
                <strong>{{ getCompanyName(group.companyId) }}</strong> - {{ group.name }}
                <button class="action-btn delete-btn" @click="removeGroup(group.id)" style="padding: 4px 8px; font-size: 0.75rem; margin-left: auto;">刪除群組</button>
              </div>
              <table class="history-table" style="margin-top: 5px;">
                <thead>
                  <tr>
                    <th>帳戶名稱</th>
                    <th>地址</th>
                    <th style="width: 80px;">操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(acc, index) in group.accounts" :key="index">
                    <td>{{ acc.name }}</td>
                    <td class="hash-text">{{ acc.address.slice(0,6) }}...{{ acc.address.slice(-4) }}</td>
                    <td>
                      <button class="action-btn delete-btn" @click="removeAccount(group.id, index)">刪除</button>
                    </td>
                  </tr>
                  <tr v-if="group.accounts.length === 0">
                    <td colspan="3" style="text-align: center; color: #94a3b8;">目前尚無帳號</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="walletStore.vipGroups.length === 0" style="text-align: center; color: #94a3b8; padding: 20px;">
              目前尚無任何特約群組
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 二次確認帳號彈窗 -->
    <div v-if="showConfirmModal" class="modal-overlay" style="z-index: 10000;" @click.self="showConfirmModal = false">
      <div class="modal-content confirm-modal">
        <div class="modal-header">
          <h2>⚠️ 確認帳號資訊</h2>
          <span class="close-btn" @click="showConfirmModal = false">&times;</span>
        </div>
        <div class="modal-body">
          <p><strong>合作公司:</strong> {{ getCompanyName(selectedCompanyId) }}</p>
          <p><strong>群組名稱:</strong> {{ inputGroup }}</p>
          <p><strong>帳戶名稱:</strong> {{ getSelectedAgreedAccount()?.name }}</p>
          <p><strong>帳戶地址:</strong> <span class="hash-text">{{ getSelectedAgreedAccount()?.address.slice(0,6) }}...{{ getSelectedAgreedAccount()?.address.slice(-4) }}</span></p>
          <p style="margin-top: 15px; color: #fbbf24;">請確認以上資訊是否正確？</p>
        </div>
        <div class="modal-footer">
          <button class="action-btn submit-btn" @click="confirmAdd">✅ 確認新增</button>
          <button class="action-btn close-btn-action" @click="showConfirmModal = false">❌ 取消</button>
        </div>
      </div>
    </div>
  </Teleport>
  </ClientOnly>
</template>
