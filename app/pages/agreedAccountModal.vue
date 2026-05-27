<script setup lang="ts">
import { ref } from 'vue'
import { useWalletStore } from '~/stores/wallet'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close', 'select'])

const walletStore = useWalletStore()

const newAccountName = ref('')
const newAccountAddress = ref('')

const addAccount = () => {
  if (!newAccountName.value || !newAccountAddress.value) {
    alert('請填寫完整名稱與地址！')
    return
  }
  walletStore.agreedAccounts.push({
    name: newAccountName.value,
    address: newAccountAddress.value
  })
  newAccountName.value = ''
  newAccountAddress.value = ''
  alert('✅ 約定帳戶新增成功！')
}

const selectAccount = (address: string) => {
  emit('select', address)
  emit('close')
}

const removeAccount = (index: number) => {
  walletStore.agreedAccounts.splice(index, 1)
}

const closeModal = () => {
  emit('close')
}
</script>

<template>
  <ClientOnly>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content agreed-modal">
        <div class="modal-header">
          <h2>📒 約定帳戶設定</h2>
          <span class="close-btn" @click="closeModal">&times;</span>
        </div>
        <div class="modal-body">
          <div class="form-group add-account-group">
            <input type="text" v-model="newAccountName" placeholder="輸入帳戶名稱" />
            <input type="text" v-model="newAccountAddress" placeholder="輸入帳戶地址" />
            <button class="action-btn submit-btn" @click="addAccount">➕ 新增</button>
          </div>
          
          <div class="table-container">
            <table class="history-table">
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>地址</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(acc, index) in walletStore.agreedAccounts" :key="index">
                  <td>{{ acc.name }}</td>
                  <td class="hash-text">{{ acc.address.slice(0,6) }}...{{ acc.address.slice(-4) }}</td>
                  <td>
                    <button class="action-btn select-btn" @click="selectAccount(acc.address)">選擇</button>
                    <button class="action-btn delete-btn" @click="removeAccount(index)">刪除</button>
                  </td>
                </tr>
                <tr v-if="walletStore.agreedAccounts.length === 0">
                  <td colspan="3" style="text-align: center; color: #94a3b8;">目前尚無約定帳戶</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
  </ClientOnly>
</template>

<style scoped>
.agreed-modal { max-width: 600px; }
.add-account-group { display: flex; gap: 10px; margin-bottom: 20px; align-items: flex-start; }
.add-account-group input { margin-bottom: 0; flex: 1; padding: 10px 14px; font-size: 0.95rem; }
.action-btn { padding: 8px 12px; font-size: 0.85rem; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; transition: 0.3s; }
.action-btn:hover { transform: translateY(-2px); }
.submit-btn { background: #10b981; color: white; white-space: nowrap; height: 42px; display: inline-flex; align-items: center; }
.select-btn { background: var(--primary-color); color: #020617; margin-right: 8px; }
.delete-btn { background: #ef4444; color: white; }
.table-container { overflow-x: auto; }
.history-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
.history-table th { background: rgba(255, 255, 255, 0.03); color: #94a3b8; padding: 12px; text-align: left; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.history-table td { padding: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #e2e8f0; vertical-align: middle; }
.hash-text { font-family: 'JetBrains Mono', Consolas, monospace; color: var(--secondary-color); background: rgba(79, 172, 254, 0.1); padding: 4px 8px; border-radius: 4px; }
</style>