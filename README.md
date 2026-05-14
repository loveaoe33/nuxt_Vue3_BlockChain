# Nuxt3 Web3 Microservices DApp

這是一個基於 Nuxt3 構建前端介面，Java Spring Boot + Web3j 作為後端微服務，並透過 Kubernetes 部署的去中心化應用（DApp）交易系統。

## 🏗️ 系統架構

- **前端 (Frontend)**: [Nuxt 3](https://nuxt.com/) + Vue 3 + Tailwind CSS + Ethers.js/Viem
- **後端 (Backend)**: Java 21 + Spring Boot 3 + [Web3j](https://docs.web3j.io/)
- **數據庫**: PostgreSQL (業務數據), Redis (快取)
- **部署**: Docker + Kubernetes (K8s) + Helm
- **區塊鏈**: EVM 兼容鏈 (Ethereum, BSC, Polygon)

## 📁 目錄結構

```text
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