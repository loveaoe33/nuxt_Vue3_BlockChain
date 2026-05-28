/**
 * 定義轉帳請求的參數 (Payload)
 * 透過物件傳遞參數，未來若要新增 gasLimit, nonce, chainId 等欄位，
 * 都不用去修改函式的簽名 (Function Signature)，具備極佳延展性。
 */
export interface TransferPayload {
  sender: string;
  receiver: string;
  amount: number;
  memo?: string;      // 轉帳備註 (可選)
  network?: string;   // 預留未來跨鏈使用的網路代號 (可選)
}

/**
 * 定義轉帳執行的回傳結果 (Result)
 */
export interface TransferResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
  timestamp: number;
}

/**
 * 定義區塊鏈服務的介面 (Interface)
 * 這是一份合約，規定所有「區塊鏈服務」都必須實作這些方法。
 * 未來你可以寫一個 RealWeb3Service 去實作它，無痛替換。
 */
export interface IBlockchainService {
  verifyAddressFormat(address: string): boolean;
  executeTransfer(payload: TransferPayload): Promise<TransferResult>;
}

/**
 * 具體的服務實作類別 (目前可作為與 Server 溝通或模擬的範例)
 */
export class CoreBlockchainService implements IBlockchainService {
  
  // 驗證地址格式是否符合基礎的區塊鏈格式 (例如 0x 開頭加 40 碼 16 進制)
  public verifyAddressFormat(address: string): boolean {
    const ethRegex = /^0x[a-fA-F0-9]{40}$/i;
    return ethRegex.test(address);
  }

  // 執行轉帳封裝 (這裡設計成非同步，準備串接 API)
  public async executeTransfer(payload: TransferPayload): Promise<TransferResult> {
    try {
      console.log(`[Blockchain Server] 準備發送交易... 發送者: ${payload.sender}, 接收者: ${payload.receiver}`);
      
      // 模擬向伺服器發送 Request 的延遲
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 成功回傳模擬的 Hash
      const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
      return { success: true, transactionHash: mockHash, timestamp: Date.now() };
      
    } catch (err: any) {
      return { success: false, error: err.message || '伺服器執行轉帳發生錯誤', timestamp: Date.now() };
    }
  }
}

// 導出一個單例 (Singleton) 供全域使用
export const blockchainService = new CoreBlockchainService();