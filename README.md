├── frontend-nuxt/           # Nuxt3 前端專案
│   ├── components/          # Web3 錢包連接與交易組件
│   ├── composables/         # useWeb3, useContract 等邏輯
│   └── server/              # Nitro Server API (BFF 層)
├── backend-services/        # Java 微服務
│   ├── api-gateway/         # 網關服務
│   ├── transaction-service/ # 負責 Web3j 合約調用與監聽
│   └── user-service/        # 用戶資料與資產管理
├── k8s/                     # Kubernetes 配置
│   ├── deployments/         # 各服務部署文件
│   └── ingress.yaml         # 入口配置
└── contracts/               # Solidity 智能合約 (Hardhat/Foundry)


### 🔄 交易流向說明
1. **讀取數據**: Nuxt3 透過 `useFetch` 調用 Java 後端 API，或直接透過 `viem` 讀取鏈上數據。
2. **發起交易**: 
   - 用戶透過前端 MetaMask 簽名。
   - 或是前端調用 Java API，由後端使用 Web3j 進行「託管式簽名」或「多重簽名」邏輯處理。
3. **異步確認**: Java 後端 Web3j 監聽器捕捉到 `Transfer` 或自定義 `Event`，透過 WebSocket 通知前端並更新 DB。

## 📅 2026.05.15 更新日誌：前端狀態 UI 模板整合
本次更新完成了三隻前端狀態展示 UI 的 Vue 3 單文件組件 (SFC) 轉換與樣式隔離。

1. ⏳ **交易傳送等待 UI (`waitPage.vue`)**
   - **動態光條**：實作 10 段式進度光條，支援處理中 (藍色閃爍) 與已完成 (綠色) 狀態自動切換。
   - **狀態驅動**：全面使用 Vue `ref` 與 `computed` 替換原生 DOM 操作，實現資料驅動渲染。
2. 🌐 **區塊鏈初始化載入 UI (`InitLoadingPage.vue`)**
   - **多軌道動畫**：使用純 CSS 實作主節點與內、中、外圈衛星節點的同步旋轉動畫。
   - **樣式隔離**：全面加上 `initLoading-` 前綴與 `<style scoped>` 避免與系統其他組件發生樣式衝突。
3. ❌ **區塊鏈同步失敗 UI (`SyncErrorPage.vue`)**
   - **科技感故障視覺**：實作斷開的能量核心動畫 (`slow-glitch-spin`) 與自定義錯誤代碼顯示卡片。
   - **操作整合**：內建重啟連線的模擬按鈕 (`@click`) 與底部的系統版本/開發者資訊區塊。

## 📅 2026.05.20 更新日誌：Pinia 狀態管理與交易紀錄查詢系統整合
本次更新引進了全域狀態管理機制，並擴充了區塊鏈主控台的交易紀錄調閱功能與相關 UI 獨立組件。

1. 📦 **Pinia 狀態管理導入**
   - **全域狀態**：新增 Pinia 進行前端全域狀態管理，集中管理錢包連線狀態 (`isConnected`)、使用者地址 (`shortAddress`) 與帳戶餘額 (`balance`) 等共用資料。
   - **邏輯解耦**：將 Web3 錢包連線等共用邏輯抽離至 Store (如 `walletStore`)，提升 Vue 3 頁面組件的整潔度與可維護性。
2. 📋 **交易紀錄查詢 Modal (`queryTransfer.vue`)**
   - **獨立組件與無縫掛載**：將交易紀錄查詢功能抽離為獨立 SFC，並利用 Vue `<Teleport to="body">` 解決 CSS `transform` / `backdrop-filter` 導致的跑版與層級限制問題。
   - **多條件動態篩選**：實作基於交易 Hash 與自訂日期區間的複合過濾功能，並透過 `Props` 與 `Emits` 實現父子組件狀態的單向資料流同步。
3. 📄 **交易明細彈窗 Modal**
   - **多層次彈窗架構**：在查詢列表中新增第二層檢視用的明細 Modal，支援點擊單筆紀錄展開詳細資訊（Hash、時間、類型、狀態）。
   - **互動體驗優化**：利用計算屬性與狀態綁定處理資料選取，確保雙層 Modal 的 `z-index` 堆疊正確覆蓋，並維持科技感 UI 一致性。
   - **操作整合**：內建重啟連線的模擬按鈕 (`@click`) 與底部的系統版本/開發者資訊區塊。

